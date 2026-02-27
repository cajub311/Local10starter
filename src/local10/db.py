from __future__ import annotations

import sqlite3
from collections.abc import Iterable
from dataclasses import replace
from datetime import datetime
from pathlib import Path

from .models import Shift

SCHEMA = """
CREATE TABLE IF NOT EXISTS shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_ts TEXT NOT NULL,
  end_ts TEXT NOT NULL,
  break_minutes INTEGER NOT NULL DEFAULT 0,
  job TEXT,
  notes TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_shifts_start_ts ON shifts(start_ts);
"""


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.executescript(SCHEMA)
    return conn


def add_shift(conn: sqlite3.Connection, shift: Shift) -> Shift:
    created_at = datetime.now().astimezone().replace(tzinfo=None)
    cur = conn.execute(
        """
        INSERT INTO shifts (start_ts, end_ts, break_minutes, job, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            shift.start.isoformat(sep=" ", timespec="minutes"),
            shift.end.isoformat(sep=" ", timespec="minutes"),
            int(shift.break_minutes),
            shift.job,
            shift.notes,
            created_at.isoformat(sep=" ", timespec="seconds"),
        ),
    )
    conn.commit()
    return replace(shift, id=int(cur.lastrowid), created_at=created_at)


def _row_to_shift(row: sqlite3.Row) -> Shift:
    return Shift(
        id=int(row["id"]),
        start=datetime.fromisoformat(row["start_ts"]),
        end=datetime.fromisoformat(row["end_ts"]),
        break_minutes=int(row["break_minutes"]),
        job=row["job"],
        notes=row["notes"],
        created_at=datetime.fromisoformat(row["created_at"]),
    )


def list_shifts(conn: sqlite3.Connection, *, since: datetime | None = None, limit: int = 50) -> list[Shift]:
    if since is None:
        rows = conn.execute(
            "SELECT * FROM shifts ORDER BY start_ts DESC LIMIT ?",
            (int(limit),),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM shifts WHERE start_ts >= ? ORDER BY start_ts DESC LIMIT ?",
            (since.isoformat(sep=" ", timespec="minutes"), int(limit)),
        ).fetchall()
    return [_row_to_shift(r) for r in rows]


def shifts_between(conn: sqlite3.Connection, start: datetime, end: datetime) -> list[Shift]:
    rows = conn.execute(
        """
        SELECT * FROM shifts
        WHERE start_ts >= ? AND start_ts < ?
        ORDER BY start_ts ASC
        """,
        (start.isoformat(sep=" ", timespec="minutes"), end.isoformat(sep=" ", timespec="minutes")),
    ).fetchall()
    return [_row_to_shift(r) for r in rows]


def delete_shift(conn: sqlite3.Connection, shift_id: int) -> None:
    conn.execute("DELETE FROM shifts WHERE id = ?", (int(shift_id),))
    conn.commit()


def iter_all_shifts(conn: sqlite3.Connection) -> Iterable[Shift]:
    rows = conn.execute("SELECT * FROM shifts ORDER BY start_ts ASC").fetchall()
    for r in rows:
        yield _row_to_shift(r)

