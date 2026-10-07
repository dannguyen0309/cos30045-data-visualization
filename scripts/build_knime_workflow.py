from __future__ import annotations

import csv
import shutil
import uuid
import zipfile
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT / "Demo-1"
BUILD = ROOT / ".Demo-1-build"
EXAMPLES = ROOT / "Example Workflows"
NS = "http://www.knime.org/2008/09/XMLConfig"
ET.register_namespace("", NS)
ET.register_namespace("xsi", "http://www.w3.org/2001/XMLSchema-instance")

RAW_COLUMNS = next(csv.reader((ROOT / "tv_2026_10_04.csv").open(encoding="utf-8-sig")))
KEEP_COLUMNS = [
    "Submit_ID", "Brand_Reg", "Model_No", "Registration Number", "SoldIn",
    "screensize", "Screen_Area", "Screen_Tech", "Pasv_stnd_power",
    "Avg_mode_power", "Labelled energy consumption (kWh/year)", "ExpDate",
    "Availability Status", "Star2", "Star Rating Index", "Product Website",
]
NUMBER_COLUMNS = [
    "screensize", "Screen_Area", "Avg_mode_power",
    "Labelled energy consumption (kWh/year)", "Star2", "Star Rating Index",
]


def q(tag: str) -> str:
    return f"{{{NS}}}{tag}"


def config(parent: ET.Element, key: str) -> ET.Element:
    found = parent.find(f".//{q('config')}[@key='{key}']")
    if found is None:
        raise KeyError(f"Missing config: {key}")
    return found


def entry(parent: ET.Element, key: str, value: str | bool | int, kind: str | None = None) -> ET.Element:
    found = parent.find(f".//{q('entry')}[@key='{key}']")
    if found is None:
        found = ET.SubElement(parent, q("entry"), {"key": key})
    if kind is None:
        kind = "xboolean" if isinstance(value, bool) else "xint" if isinstance(value, int) else "xstring"
    found.set("type", kind)
    found.set("value", str(value).lower() if isinstance(value, bool) else str(value))
    found.attrib.pop("isnull", None)
    return found


def direct_entry(parent: ET.Element, key: str, value: str | bool | int, kind: str | None = None) -> ET.Element:
    found = parent.find(f"{q('entry')}[@key='{key}']")
    if found is None:
        found = ET.SubElement(parent, q("entry"), {"key": key})
    if kind is None:
        kind = "xboolean" if isinstance(value, bool) else "xint" if isinstance(value, int) else "xstring"
    found.set("type", kind)
    found.set("value", str(value).lower() if isinstance(value, bool) else str(value))
    found.attrib.pop("isnull", None)
    return found


def set_list(parent: ET.Element, values: list[str], value_type: str = "xstring") -> None:
    for child in list(parent):
        if child.tag == q("entry"):
            parent.remove(child)
    direct_entry(parent, "array-size", len(values), "xint")
    for index, value in enumerate(values):
        direct_entry(parent, str(index), value, value_type)


def parse(path: Path) -> ET.ElementTree:
    return ET.parse(path)


def reset_node(root: ET.Element, custom_name: str, annotation: str) -> None:
    for key, value, kind in [
        ("state", "CONFIGURED", "xstring"),
        ("name", custom_name, "xstring"),
        ("hasContent", False, "xboolean"),
    ]:
        target = root.find(f"{q('entry')}[@key='{key}']")
        if target is not None:
            target.set("value", str(value).lower() if isinstance(value, bool) else str(value))
            target.set("type", kind)
    ports = root.find(f"{q('config')}[@key='ports']")
    if ports is not None:
        ports.clear()
        ports.set("key", "ports")
    internal = root.find(f"{q('config')}[@key='internalObjects']")
    if internal is not None:
        root.remove(internal)
    filestores = root.find(f"{q('config')}[@key='filestores']")
    if filestores is not None:
        for child in list(filestores):
            filestores.remove(child)
        direct_entry(filestores, "file_store_location", "", "xstring").set("isnull", "true")
        direct_entry(filestores, "file_store_id", "", "xstring").set("isnull", "true")
    annotation_config = root.find(f"{q('config')}[@key='nodeAnnotation']")
    if annotation_config is None:
        annotation_config = ET.SubElement(root, q("config"), {"key": "nodeAnnotation"})
    direct_entry(annotation_config, "text", annotation)
    direct_entry(annotation_config, "contentType", "text/plain")
    direct_entry(annotation_config, "bgcolor", 16777215, "xint")
    direct_entry(annotation_config, "x-coordinate", 0, "xint")
    direct_entry(annotation_config, "y-coordinate", 0, "xint")
    direct_entry(annotation_config, "width", 0, "xint")
    direct_entry(annotation_config, "height", 0, "xint")
    direct_entry(annotation_config, "alignment", "CENTER")
    direct_entry(annotation_config, "borderSize", 0, "xint")
    direct_entry(annotation_config, "borderColor", 0, "xint")
    direct_entry(annotation_config, "defFontSize", -1, "xint")
    direct_entry(annotation_config, "annotation-version", 20230412, "xint")


def configure_reader(root: ET.Element) -> None:
    path_configs = root.findall(f".//{q('config')}[@key='path']")
    for path_config in path_configs:
        direct_entry(path_config, "path", "tv_2026_10_04.csv")
    for source in root.findall(f".//{q('entry')}[@key='sourceIdentifier']"):
        source.set("value", "tv_2026_10_04.csv")
    for item in root.findall(f".//{q('entry')}"):
        if "Hospital_Readmissions" in item.get("value", ""):
            item.set("value", "tv_2026_10_04.csv")

    transformation = config(config(root, "model"), "transformationParameters")
    specs = config(transformation, "specs")
    file_spec = next(child for child in specs if child.tag == q("config"))
    spec = config(file_spec, "spec")
    string_spec = deepcopy(next(child for child in spec if child.tag == q("config")))
    for child in list(spec):
        spec.remove(child)
    for index, column in enumerate(RAW_COLUMNS):
        column_spec = deepcopy(string_spec)
        column_spec.set("key", str(index))
        direct_entry(column_spec, "name", column)
        direct_entry(column_spec, "type", "java.lang.String")
        spec.append(column_spec)

    transformations = config(transformation, "columnTransformation")
    string_transform = deepcopy(next(child for child in transformations if child.tag == q("config")))
    for child in list(transformations):
        transformations.remove(child)
    for index, column in enumerate(RAW_COLUMNS):
        column_transform = deepcopy(string_transform)
        column_transform.set("key", str(index))
        direct_entry(column_transform, "columnName", column)
        direct_entry(column_transform, "columnRename", column)
        transformations.append(column_transform)


def configure_column_filter(root: ET.Element) -> None:
    model = config(root, "model")
    set_list(config(model, "included_names"), KEEP_COLUMNS)
    set_list(config(model, "excluded_names"), [column for column in RAW_COLUMNS if column not in KEEP_COLUMNS])


def configure_rules(root: ET.Element, rules: list[str], output: str | None = None) -> None:
    model = config(root, "model")
    set_list(config(model, "rules"), rules)
    if output:
        entry(model, "new-column-name", output)
        entry(model, "append-column", True)


def configure_string_to_number(root: ET.Element, columns: list[str], excluded: list[str]) -> None:
    model = config(root, "model")
    entry(model, "cell_class", "org.knime.core.data.def.DoubleCell")
    entry(model, "fail_on_error", True)
    set_list(config(model, "included_names"), columns)
    set_list(config(model, "excluded_names"), excluded)


def configure_math(root: ET.Element) -> None:
    model = config(root, "model")
    entry(model, "append_column", False)
    entry(model, "replaced_column", "Screen Size (inches)")
    entry(model, "expression", "$screensize$ / 2.54")


def configure_brand(root: ET.Element) -> None:
    model = config(root, "model")
    entry(model, "changeCasing", "UPPERCASE")
    entry(model, "output", "REPLACE")
    selected = config(config(config(model, "columnsToClean"), "manualFilter"), "manuallySelected")
    set_list(selected, ["Brand_Reg"])


def configure_brand_replacer(root: ET.Element, source: str, target: str) -> None:
    model = config(root, "model")
    entry(model, "colName", "Brand_Reg")
    entry(model, "patternType", "LITERAL")
    entry(model, "pattern", source)
    entry(model, "replacement", target)
    entry(model, "createNewCol", False)
    entry(model, "replaceAllOccurences", False)


def configure_groupby(root: ET.Element, group_column: str, aggregations: list[tuple[str, str, str]]) -> None:
    model = config(root, "model")
    set_list(config(model, "InclList"), [group_column])
    set_list(config(model, "ExclList"), [column for column in KEEP_COLUMNS + ["Screen Size (inches)", "Screen Size Band"] if column != group_column])
    aggregation = config(model, "aggregationColumn")
    names, methods, types = zip(*aggregations)
    set_list(config(aggregation, "columnNames"), list(names))
    column_types = config(aggregation, "columnTypes")
    for child in list(column_types):
        column_types.remove(child)
    direct_entry(column_types, "array-size", len(types), "xint")
    for index, cell_class in enumerate(types):
        item = ET.SubElement(column_types, q("config"), {"key": str(index)})
        direct_entry(item, "cell_class", cell_class)
        direct_entry(item, "is_null", False, "xboolean")
    set_list(config(aggregation, "aggregationMethod"), list(methods))
    set_list(config(aggregation, "inclMissingVals"), ["false"] * len(methods), "xboolean")
    operator_settings = config(model, "aggregationOperatorSettings")
    for child in list(operator_settings):
        operator_settings.remove(child)


def configure_sorter(root: ET.Element, column: str, order: str) -> None:
    model = config(root, "model")
    entry(model, "regularChoice", column)
    entry(model, "sortingOrder", order)


def configure_scatter(root: ET.Element) -> None:
    view = config(root, "view")
    entry(view, "xAxisColumnV3", "Screen Size (inches)")
    entry(view, "yAxisColumnV3", "Labelled energy consumption (kWh/year)")
    color = config(view, "colorColumnV2")
    direct_entry(color, "regularChoice", "Screen_Tech")
    direct_entry(color, "specialChoice_Internals", "NONE")
    entry(view, "maxRows", 5000)
    entry(view, "title", "Screen Size vs Annual Energy Consumption")
    entry(view, "customXAxisLabelV2", "Screen size (inches)")
    entry(view, "customXAxisLabelV2_is_present", True)
    entry(view, "customYAxisLabelV2", "Annual energy (kWh/year)")
    entry(view, "customYAxisLabelV2_is_present", True)


def configure_histogram(root: ET.Element) -> None:
    model = config(root, "model")
    entry(model, "dimensionV3", "Pasv_stnd_power")
    entry(model, "nBins", 24)
    view = config(root, "view")
    entry(view, "title", "Distribution of Passive Standby Power")
    entry(view, "customDimensionAxisLabelV2", "Passive standby power (W)")
    entry(view, "customDimensionAxisLabelV2_is_present", True)
    entry(view, "customFrequencyAxisLabelV2", "Model count")
    entry(view, "customFrequencyAxisLabelV2_is_present", True)


def configure_table(root: ET.Element, columns: list[str], title: str) -> None:
    view = config(root, "view")
    displayed = config(view, "displayedColumnsV2")
    entry(displayed, "mode", "MANUAL")
    set_list(config(displayed, "manuallySelected"), columns)
    set_list(config(displayed, "manuallyDeselected"), [])
    entry(view, "title", title)


def configure_pie(root: ET.Element) -> None:
    model = config(root, "model")
    entry(config(model, "categoryColumn"), "selected", "Screen_Tech")
    entry(config(model, "frequencyColumn"), "selected", "Count(Submit_ID)")
    entry(model, "aggregationMethod", "SUM")
    view = config(root, "view")
    entry(view, "title", "Screen Technology Share")
    entry(view, "showLegend", True)
    entry(view, "labelContent", "CAT")
    entry(view, "labelValueFormat", "PROP")
    entry(view, "tooltipValueFormat", "ABSPROP")


def configure_bar(root: ET.Element) -> None:
    model = config(root, "model")
    entry(config(model, "categoryColumn"), "selected", "Screen Size Band")
    frequency = config(model, "frequencyColumns")
    selected = config(frequency, "selected_Internals")
    set_list(selected, ["Median(Labelled energy consumption (kWh/year))"])
    selected_manual = config(frequency, "manuallySelected")
    set_list(selected_manual, ["Median(Labelled energy consumption (kWh/year))"])
    deselected = config(frequency, "manuallyDeselected")
    set_list(deselected, [])
    view = config(root, "view")
    entry(view, "title", "Median Annual Energy by Screen Size")
    entry(view, "categoryAxisLabel", "Screen-size band")
    entry(view, "frequencyAxisLabel", "Median annual energy (kWh/year)")
    entry(view, "showValues", True)
    entry(view, "showLegend", False)


def configure_writer(root: ET.Element, filename: str) -> None:
    model = config(root, "model")
    path_config = config(model, "path")
    direct_entry(path_config, "path", f"dashboard-data/{filename}")
    entry(model, "create_missing_folders", True)
    entry(model, "if_path_exists", "overwrite")


TEMPLATES = {
    "reader": OLD / "CSV Reader (#1)" / "settings.xml",
    "column": OLD / "Column Filter (#2)" / "settings.xml",
    "filter": OLD / "Australian Market Filter (#3)" / "settings.xml",
    "number": OLD / "Standby to Number (#22)" / "settings.xml",
    "math": OLD / "Screen Size in Inches (#5)" / "settings.xml",
    "rule": OLD / "Screen Size Band (#6)" / "settings.xml",
    "scatter": OLD / "Size vs Energy (#7)" / "settings.xml",
    "group": OLD / "Technology Summary (#8)" / "settings.xml",
    "sort": OLD / "Sort Brands (#16)" / "settings.xml",
    "table": OLD / "Brand Table (#17)" / "settings.xml",
    "hist": OLD / "Standby Histogram (#23)" / "settings.xml",
    "writer": OLD / "Write Clean TV Data (#25)" / "settings.xml",
    "pie": OLD / "Technology Pie Chart (#9)" / "settings.xml",
    "bar": OLD / "Screen Band Bar Chart (#13)" / "settings.xml",
    "brand_clean": ROOT / "scripts" / "knime_templates" / "string_cleaner.xml",
    "brand_replace": ROOT / "scripts" / "knime_templates" / "string_replacer.xml",
}

NODES = [
    (1, "CSV Reader", "reader", (0, 220), "Load the official Australian television registration CSV."),
    (2, "Column Filter", "column", (130, 220), "Keep only fields needed for energy analysis."),
    (3, "Australian Market Filter", "filter", (280, 220), "Keep Australia, Available, and non-expired registrations."),
    (26, "String Cleaner", "brand_clean", (280, 390), "Standardize Brand_Reg casing and trim duplicate whitespace."),
    (27, "String Replacer - Samsung", "brand_replace", (420, 390), "SAMSUNG ELECTRONICS becomes SAMSUNG."),
    (28, "String Replacer - QBELL", "brand_replace", (560, 390), "Q.BELL becomes QBELL; matching QT50WX8A and distributor."),
    (29, "String Replacer - SVISION", "brand_replace", (700, 390), "S VISION becomes SVISION; reviewed spelling variant."),
    (30, "String Replacer - Hubbl", "brand_replace", (840, 390), "HUBBL GLASS becomes HUBBL; Glass is the TV product line."),
    (4, "String to Number", "number", (560, 220), "Convert energy, size and star fields to numeric values."),
    (5, "Screen Size in Inches", "math", (700, 220), "Convert screen size from centimetres to inches."),
    (6, "Screen Size Band", "rule", (840, 220), "Create four readable screen-size groups."),
    (7, "Size vs Energy", "scatter", (970, -60), "Show relationship between screen size and annual energy."),
    (8, "Technology Summary", "group", (970, 80), "Count models and summarize energy and stars by screen technology."),
    (9, "Technology Pie Chart", "pie", (1160, 30), "Show market share of LCD, LED-LCD and OLED models."),
    (10, "Write Technology Summary", "writer", (1160, 125), "Export technology_summary.csv for the dashboard."),
    (11, "Screen Band Summary", "group", (970, 230), "Compare median annual energy across four size bands."),
    (12, "Sort Screen Bands", "sort", (1140, 230), "Keep screen-size bands in ascending order."),
    (13, "Screen Band Bar Chart", "bar", (1310, 180), "Compare median annual energy by screen-size band."),
    (14, "Write Screen Band Summary", "writer", (1310, 280), "Export screen_band_summary.csv for the dashboard."),
    (15, "Brand Summary", "group", (970, 380), "Summarize catalogue size, energy, stars and screen size by brand."),
    (16, "Sort Brands", "sort", (1140, 380), "Place brands with most registered models first."),
    (17, "Brand Table", "table", (1310, 340), "Inspect brand-level comparison values."),
    (18, "Write Brand Summary", "writer", (1310, 430), "Export brand_summary.csv for the dashboard."),
    (19, "Sort Models", "sort", (970, 530), "Sort models by annual energy for detailed exploration."),
    (20, "Model Table", "table", (1140, 530), "Inspect individual TV models and energy values."),
    (21, "Valid Standby Filter", "filter", (970, 670), "Remove '-' and missing passive standby measurements."),
    (22, "Standby to Number", "number", (1140, 670), "Convert valid passive standby values to watts."),
    (23, "Standby Histogram", "hist", (1310, 625), "Show distribution of passive standby power."),
    (24, "Write Standby Records", "writer", (1310, 715), "Export standby_records.csv for the dashboard."),
    (25, "Write Clean TV Data", "writer", (970, 820), "Export cleaned_tv.csv for dashboard filters and plots."),
]

CONNECTIONS = [
    (1, 2), (2, 3), (3, 26), (26, 27), (27, 28), (28, 29), (29, 30), (30, 4), (4, 5), (5, 6),
    (6, 7), (6, 8), (8, 9), (8, 10),
    (6, 11), (11, 12), (12, 13), (12, 14),
    (6, 15), (15, 16), (16, 17), (16, 18),
    (6, 19), (19, 20),
    (6, 21), (21, 22), (22, 23), (22, 24),
    (6, 25),
]


def configure_node(node_id: int, kind: str, root: ET.Element) -> None:
    if kind == "reader": configure_reader(root)
    elif kind == "column": configure_column_filter(root)
    elif kind == "number" and node_id == 4:
        configure_string_to_number(root, NUMBER_COLUMNS, [column for column in KEEP_COLUMNS if column not in NUMBER_COLUMNS])
    elif kind == "number":
        configure_string_to_number(root, ["Pasv_stnd_power"], [column for column in KEEP_COLUMNS + ["Screen Size (inches)", "Screen Size Band"] if column != "Pasv_stnd_power"])
    elif kind == "brand_clean": configure_brand(root)
    elif kind == "brand_replace":
        source, target = {
            27: ("SAMSUNG ELECTRONICS", "SAMSUNG"),
            28: ("Q.BELL", "QBELL"),
            29: ("S VISION", "SVISION"),
            30: ("HUBBL GLASS", "HUBBL"),
        }[node_id]
        configure_brand_replacer(root, source, target)
    elif kind == "math": configure_math(root)
    elif kind == "rule": configure_rules(root, [
        '$Screen Size (inches)$ <= 43 => "1. ≤43 inches"',
        '$Screen Size (inches)$ <= 55 => "2. 44–55 inches"',
        '$Screen Size (inches)$ <= 65 => "3. 56–65 inches"',
        'TRUE => "4. >65 inches"',
    ], "Screen Size Band")
    elif kind == "filter" and node_id == 3:
        configure_rules(root, [
            '$SoldIn$ LIKE "*Australia*" AND $Availability Status$ = "Available" AND $ExpDate$ MATCHES "2026-(10-(0[4-9]|[12][0-9]|3[01])|1[12]-[0-9]{2})|202[7-9]-[0-9]{2}-[0-9]{2}|20[3-9][0-9]-[0-9]{2}-[0-9]{2}" => TRUE',
            "TRUE => FALSE",
        ])
    elif kind == "filter": configure_rules(root, [
        '$Pasv_stnd_power$ = "-" => FALSE',
        'MISSING $Pasv_stnd_power$ => FALSE',
        "TRUE => TRUE",
    ])
    elif kind == "scatter": configure_scatter(root)
    elif kind == "group" and node_id == 8:
        configure_groupby(root, "Screen_Tech", [
            ("Submit_ID", "Count", "org.knime.core.data.def.StringCell"),
            ("Labelled energy consumption (kWh/year)", "Mean_V4.6", "org.knime.core.data.def.DoubleCell"),
            ("Labelled energy consumption (kWh/year)", "Median_V3.4", "org.knime.core.data.def.DoubleCell"),
            ("Star2", "Mean_V4.6", "org.knime.core.data.def.DoubleCell"),
            ("Star2", "Median_V3.4", "org.knime.core.data.def.DoubleCell"),
        ])
    elif kind == "group" and node_id == 11:
        configure_groupby(root, "Screen Size Band", [
            ("Submit_ID", "Count", "org.knime.core.data.def.StringCell"),
            ("Labelled energy consumption (kWh/year)", "Mean_V4.6", "org.knime.core.data.def.DoubleCell"),
            ("Labelled energy consumption (kWh/year)", "Median_V3.4", "org.knime.core.data.def.DoubleCell"),
            ("Avg_mode_power", "Mean_V4.6", "org.knime.core.data.def.DoubleCell"),
        ])
    elif kind == "group":
        configure_groupby(root, "Brand_Reg", [
            ("Submit_ID", "Count", "org.knime.core.data.def.StringCell"),
            ("Labelled energy consumption (kWh/year)", "Median_V3.4", "org.knime.core.data.def.DoubleCell"),
            ("Star2", "Median_V3.4", "org.knime.core.data.def.DoubleCell"),
            ("Screen Size (inches)", "Median_V3.4", "org.knime.core.data.def.DoubleCell"),
        ])
    elif kind == "sort" and node_id == 12: configure_sorter(root, "Screen Size Band", "ASCENDING")
    elif kind == "sort" and node_id == 16: configure_sorter(root, "Count(Submit_ID)", "DESCENDING")
    elif kind == "sort": configure_sorter(root, "Labelled energy consumption (kWh/year)", "DESCENDING")
    elif kind == "pie": configure_pie(root)
    elif kind == "bar": configure_bar(root)
    elif kind == "hist": configure_histogram(root)
    elif kind == "table" and node_id == 17:
        configure_table(root, [
            "Brand_Reg", "Count(Submit_ID)",
            "Median(Labelled energy consumption (kWh/year))",
            "Median(Star2)", "Median(Screen Size (inches))",
        ], "Brand Energy Summary")
    elif kind == "table":
        configure_table(root, [
            "Brand_Reg", "Model_No", "Screen_Tech", "Screen Size (inches)",
            "Labelled energy consumption (kWh/year)", "Star2",
        ], "Television Model Explorer")
    elif kind == "writer": configure_writer(root, {
        10: "technology_summary.csv", 14: "screen_band_summary.csv",
        18: "brand_summary.csv", 24: "standby_records.csv", 25: "cleaned_tv.csv",
    }[node_id])


def write_settings() -> dict[int, str]:
    node_files = {}
    for node_id, name, kind, _, annotation in NODES:
        directory_name = f"{name} (#{node_id})"
        destination = BUILD / directory_name
        destination.mkdir(parents=True)
        tree = parse(TEMPLATES[kind])
        root = tree.getroot()
        reset_node(root, name, annotation)
        if node_id in {4, 26, 27, 28, 29, 30}:
            configure_node(node_id, kind, root)
        ET.indent(tree, space="    ")
        tree.write(destination / "settings.xml", encoding="UTF-8", xml_declaration=True)
        node_files[node_id] = f"{directory_name}/settings.xml"
    return node_files


def add_annotation(parent: ET.Element, index: int, text: str, x: int, y: int, width: int, height: int) -> None:
    item = ET.SubElement(parent, q("config"), {"key": f"annotation_{index}"})
    direct_entry(item, "text", text)
    direct_entry(item, "contentType", "text/plain")
    direct_entry(item, "bgcolor", 15987699, "xint")
    direct_entry(item, "x-coordinate", x, "xint")
    direct_entry(item, "y-coordinate", y, "xint")
    direct_entry(item, "width", width, "xint")
    direct_entry(item, "height", height, "xint")
    direct_entry(item, "alignment", "LEFT")
    direct_entry(item, "borderSize", 1, "xint")
    direct_entry(item, "borderColor", 3383851, "xint")
    direct_entry(item, "defFontSize", 11, "xint")
    direct_entry(item, "annotation-version", 20230412, "xint")
    ET.SubElement(item, q("config"), {"key": "styles"})


def write_workflow(node_files: dict[int, str]) -> None:
    root = ET.Element(q("config"), {
        "key": "workflow.knime",
        "{http://www.w3.org/2001/XMLSchema-instance}schemaLocation": f"{NS} http://www.knime.org/XMLConfig_2008_09.xsd",
    })
    direct_entry(root, "created_by", "5.12.0.v202606180846")
    direct_entry(root, "created_by_nightly", False)
    direct_entry(root, "version", "5.1.0")
    name = direct_entry(root, "name", "")
    name.set("isnull", "true")
    author = ET.SubElement(root, q("config"), {"key": "authorInformation"})
    direct_entry(author, "authored-by", "ASUS")
    direct_entry(author, "authored-when", "2026-10-05 00:00:00 +0700")
    direct_entry(author, "lastEdited-by", "ASUS")
    direct_entry(author, "lastEdited-when", datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z"))
    description = direct_entry(root, "customDescription", "")
    description.set("isnull", "true")
    direct_entry(root, "state", "CONFIGURED")
    ET.SubElement(root, q("config"), {"key": "workflow_credentials"})

    annotations = ET.SubElement(root, q("config"), {"key": "annotations"})
    add_annotation(annotations, 0, "AUSTRALIAN TV ENERGY EXPLORER\nSnapshot: 04 Oct 2026 | Source: Australian Energy Rating registration database", 0, -180, 820, 80)
    add_annotation(annotations, 1, "PREPARE DATA\nKeep current Australian products, convert numeric fields, derive screen size in inches and size bands.", 0, 80, 900, 90)
    add_annotation(annotations, 2, "VISUALISE AND EXPORT\nEach branch answers one question. CSV Writers feed the static Vercel dashboard.", 900, -180, 600, 80)

    nodes = ET.SubElement(root, q("config"), {"key": "nodes"})
    position_by_id = {node_id: position for node_id, _, _, position, _ in NODES}
    for node_id, *_ in NODES:
        item = ET.SubElement(nodes, q("config"), {"key": f"node_{node_id}"})
        direct_entry(item, "id", node_id, "xint")
        direct_entry(item, "node_settings_file", node_files[node_id])
        direct_entry(item, "node_is_meta", False)
        direct_entry(item, "node_type", "NativeNode")
        direct_entry(item, "ui_classname", "org.knime.core.node.workflow.NodeUIInformation")
        ui = ET.SubElement(item, q("config"), {"key": "ui_settings"})
        bounds = ET.SubElement(ui, q("config"), {"key": "extrainfo.node.bounds"})
        x, y = position_by_id[node_id]
        set_list(bounds, [str(x), str(y), "-1", "-1"], "xint")

    connections = ET.SubElement(root, q("config"), {"key": "connections"})
    for index, (source, destination) in enumerate(CONNECTIONS):
        item = ET.SubElement(connections, q("config"), {"key": f"connection_{index}"})
        direct_entry(item, "sourceID", source, "xint")
        direct_entry(item, "destID", destination, "xint")
        direct_entry(item, "sourcePort", 1, "xint")
        direct_entry(item, "destPort", 1, "xint")
        direct_entry(item, "ui_classname", "org.knime.core.node.workflow.ConnectionUIInformation")
        ET.SubElement(item, q("config"), {"key": "ui_settings"})

    ET.SubElement(root, q("config"), {"key": "workflow_editor_settings"})
    ET.SubElement(root, q("config"), {"key": "workflow_data_area_settings"})
    tree = ET.ElementTree(root)
    ET.indent(tree, space="    ")
    tree.write(BUILD / "workflow.knime", encoding="UTF-8", xml_declaration=True)


def write_metadata() -> None:
    (BUILD / "workflowset.meta").write_text("Demo-1\n", encoding="utf-8")
    metadata = f'''<?xml version="1.0" encoding="UTF-8"?>
<workflow-metadata xmlns="http://knime.org/workflow-metadata4" version="4.0">
  <name>Australian TV Energy Explorer</name>
  <description>Explore energy consumption of televisions registered as available in Australia.</description>
  <created-at>2026-10-05T00:00:00+07:00</created-at>
  <last-modified-at>{datetime.now().astimezone().isoformat()}</last-modified-at>
</workflow-metadata>
'''
    (BUILD / "workflow-metadata.xml").write_text(metadata, encoding="utf-8")
    (BUILD / "workflow.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="980" viewBox="0 0 1500 980">'
        '<rect width="1500" height="980" fill="#f8fafc"/><text x="40" y="70" font-family="sans-serif" font-size="34" fill="#0f172a">Australian TV Energy Explorer</text>'
        '<text x="40" y="112" font-family="sans-serif" font-size="18" fill="#475569">Open workflow in KNIME to view configured nodes and annotations.</text></svg>',
        encoding="utf-8",
    )


def package() -> None:
    archive = ROOT / "Demo-1.knwf"
    if archive.exists():
        archive.unlink()
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as bundle:
        for path in sorted(BUILD.rglob("*")):
            if path.is_file():
                bundle.write(path, Path("Demo-1") / path.relative_to(BUILD))


def main() -> None:
    assert OLD.resolve().parent == ROOT.resolve(), "Refusing to replace workflow outside assignment directory"
    if BUILD.exists():
        shutil.rmtree(BUILD)
    BUILD.mkdir()
    node_files = write_settings()
    write_workflow(node_files)
    write_metadata()

    data = BUILD / "data"
    outputs = data / "dashboard-data"
    outputs.mkdir(parents=True)
    shutil.copy2(ROOT / "tv_2026_10_04.csv", data / "tv_2026_10_04.csv")
    for source in sorted((ROOT / "dashboard" / "data").glob("*.csv")):
        shutil.copy2(source, outputs / source.name)

    package()
    if (OLD / ".knimeLock").exists():
        for child in OLD.iterdir():
            if child.name == ".knimeLock":
                continue
            shutil.rmtree(child) if child.is_dir() else child.unlink()
        for child in BUILD.iterdir():
            destination = OLD / child.name
            shutil.copytree(child, destination) if child.is_dir() else shutil.copy2(child, destination)
        shutil.rmtree(BUILD)
    elif OLD.exists():
        shutil.rmtree(OLD)
        BUILD.rename(OLD)
    else:
        BUILD.rename(OLD)
    print(f"workflow={OLD} package={ROOT / 'Demo-1.knwf'} nodes={len(NODES)} connections={len(CONNECTIONS)}")


if __name__ == "__main__":
    main()
