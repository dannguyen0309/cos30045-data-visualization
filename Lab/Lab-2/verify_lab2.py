"""Check the simplified saved KNIME graph and independent reference results."""
import csv
import math
import statistics
from collections import Counter
from pathlib import Path
import xml.etree.ElementTree as ET

BASE = Path(__file__).resolve().parent / 'Exercise-2'
NS = '{http://www.knime.org/2008/09/XMLConfig}'
ENERGY = 'Labelled energy consumption (kWh/year)'
BANDS = ['1. Small (<=43 in)', '2. Medium (44-65 in)', '3. Large (>=66 in)']

def entry(root, key):
    return root.find(NS+'entry[@key="'+key+'"]')

with (BASE/'data/tv_2026_02_15.csv').open(encoding='utf-8-sig', newline='') as stream:
    raw = list(csv.DictReader(stream))
assert len(raw)==4724
available = [r for r in raw if r['Availability Status']=='Available']
rows = [r for r in available if 'Australia' in r['SoldIn'].split(',')]
assert len(available)==4710 and len(rows)==4508
for row in rows:
    row['inches'] = float(row['screensize'])/2.54
    row['rounded'] = math.floor(row['inches']+.5)
    row['band'] = BANDS[0] if row['rounded']<=43 else BANDS[1] if row['rounded']<=65 else BANDS[2]
    row[ENERGY] = float(row[ENERGY])
assert len({r['rounded'] for r in rows})==47
assert Counter(r['band'] for r in rows)==dict(zip(BANDS,[1111,2059,1338]))
assert Counter(r['Screen_Tech'] for r in rows)=={'LCD':562,'LCD (LED)':3658,'OLED':288}
assert all(math.isfinite(r[ENERGY]) and r['inches']>0 and r['Model_No'].strip() for r in rows)

graph = ET.parse(BASE/'workflow.knime').getroot()
settings = {}
for node in graph.find(NS+'config[@key="nodes"]'):
    id_ = int(entry(node,'id').get('value'))
    assert id_ not in settings
    settings[id_] = ET.parse(BASE/entry(node,'node_settings_file').get('value')).getroot()
assert len(settings)==18
edges = []
for connection in graph.find(NS+'config[@key="connections"]'):
    edge = (int(entry(connection,'sourceID').get('value')),int(entry(connection,'destID').get('value')))
    assert all(id_ in settings for id_ in edge)
    edges.append(edge)
assert len(edges)==len(set(edges))==17
reachable = {13}
while True:
    added = reachable|{dest for source,dest in edges if source in reachable}
    if added==reachable:
        break
    reachable=added
assert reachable==settings.keys()
for root in settings.values():
    assert root.find(NS+'config[@key="nodeAnnotation"]/'+NS+'entry[@key="text"]').get('value')
    assert 'CSVWriter' not in entry(root,'factory').get('value')
    assert 'StringReplacer' not in entry(root,'factory').get('value')
scatter = settings[21].find(NS+'config[@key="view"]')
assert entry(scatter,'xAxisColumnV3').get('value')=='screensize_inch'
assert entry(scatter,'yAxisColumnV3').get('value')==ENERGY
assert int(entry(scatter,'maxRows').get('value'))>=4508
histograms = [root for root in settings.values() if 'HistogramNodeFactory' in entry(root,'factory').get('value')]
assert len(histograms)==1
histogram = histograms[0].find(NS+'config[@key="model"]')
assert entry(histogram,'dimensionV3').get('value')=='screensize'
assert int(entry(histogram,'nBins').get('value')) in [10,20,30]
for id_,category in [(35,'screensize_label'),(37,'screensize_category')]:
    model = settings[id_].find(NS+'config[@key="model"]')
    assert entry(model,'aggregationMethod').get('value')=='AVG'
    assert entry(model,'categoryColumnV3').get('value')==category
    selected=model.find('.//'+NS+'config[@key="manuallySelected"]')
    assert entry(selected,'array-size').get('value')=='1' and entry(selected,'0').get('value')==ENERGY
pivot = settings[41].find(NS+'config[@key="model"]')
assert entry(settings[41],'factory').get('value')=='org.knime.base.node.preproc.pivot.Pivot2NodeFactory'
assert entry(pivot,'column_name_option').get('value')=='Pivot name'
assert pivot.find(NS+'config[@key="pivotColumns"]/'+NS+'config[@key="InclList"]/'+NS+'entry[@key="0"]').get('value')=='screensize_category'
assert pivot.find(NS+'config[@key="aggregationColumn"]/'+NS+'config[@key="columnNames"]/'+NS+'entry[@key="0"]').get('value')==ENERGY
assert pivot.find(NS+'config[@key="aggregationColumn"]/'+NS+'config[@key="aggregationMethod"]/'+NS+'entry[@key="0"]').get('value')=='Mean'
print('PASS: 18 connected annotated nodes; chart aggregation, source counts and Pivot settings checked.')
for band in BANDS:
    part=[r for r in rows if r['band']==band]
    print(band,len(part),'expected mean kWh/year:',round(statistics.mean(r[ENERGY] for r in part),6))
pending=[id_ for id_,root in settings.items() if entry(root,'state').get('value')!='EXECUTED']
if pending:
    raise SystemExit(f'KNIME execution pending for nodes {pending}: reopen the workflow, Execute all, then Save. Chart values still need inspection in KNIME.')
for id_,expected_rows in [(13,4724),(27,4710),(28,4508),(38,3),(41,3)]:
    summaries=[e.get('value') for e in settings[id_].iter(NS+'entry') if e.get('key')=='port_object_summary']
    assert any(value.startswith(f'Rows: {expected_rows},') for value in summaries), (id_,summaries)
print('PASS: all nodes are saved as EXECUTED and key output row counts match. Inspect chart values against README; no CSV exports are required.')
