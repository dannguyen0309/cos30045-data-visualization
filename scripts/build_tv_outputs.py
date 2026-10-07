from __future__ import annotations

import csv
import shutil
from collections import defaultdict
from datetime import date
from pathlib import Path
from statistics import fmean, median


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tv_2026_10_04.csv"
SNAPSHOT = date(2026, 10, 4)
WORKFLOW_DATA = ROOT / "Demo-1" / "data" / "dashboard-data"
DASHBOARD_DATA = ROOT / "dashboard" / "data"
DASHBOARD_PUBLIC = ROOT / "dashboard" / "public" / "data"
DASHBOARD_DIST = ROOT / "dashboard" / "dist" / "data"

ANNUAL = "Labelled energy consumption (kWh/year)"
NUMERIC = {
    "screensize",
    "Screen_Area",
    "Avg_mode_power",
    ANNUAL,
    "Star2",
    "Star Rating Index",
}
OUTPUT_COLUMNS = [
    "Submit_ID",
    "Brand_Reg",
    "Model_No",
    "Registration Number",
    "Screen_Tech",
    "Screen Size (inches)",
    "Screen Size Band",
    "screensize",
    "Screen_Area",
    "Avg_mode_power",
    ANNUAL,
    "Star2",
    "Star Rating Index",
    "Pasv_stnd_power",
    "SoldIn",
    "Availability Status",
    "ExpDate",
    "Product Website",
]

BRAND_ALIASES = {
    "SAMSUNG ELECTRONICS": "SAMSUNG",
    "Q.BELL": "QBELL",
    "S VISION": "SVISION",
    "HUBBL GLASS": "HUBBL",
}


def number(value: str) -> float:
    return float(value.strip())


def rounded(value: float) -> str:
    return f"{value:.2f}".rstrip("0").rstrip(".")


def clean_brand(value: str) -> str:
    brand = " ".join(value.split()).upper()
    return BRAND_ALIASES.get(brand, brand)


def screen_band(inches: float) -> str:
    if inches <= 43:
        return "1. ≤43 inches"
    if inches <= 55:
        return "2. 44–55 inches"
    if inches <= 65:
        return "3. 56–65 inches"
    return "4. >65 inches"


def write_csv(path: Path, columns: list[str], rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def summarize(rows: list[dict[str, object]], key: str) -> list[dict[str, object]]:
    groups: dict[str, list[dict[str, object]]] = defaultdict(list)
    for row in rows:
        groups[str(row[key])].append(row)

    result = []
    for label, group in groups.items():
        annual = [float(row[ANNUAL]) for row in group]
        stars = [float(row["Star2"]) for row in group]
        result.append(
            {
                key: label,
                "Model Count": len(group),
                "Mean Annual Energy": rounded(fmean(annual)),
                "Median Annual Energy": rounded(median(annual)),
                "Mean Star Rating": rounded(fmean(stars)),
                "Median Star Rating": rounded(median(stars)),
            }
        )
    return result


def main() -> None:
    with SOURCE.open(encoding="utf-8-sig", newline="") as handle:
        raw = list(csv.DictReader(handle))

    cleaned: list[dict[str, object]] = []
    for row in raw:
        try:
            expiry = date.fromisoformat(row["ExpDate"])
            values = {column: number(row[column]) for column in NUMERIC}
        except (KeyError, TypeError, ValueError):
            continue

        if "Australia" not in row["SoldIn"]:
            continue
        if row["Availability Status"] != "Available" or expiry < SNAPSHOT:
            continue

        inches = values["screensize"] / 2.54
        item = {column: row.get(column, "") for column in OUTPUT_COLUMNS}
        item.update({column: rounded(value) for column, value in values.items()})
        item["Brand_Reg"] = clean_brand(row["Brand_Reg"])
        item["Screen Size (inches)"] = rounded(inches)
        item["Screen Size Band"] = screen_band(inches)
        cleaned.append(item)

    duplicate_key = lambda row: (
        row["Brand_Reg"],
        row["Model_No"],
        row["Registration Number"],
    )
    assert len(raw) == 5030, f"Unexpected raw row count: {len(raw)}"
    assert len(cleaned) == 4839, f"Unexpected cleaned row count: {len(cleaned)}"
    assert len({duplicate_key(row) for row in cleaned}) == len(cleaned), "Duplicate models found"
    assert all(row["Brand_Reg"] == clean_brand(str(row["Brand_Reg"])) for row in cleaned)
    assert not set(BRAND_ALIASES).intersection(row["Brand_Reg"] for row in cleaned)
    assert {row["Brand_Reg"] for row in cleaned if "SAMSUNG" in row["Brand_Reg"]} == {
        "SAMSUNG"
    }, "Samsung brand aliases were not merged"

    technology = summarize(cleaned, "Screen_Tech")
    technology.sort(key=lambda row: int(row["Model Count"]), reverse=True)

    screen_bands = summarize(cleaned, "Screen Size Band")
    band_groups: dict[str, list[dict[str, object]]] = defaultdict(list)
    for row in cleaned:
        band_groups[str(row["Screen Size Band"])].append(row)
    for summary in screen_bands:
        group = band_groups[str(summary["Screen Size Band"])]
        summary["Mean Average-Mode Power"] = rounded(
            fmean(float(row["Avg_mode_power"]) for row in group)
        )
    screen_bands.sort(key=lambda row: str(row["Screen Size Band"]))

    brand = summarize(cleaned, "Brand_Reg")
    brand_groups: dict[str, list[dict[str, object]]] = defaultdict(list)
    for row in cleaned:
        brand_groups[str(row["Brand_Reg"])].append(row)
    for summary in brand:
        group = brand_groups[str(summary["Brand_Reg"])]
        summary["Median Screen Size"] = rounded(
            median(float(row["Screen Size (inches)"]) for row in group)
        )
    brand.sort(key=lambda row: (-int(row["Model Count"]), str(row["Brand_Reg"])))

    standby = []
    for row in cleaned:
        try:
            standby_power = number(str(row["Pasv_stnd_power"]))
        except ValueError:
            continue
        standby.append(
            {
                "Brand_Reg": row["Brand_Reg"],
                "Model_No": row["Model_No"],
                "Screen_Tech": row["Screen_Tech"],
                "Screen Size (inches)": row["Screen Size (inches)"],
                "Passive Standby Power (W)": rounded(standby_power),
            }
        )
    assert len(standby) == 3985, f"Unexpected standby row count: {len(standby)}"

    outputs = {
        "cleaned_tv.csv": (OUTPUT_COLUMNS, cleaned),
        "technology_summary.csv": (
            [
                "Screen_Tech",
                "Model Count",
                "Mean Annual Energy",
                "Median Annual Energy",
                "Mean Star Rating",
                "Median Star Rating",
            ],
            technology,
        ),
        "screen_band_summary.csv": (
            [
                "Screen Size Band",
                "Model Count",
                "Mean Annual Energy",
                "Median Annual Energy",
                "Mean Average-Mode Power",
            ],
            screen_bands,
        ),
        "brand_summary.csv": (
            [
                "Brand_Reg",
                "Model Count",
                "Mean Annual Energy",
                "Median Annual Energy",
                "Mean Star Rating",
                "Median Star Rating",
                "Median Screen Size",
            ],
            brand,
        ),
        "standby_records.csv": (
            [
                "Brand_Reg",
                "Model_No",
                "Screen_Tech",
                "Screen Size (inches)",
                "Passive Standby Power (W)",
            ],
            standby,
        ),
    }

    for name, (columns, rows) in outputs.items():
        target = WORKFLOW_DATA / name
        write_csv(target, columns, rows)
        for directory in (DASHBOARD_DATA, DASHBOARD_PUBLIC, DASHBOARD_DIST):
            directory.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(target, directory / name)

    print(
        f"raw={len(raw)} cleaned={len(cleaned)} technologies={len(technology)} "
        f"brands={len(brand)} standby={len(standby)}"
    )


if __name__ == "__main__":
    main()
