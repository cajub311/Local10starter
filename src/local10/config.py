from __future__ import annotations

import os
import tomllib
from dataclasses import asdict, dataclass
from decimal import Decimal
from pathlib import Path

from .paths import default_config_path


@dataclass(frozen=True, slots=True)
class RawConfig:
    base_rate: Decimal = Decimal("50.00")
    overtime_multiplier: Decimal = Decimal("1.5")
    doubletime_multiplier: Decimal = Decimal("2.0")
    daily_regular_hours: Decimal = Decimal("8")
    daily_doubletime_after_hours: Decimal = Decimal("12")
    weekly_regular_cap_hours: Decimal | None = Decimal("40")
    db_path: str = ""


DEFAULT_CONFIG_TOML = """\
[pay]
base_rate = 50.00
overtime_multiplier = 1.5
doubletime_multiplier = 2.0
daily_regular_hours = 8
daily_doubletime_after_hours = 12
weekly_regular_cap_hours = 40

[storage]
# Leave blank to use the default per-user data directory.
db_path = ""
"""


def _to_decimal(value: object, key: str) -> Decimal:
    if isinstance(value, (int, float, str, Decimal)):
        try:
            return Decimal(str(value))
        except Exception as e:
            raise ValueError(f"Invalid decimal for '{key}': {value!r}") from e
    raise ValueError(f"Invalid type for '{key}': {type(value).__name__}")


def load_config(path: Path | None = None) -> RawConfig:
    path = path or default_config_path()
    if not path.exists():
        return RawConfig()

    data = tomllib.loads(path.read_text(encoding="utf-8"))
    pay = data.get("pay", {})
    storage = data.get("storage", {})

    weekly_cap = pay.get("weekly_regular_cap_hours", 40)
    if weekly_cap in (None, "", "none", "None"):
        weekly_cap_hours: Decimal | None = None
    else:
        weekly_cap_hours = _to_decimal(weekly_cap, "weekly_regular_cap_hours")

    db_path = storage.get("db_path", "")
    if not isinstance(db_path, str):
        raise ValueError("storage.db_path must be a string")

    return RawConfig(
        base_rate=_to_decimal(pay.get("base_rate", 50.0), "base_rate"),
        overtime_multiplier=_to_decimal(pay.get("overtime_multiplier", 1.5), "overtime_multiplier"),
        doubletime_multiplier=_to_decimal(
            pay.get("doubletime_multiplier", 2.0), "doubletime_multiplier"
        ),
        daily_regular_hours=_to_decimal(pay.get("daily_regular_hours", 8), "daily_regular_hours"),
        daily_doubletime_after_hours=_to_decimal(
            pay.get("daily_doubletime_after_hours", 12), "daily_doubletime_after_hours"
        ),
        weekly_regular_cap_hours=weekly_cap_hours,
        db_path=os.path.expanduser(db_path),
    )


def ensure_default_config(path: Path | None = None, *, force: bool = False) -> Path:
    path = path or default_config_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and not force:
        return path
    path.write_text(DEFAULT_CONFIG_TOML, encoding="utf-8")
    return path


def config_as_dict(cfg: RawConfig) -> dict[str, object]:
    d = asdict(cfg)
    # Make it friendlier for JSON/export and printing
    for k, v in list(d.items()):
        if isinstance(v, Decimal):
            d[k] = str(v)
    return d

