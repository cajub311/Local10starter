from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from local10.models import PayConfig, Shift
from local10.pay import summarize_week


def _cfg() -> PayConfig:
    return PayConfig(
        base_rate=Decimal("50"),
        overtime_multiplier=Decimal("1.5"),
        doubletime_multiplier=Decimal("2.0"),
        daily_regular_hours=Decimal("8"),
        daily_doubletime_after_hours=Decimal("12"),
        weekly_regular_cap_hours=Decimal("40"),
    )


def test_daily_overtime_and_doubletime() -> None:
    ws = date.fromisoformat("2026-02-23")  # Monday
    shifts = [
        Shift(
            id=None,
            start=datetime.fromisoformat("2026-02-23 06:00"),
            end=datetime.fromisoformat("2026-02-23 20:00"),
            break_minutes=60,
            job=None,
            notes=None,
        )
    ]
    summary = summarize_week(shifts, ws, _cfg())
    mon = summary.days[0]
    # 14h span - 1h break = 13h worked => 8 reg, 4 OT, 1 DT
    assert mon.regular_hours == Decimal("8.00")
    assert mon.overtime_hours == Decimal("4.00")
    assert mon.doubletime_hours == Decimal("1.00")


def test_weekly_regular_cap_overflow_to_overtime() -> None:
    ws = date.fromisoformat("2026-02-23")  # Monday
    shifts: list[Shift] = []
    # Five 10h days (no break): each day => 8 reg, 2 OT, 0 DT
    for i in range(5):
        d = (ws.toordinal() + i)
        day = date.fromordinal(d).isoformat()
        shifts.append(
            Shift(
                id=None,
                start=datetime.fromisoformat(f"{day} 07:00"),
                end=datetime.fromisoformat(f"{day} 17:00"),
                break_minutes=0,
                job=None,
                notes=None,
            )
        )

    summary = summarize_week(shifts, ws, _cfg())
    # Daily totals before weekly cap: reg=40, ot=10
    # Weekly cap is 40, so no additional shifting.
    assert summary.total_regular_hours == Decimal("40.00")
    assert summary.total_overtime_hours == Decimal("10.00")
    assert summary.total_doubletime_hours == Decimal("0.00")


def test_midnight_split_break_applies_to_first_segment() -> None:
    ws = date.fromisoformat("2026-02-23")
    shifts = [
        Shift(
            id=None,
            start=datetime.fromisoformat("2026-02-23 23:00"),
            end=datetime.fromisoformat("2026-02-24 03:00"),
            break_minutes=30,
            job=None,
            notes=None,
        )
    ]
    summary = summarize_week(shifts, ws, _cfg())
    mon = summary.days[0]
    tue = summary.days[1]
    # Mon segment: 60m - 30m break = 30m => 0.50h
    assert mon.regular_hours == Decimal("0.50")
    # Tue segment: 180m => 3.00h
    assert tue.regular_hours == Decimal("3.00")

