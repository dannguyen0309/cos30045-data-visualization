"""Independent arithmetic checks against the original February teaching snapshot."""
import collections
import csv
import hashlib
import json
import math
from pathlib import Path

LAB=Path(__file__).resolve().parents[1]
def read(path):
    with path.open(encoding='utf-8-sig',newline='') as f:return list(csv.DictReader(f))
def main():
    raw=read(LAB/'Lab-2/Exercise-2/data/tv_2026_02_15.csv')
    rows=[r for r in raw if r['Availability Status']=='Available' and 'Australia' in r['SoldIn'].split(',')]
    expected_brands=collections.Counter(r['Brand_Reg'].strip().lower().replace('samsung electronics','samsung') for r in rows)
    expected_brands={k:v for k,v in expected_brands.items() if v>=20}
    brands=read(LAB/'Lab-4/data/tvBrandCount.csv')
    assert {r['brand']:int(r['count']) for r in brands}==expected_brands,'Brand counts differ from source'
    assert len(brands)==len({r['brand'] for r in brands})
    sizes=collections.Counter(); energies=collections.defaultdict(list)
    for r in rows:
        inches=math.floor(float(r['screensize'])/2.54+.5)
        group='1. Small (<=43 in)' if inches<=43 else '2. Medium (44-65 in)' if inches<=65 else '3. Large (>=66 in)'
        sizes[group]+=1
        if inches==55:energies[r['Screen_Tech']].append(float(r['Labelled energy consumption (kWh/year)']))
    pending=[]
    size_path=LAB/'Lab-5/data/sizeCounts.csv';energy_path=LAB/'Lab-5/data/energy55.csv'
    if size_path.exists():
        actual=read(size_path)
        assert {r['screensize_category']:int(r['Count*(Model_No)']) for r in actual}==sizes
        assert sum(int(r['Count*(Model_No)']) for r in actual)==len(rows)
    else:pending.append('KNIME sizeCounts.csv')
    if energy_path.exists():
        actual=read(energy_path)
        assert len(actual)==len(energies)
        for r in actual:
            values=energies[r['Screen_Tech']]
            assert int(r['Count*(Model_No)'])==len(values)
            assert math.isclose(float(r['Mean(Labelled energy consumption (kWh/year))']),sum(values)/len(values),rel_tol=1e-10)
    else:pending.append('KNIME energy55.csv')
    price=read(LAB/'Lab-5/data/ARE_Spot_Prices.csv')
    assert sorted(int(r['Year']) for r in price)==list(range(1998,2025))
    state_columns=['Queensland ($ per megawatt hour)','New South Wales ($ per megawatt hour)','Victoria ($ per megawatt hour)','South Australia ($ per megawatt hour)']
    for r in price:assert math.isclose(float(r['Average Price (notTas-Snowy)']),sum(float(r[c]) for c in state_columns)/4)
    tv=read(LAB/'Lab-6/data/Ex6_TVdata_withStar.csv')
    assert (LAB/'Ex6_TVdata_withStar.csv').read_bytes()==(LAB/'Lab-6/data/Ex6_TVdata_withStar.csv').read_bytes()
    for r in tv:
        for column in ['screenSize','star','energyConsumption']:
            assert r[column].strip() and math.isfinite(float(r[column])) and float(r[column])>=0
    report={
        'source_rows':len(raw),'available_australia':len(rows),'brand_groups':len(brands),'brand_registration_total':sum(expected_brands.values()),
        'expected_size_counts':dict(sizes),'expected_55inch':{k:{'n':len(v),'mean_kWh_year':sum(v)/len(v)} for k,v in energies.items()},
        'price_years':len(price),'tv_rows':len(tv),'technology_counts':dict(collections.Counter(r['screenTech'] for r in tv)),
        'energy_extent':[min(float(r['energyConsumption']) for r in tv),max(float(r['energyConsumption']) for r in tv)],
        'files_sha256':{str(p.relative_to(LAB)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [LAB/'Lab-4/data/tvBrandCount.csv',LAB/'Lab-5/data/ARE_Spot_Prices.csv',LAB/'Lab-6/data/Ex6_TVdata_withStar.csv']},
        'pending':pending,'note':'Independent calculations verify exports; they do not replace KNIME execution evidence.'
    }
    (LAB/'evidence').mkdir(exist_ok=True)
    (LAB/'evidence/data-checks.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))
    if pending:raise SystemExit('Pending: '+', '.join(pending))
if __name__=='__main__':main()
