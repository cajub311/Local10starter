from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal


@dataclass(frozen=True, slots=True)
class Shift:
    id: int | None
    start: datetime
    end: datetime
    break_minutes: int
    job: str | None
    notes: str | None
    created_at: datetime | None = None

    @property
    def worked_minutes(self) -> int:
        total = int((self.end - self.start).total_seconds() // 60)
        return max(0, total - self.break_minutes)


@dataclass(frozen=True, slots=True)
class PayConfig:
    base_rate: Decimal
    overtime_multiplier: Decimal
    doubletime_multiplier: Decimal
    daily_regular_hours: Decimal
    daily_doubletime_after_hours: Decimal
    weekly_regular_cap_hours: Decimal | None


@dataclass(frozen=True, slots=True)
class DayBreakdown:
    day: date
    regular_hours: Decimal
    overtime_hours: Decimal
    doubletime_hours: Decimal


@dataclass(frozen=True, slots=True)
class WeekSummary:
    week_start: date
    week_end: date
    days: list[DayBreakdown]
    total_regular_hours: Decimal
    total_overtime_hours: Decimal
    total_doubletime_hours: Decimal
    total_pay: Decimal

