"""Validate KNIME exports before copying them into the website."""

import csv
import math
import shutil
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Demo-1" / "data" / "dashboard-data"
ANNUAL = "Labelled energy consumption (kWh/year)"
REQUIRED = {
    "cleaned_tv.csv": {
        "Brand_Reg", "Model_No", "Registration Number", "Screen_Tech",
        "Screen Size (inches)", "Screen Size Band", ANNUAL, "Star2", "Star Rating Index",
    },
    "standby_records.csv": {
        "Brand_Reg", "Model_No", "Screen_Tech", "Screen Size (inches)", "Passive Standby Power (W)",
    },
    "technology_summary.csv": {"Screen_Tech", "Count*(Submit_ID)"},
    "screen_band_summary.csv": {"Screen Size Band", "Count*(Submit_ID)"},
    "brand_summary.csv": {"Brand_Reg", "Count*(Submit_ID)"},
}


def main():
    tables = {}
    for name, required in REQUIRED.items():
        with (SOURCE / name).open(encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            missing = required - set(reader.fieldnames or [])
            if missing:
                raise ValueError(f"{name}: missing columns {sorted(missing)}. Reset and execute its KNIME CSV Writer.")
            tables[name] = list(reader)
        if not tables[name]:
            raise ValueError(f"{name}: empty export")

    cleaned = tables["cleaned_tv.csv"]
    standby = tables["standby_records.csv"]
    for name, columns in (
        ("cleaned_tv.csv", ["Screen Size (inches)", ANNUAL, "Star2", "Star Rating Index"]),
        ("standby_records.csv", ["Screen Size (inches)", "Passive Standby Power (W)"]),
    ):
        for row in tables[name]:
            if any(not math.isfinite(float(row[column])) for column in columns):
                raise ValueError(f"{name}: invalid numeric value")

    for name, key in (
        ("technology_summary.csv", "Screen_Tech"),
        ("screen_band_summary.csv", "Screen Size Band"),
        ("brand_summary.csv", "Brand_Reg"),
    ):
        counts = Counter(row[key] for row in cleaned)
        exported = {row[key]: int(row["Count*(Submit_ID)"]) for row in tables[name]}
        if counts != exported:
            raise ValueError(f"{name}: counts do not match cleaned_tv.csv. Re-execute the summary branch.")

    keys = {(row["Brand_Reg"], row["Model_No"], row["Screen_Tech"]) for row in cleaned}
    if any((row["Brand_Reg"], row["Model_No"], row["Screen_Tech"]) not in keys for row in standby):
        raise ValueError("Standby export contains models absent from cleaned_tv.csv")

    for directory in (ROOT / "dashboard" / "data", ROOT / "dashboard" / "public" / "data", ROOT / "dashboard" / "dist" / "data"):
        directory.mkdir(parents=True, exist_ok=True)
        for name in REQUIRED:
            shutil.copyfile(SOURCE / name, directory / name)
    print(f"Synced KNIME exports: {len(cleaned)} TVs, {len(tables['brand_summary.csv'])} brands, {len(standby)} standby records")


if __name__ == "__main__":
    main()
