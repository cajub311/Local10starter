# Local10starter

Local-first shift log + overtime/pay calculator CLI (built for union-style workflows).

### What you can do

- **Log shifts**: store shifts locally in SQLite (no account, no cloud)
- **Estimate weekly pay**: daily OT + double-time thresholds, plus an optional weekly regular-hours cap
- **Export**: CSV or JSON for payroll/timecard workflows

### Install (dev)

```bash
python3 -m pip install -e .
```

### Quickstart

Create a config file:

```bash
local10 init
```

Add a shift:

```bash
local10 add 2026-02-27 07:00 17:00 --break 30 --job "Pier 80"
```

List recent shifts:

```bash
local10 list --limit 10
```

Weekly summary (defaults to Monday-start week):

```bash
local10 week --day 2026-02-27
```

Export all shifts:

```bash
local10 export --format csv --output shifts.csv
local10 export --format json --output shifts.json
```

### Config

`local10 init` creates a TOML config file in your user config directory. It includes:

- **pay.base_rate**: hourly rate used for pay estimates
- **pay.daily_regular_hours**: hours before overtime starts
- **pay.daily_doubletime_after_hours**: hours before double-time starts
- **pay.weekly_regular_cap_hours**: if set, regular hours above this cap are shifted to overtime
- **storage.db_path**: optional custom path for the SQLite database
