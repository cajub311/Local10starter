from __future__ import annotations

import json
from datetime import date, datetime, time, timedelta
from decimal import Decimal
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console
from rich.table import Table

from .config import RawConfig, config_as_dict, ensure_default_config, load_config
from .db import add_shift, connect, iter_all_shifts, list_shifts, shifts_between
from .exporter import shifts_to_csv, shifts_to_json
from .models import PayConfig, Shift
from .paths import default_config_path, default_db_path
from .pay import summarize_week, week_bounds

app = typer.Typer(add_completion=False, no_args_is_help=True)
console = Console()


def _parse_date(s: str) -> date:
    try:
        return date.fromisoformat(s)
    except Exception as e:
        raise typer.BadParameter("Expected YYYY-MM-DD") from e


def _parse_hhmm(s: str) -> time:
    try:
        hh, mm = s.split(":")
        return time(hour=int(hh), minute=int(mm))
    except Exception as e:
        raise typer.BadParameter("Expected HH:MM (24h)") from e


def _parse_break_minutes(s: str) -> int:
    if s.isdigit():
        return max(0, int(s))
    if ":" in s:
        try:
            hh, mm = s.split(":")
            return max(0, int(hh) * 60 + int(mm))
        except Exception as e:
            raise typer.BadParameter("Expected minutes (e.g. 30) or HH:MM (e.g. 0:30)") from e
    raise typer.BadParameter("Expected minutes (e.g. 30) or HH:MM (e.g. 0:30)")


def _parse_decimal(s: str) -> Decimal:
    try:
        return Decimal(str(s))
    except Exception as e:
        raise typer.BadParameter("Expected a number (e.g. 57.25)") from e


def _resolve_db_path(cfg: RawConfig) -> Path:
    p = cfg.db_path.strip()
    return Path(p) if p else default_db_path()


def _pay_config(cfg: RawConfig, *, base_rate_override: Decimal | None = None) -> PayConfig:
    return PayConfig(
        base_rate=base_rate_override if base_rate_override is not None else cfg.base_rate,
        overtime_multiplier=cfg.overtime_multiplier,
        doubletime_multiplier=cfg.doubletime_multiplier,
        daily_regular_hours=cfg.daily_regular_hours,
        daily_doubletime_after_hours=cfg.daily_doubletime_after_hours,
        weekly_regular_cap_hours=cfg.weekly_regular_cap_hours,
    )


@app.command()
def init(
    force: Annotated[bool, typer.Option("--force", help="Overwrite existing config.")] = False,
) -> None:
    """Create a default config file (TOML)."""
    path = ensure_default_config(force=force)
    console.print(f"[bold]Config:[/bold] {path}")
    cfg = load_config(path)
    dbp = _resolve_db_path(cfg)
    console.print(f"[bold]DB:[/bold] {dbp}")


@app.command()
def config() -> None:
    """Print the current config and resolved paths."""
    path = default_config_path()
    cfg = load_config(path)
    payload = config_as_dict(cfg)
    payload["config_path"] = str(path)
    payload["resolved_db_path"] = str(_resolve_db_path(cfg))
    console.print_json(json.dumps(payload))


@app.command()
def add(
    day: Annotated[str, typer.Argument(help="Shift date (YYYY-MM-DD).")],
    start: Annotated[str, typer.Argument(help="Start time (HH:MM).")],
    end: Annotated[str, typer.Argument(help="End time (HH:MM).")],
    break_time: Annotated[
        str, typer.Option("--break", help="Break as minutes (30) or HH:MM (0:30).")
    ] = "0",
    job: Annotated[str | None, typer.Option("--job", help="Job/site label.")] = None,
    notes: Annotated[str | None, typer.Option("--notes", help="Notes.")] = None,
) -> None:
    """Add a shift to your local log."""
    cfg = load_config()
    shift_day = _parse_date(day)
    start_t = _parse_hhmm(start)
    end_t = _parse_hhmm(end)
    break_minutes = _parse_break_minutes(break_time)

    start_dt = datetime.combine(shift_day, start_t)
    end_dt = datetime.combine(shift_day, end_t)
    if end_dt <= start_dt:
        end_dt += timedelta(days=1)

    shift = Shift(id=None, start=start_dt, end=end_dt, break_minutes=break_minutes, job=job, notes=notes)
    with connect(_resolve_db_path(cfg)) as conn:
        saved = add_shift(conn, shift)

    console.print(f"[bold green]Saved[/bold green] shift #{saved.id} ({saved.worked_minutes} min worked)")


@app.command(name="list")
def list_(
    limit: Annotated[int, typer.Option("--limit", help="Max rows to show.")] = 25,
    since: Annotated[str | None, typer.Option("--since", help="Only shifts on/after YYYY-MM-DD.")] = None,
) -> None:
    """List recent shifts."""
    cfg = load_config()
    since_dt: datetime | None = None
    if since:
        since_dt = datetime.combine(_parse_date(since), time.min)

    with connect(_resolve_db_path(cfg)) as conn:
        shifts = list_shifts(conn, since=since_dt, limit=limit)

    table = Table(title="Shifts", show_lines=False)
    table.add_column("ID", justify="right")
    table.add_column("Start")
    table.add_column("End")
    table.add_column("Break", justify="right")
    table.add_column("Worked", justify="right")
    table.add_column("Job")

    for s in shifts:
        table.add_row(
            str(s.id or ""),
            s.start.strftime("%Y-%m-%d %H:%M"),
            s.end.strftime("%Y-%m-%d %H:%M"),
            f"{s.break_minutes}m",
            f"{s.worked_minutes}m",
            s.job or "",
        )
    console.print(table)


@app.command()
def week(
    day: Annotated[
        str | None, typer.Option("--day", help="Any date within the week (YYYY-MM-DD). Defaults to today.")
    ] = None,
    week_start: Annotated[
        str | None, typer.Option("--week-start", help="Explicit week start date (YYYY-MM-DD).")
    ] = None,
    rate: Annotated[
        str | None, typer.Option("--rate", help="Override base hourly rate for this report (e.g. 57.25).")
    ] = None,
) -> None:
    """Show weekly hours + estimated pay using your config rules."""
    cfg = load_config()
    if week_start:
        ws = _parse_date(week_start)
    else:
        anchor = _parse_date(day) if day else date.today()
        ws = anchor - timedelta(days=anchor.weekday())  # Monday start

    start_dt, end_dt = week_bounds(ws)
    with connect(_resolve_db_path(cfg)) as conn:
        shifts = shifts_between(conn, start_dt, end_dt)

    rate_override = _parse_decimal(rate) if rate is not None else None
    summary = summarize_week(shifts, ws, _pay_config(cfg, base_rate_override=rate_override))

    table = Table(
        title=f"Week {summary.week_start.isoformat()} → {summary.week_end.isoformat()}",
        show_lines=False,
    )
    table.add_column("Day")
    table.add_column("Regular", justify="right")
    table.add_column("OT", justify="right")
    table.add_column("DT", justify="right")

    for d in summary.days:
        label = d.day.strftime("%a %Y-%m-%d")
        table.add_row(label, f"{d.regular_hours}", f"{d.overtime_hours}", f"{d.doubletime_hours}")

    console.print(table)
    console.print(
        f"[bold]Totals[/bold]  reg={summary.total_regular_hours}  "
        f"ot={summary.total_overtime_hours}  dt={summary.total_doubletime_hours}"
    )
    console.print(f"[bold]Est. pay[/bold]  ${summary.total_pay}")


@app.command()
def export(
    fmt: Annotated[str, typer.Option("--format", help="csv or json")] = "csv",
    output: Annotated[Path | None, typer.Option("--output", help="Write to file (defaults to stdout).")] = None,
) -> None:
    """Export all shifts as CSV or JSON."""
    cfg = load_config()
    with connect(_resolve_db_path(cfg)) as conn:
        shifts = list(iter_all_shifts(conn))

    fmt_norm = fmt.strip().lower()
    if fmt_norm == "csv":
        data = shifts_to_csv(shifts)
    elif fmt_norm == "json":
        data = shifts_to_json(shifts)
    else:
        raise typer.BadParameter("format must be csv or json")

    if output:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(data, encoding="utf-8")
        console.print(f"[bold green]Wrote[/bold green] {output}")
    else:
        console.print(data, end="")


def main() -> None:
    app()


if __name__ == "__main__":
    main()

