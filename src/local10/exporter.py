from __future__ import annotations

import csv
import json
from io import StringIO

from .models import Shift


def shifts_to_csv(shifts: list[Shift]) -> str:
    buf = StringIO()
    writer = csv.writer(buf)
    writer.writerow(["id", "start", "end", "break_minutes", "worked_minutes", "job", "notes", "created_at"])
    for s in shifts:
        writer.writerow(
            [
                s.id,
                s.start.isoformat(sep=" ", timespec="minutes"),
                s.end.isoformat(sep=" ", timespec="minutes"),
                s.break_minutes,
                s.worked_minutes,
                s.job or "",
                s.notes or "",
                s.created_at.isoformat(sep=" ", timespec="seconds") if s.created_at else "",
            ]
        )
    return buf.getvalue()


def shifts_to_json(shifts: list[Shift]) -> str:
    payload = []
    for s in shifts:
        payload.append(
            {
                "id": s.id,
                "start": s.start.isoformat(sep=" ", timespec="minutes"),
                "end": s.end.isoformat(sep=" ", timespec="minutes"),
                "break_minutes": s.break_minutes,
                "worked_minutes": s.worked_minutes,
                "job": s.job,
                "notes": s.notes,
                "created_at": s.created_at.isoformat(sep=" ", timespec="seconds") if s.created_at else None,
            }
        )
    return json.dumps(payload, indent=2, sort_keys=True) + "\n"

