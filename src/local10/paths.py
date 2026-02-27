from __future__ import annotations

from pathlib import Path

from platformdirs import user_config_path, user_data_path

APP_NAME = "local10starter"
APP_AUTHOR = "local10starter"


def default_config_path() -> Path:
    return user_config_path(APP_NAME, APP_AUTHOR) / "config.toml"


def default_db_path() -> Path:
    return user_data_path(APP_NAME, APP_AUTHOR) / "local10.sqlite3"

