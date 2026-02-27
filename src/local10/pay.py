from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime, time, timedelta
from decimal import Decimal

from .models import DayBreakdown, PayConfig, Shift, WeekSummary

_MINUTES_PER_HOUR = Decimal("60")


def week_bounds(week_start: date) -> tuple[datetime, datetime]:
    start_dt = datetime.combine(week_start, time.min)
    end_dt = start_dt + timedelta(days=7)
    return start_dt, end_dt


def _worked_minutes_by_day(shifts: list[Shift]) -> dict[date, int]:
    minutes_by_day: dict[date, int] = defaultdict(int)

    for shift in shifts:
        start = shift.start
        end = shift.end
        if end <= start:
            continue

        # Split by midnights; apply break minutes to the first segment.
        remaining_break = max(0, int(shift.break_minutes))
        seg_start = start
        while seg_start.date() < end.date():
            midnight = datetime.combine(seg_start.date() + timedelta(days=1), time.min)
            seg_minutes = int((midnight - seg_start).total_seconds() // 60)
            if remaining_break:
                take = min(seg_minutes, remaining_break)
                seg_minutes -= take
                remaining_break -= take
            minutes_by_day[seg_start.date()] += max(0, seg_minutes)
            seg_start = midnight

        # Last segment
        seg_minutes = int((end - seg_start).total_seconds() // 60)
        if remaining_break:
            take = min(seg_minutes, remaining_break)
            seg_minutes -= take
            remaining_break -= take
        minutes_by_day[seg_start.date()] += max(0, seg_minutes)

    return dict(minutes_by_day)


def _day_breakdown(day: date, worked_minutes: int, cfg: PayConfig) -> DayBreakdown:
    worked_hours = (Decimal(worked_minutes) / _MINUTES_PER_HOUR).quantize(Decimal("0.01"))

    reg_cap = cfg.daily_regular_hours
    dt_after = cfg.daily_doubletime_after_hours

    regular = min(worked_hours, reg_cap)
    overtime = Decimal("0")
    doubletime = Decimal("0")

    if worked_hours > reg_cap:
        overtime = min(worked_hours, dt_after) - reg_cap
        overtime = max(Decimal("0"), overtime)
    if worked_hours > dt_after:
        doubletime = worked_hours - dt_after

    # Keep two decimals for reporting consistency.
    return DayBreakdown(
        day=day,
        regular_hours=regular.quantize(Decimal("0.01")),
        overtime_hours=overtime.quantize(Decimal("0.01")),
        doubletime_hours=doubletime.quantize(Decimal("0.01")),
    )


def summarize_week(shifts: list[Shift], week_start: date, cfg: PayConfig) -> WeekSummary:
    minutes_by_day = _worked_minutes_by_day(shifts)

    days: list[DayBreakdown] = []
    for i in range(7):
        d = week_start + timedelta(days=i)
        days.append(_day_breakdown(d, minutes_by_day.get(d, 0), cfg))

    if cfg.weekly_regular_cap_hours is not None:
        cap = cfg.weekly_regular_cap_hours
        running_regular = Decimal("0")
        adjusted: list[DayBreakdown] = []
        for day in days:
            reg = day.regular_hours
            ot = day.overtime_hours
            dt = day.doubletime_hours

            next_running = running_regular + reg
            if next_running > cap:
                overflow = next_running - cap
                overflow = min(overflow, reg)
                reg = (reg - overflow).quantize(Decimal("0.01"))
                ot = (ot + overflow).quantize(Decimal("0.01"))
                next_running = cap

            adjusted.append(
                DayBreakdown(
                    day=day.day,
                    regular_hours=reg,
                    overtime_hours=ot,
                    doubletime_hours=dt,
                )
            )
            running_regular = next_running
        days = adjusted

    total_reg = sum((d.regular_hours for d in days), Decimal("0"))
    total_ot = sum((d.overtime_hours for d in days), Decimal("0"))
    total_dt = sum((d.doubletime_hours for d in days), Decimal("0"))

    pay = (
        cfg.base_rate * total_reg
        + cfg.base_rate * cfg.overtime_multiplier * total_ot
        + cfg.base_rate * cfg.doubletime_multiplier * total_dt
    ).quantize(Decimal("0.01"))

    return WeekSummary(
        week_start=week_start,
        week_end=week_start + timedelta(days=6),
        days=days,
        total_regular_hours=total_reg.quantize(Decimal("0.01")),
        total_overtime_hours=total_ot.quantize(Decimal("0.01")),
        total_doubletime_hours=total_dt.quantize(Decimal("0.01")),
        total_pay=pay,
    )

