"""Build the Lab 3 static charts from the same teaching CSV as Lab 2."""
import csv
import hashlib
import html
import json
import math
import shutil
import statistics
from collections import Counter
from pathlib import Path

BASE = Path(__file__).resolve().parent
SOURCE = BASE.parent / 'Lab-2/Exercise-2/data/tv_2026_02_15.csv'
ENERGY = 'Labelled energy consumption (kWh/year)'
BANDS = ['Small', 'Medium', 'Large']
TECHNOLOGIES = ['LCD', 'LCD (LED)', 'OLED']
COLOURS = {'LCD': '#667085', 'LCD (LED)': '#1665d8', 'OLED': '#9c4774'}

def svg_open(title, description, height):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 {height}" role="img" aria-labelledby="title description"><title id="title">{html.escape(title)}</title><desc id="description">{html.escape(description)}</desc><style>text{{font-family:Arial,sans-serif;fill:#102a43;font-size:26px}}.value{{font-weight:700}}.grid{{stroke:#dbe4ee;stroke-width:1}}</style>'

def bars(title, unit, labels, values, colours, maximum):
    parts = [svg_open(title, '; '.join(f'{label}: {value:.1f} {unit}' for label,value in zip(labels,values)), 310)]
    for tick in [0, maximum/2, maximum]:
        x = 180 + tick/maximum*350
        parts.append(f'<path class="grid" d="M{x} 25V235"/><text x="{x}" y="272" text-anchor="middle">{tick:g}</text>')
    for index,(label,value,colour) in enumerate(zip(labels,values,colours)):
        y = 36 + index*70
        parts.append(f'<text x="160" y="{y+28}" text-anchor="end">{html.escape(label)}</text><rect x="180" y="{y}" width="{value/maximum*350:.3f}" height="40" rx="3" fill="{colour}"/><text class="value" x="{190+value/maximum*350:.3f}" y="{y+28}">{value:.1f}</text>')
    parts.append(f'<text x="355" y="305" text-anchor="middle">{html.escape(unit)}</text></svg>')
    return ''.join(parts)

def grouped_bars(summary):
    parts = [svg_open('Mean annual energy by technology within each size group', 'Nine bars compare LCD, LCD (LED), and OLED within Small, Medium and Large screen groups. All bars share a zero baseline and an 800 kWh/year scale.', 675)]
    for tick in [0,400,800]:
        x = 180 + tick/800*350
        parts.append(f'<path class="grid" d="M{x} 38V615"/><text x="{x}" y="643" text-anchor="middle">{tick}</text>')
    for index,band in enumerate(BANDS):
        top = index*200
        parts.append(f'<text x="12" y="{top+29}" class="value">{band.upper()}</text>')
        for j,technology in enumerate(TECHNOLOGIES):
            value = summary[technology][band]['mean_energy']
            y = top + 45 + j*49
            parts.append(f'<text x="160" y="{y+25}" text-anchor="end">{html.escape(technology)}</text><rect x="180" y="{y}" width="{value/800*350:.3f}" height="34" rx="3" fill="{COLOURS[technology]}"/><text class="value" x="{190+value/800*350:.3f}" y="{y+25}">{value:.1f}</text>')
    parts.append('<text x="355" y="674" text-anchor="middle">Mean energy (kWh/year)</text></svg>')
    return ''.join(parts)

def main():
    (BASE/'data').mkdir(exist_ok=True)
    (BASE/'assets').mkdir(exist_ok=True)
    local = BASE/'data/tv_2026_02_15.csv'
    # shortcut: static charts need a rebuild when the snapshot changes; add live loading only if regular updates are required.
    if SOURCE.exists():
        shutil.copy2(SOURCE,local)
        assert hashlib.sha256(local.read_bytes()).digest()==hashlib.sha256(SOURCE.read_bytes()).digest()
    with local.open(encoding='utf-8-sig',newline='') as stream:
        raw = list(csv.DictReader(stream))
    rows = [r for r in raw if r['Availability Status']=='Available' and 'Australia' in r['SoldIn'].split(',')]
    for row in rows:
        row['inches'] = float(row['screensize'])/2.54
        row['rounded'] = math.floor(row['inches']+.5)
        row['band'] = BANDS[0] if row['rounded']<=43 else BANDS[1] if row['rounded']<=65 else BANDS[2]
        row[ENERGY] = float(row[ENERGY])
        assert math.isfinite(row['inches']) and row['inches']>0 and math.isfinite(row[ENERGY]) and row[ENERGY]>=0
    assert len(raw)==4724 and len(rows)==4508
    assert Counter(r['Screen_Tech'] for r in rows)=={'LCD':562,'LCD (LED)':3658,'OLED':288}
    assert Counter(r['band'] for r in rows)==dict(zip(BANDS,[1111,2059,1338]))
    bands = {band:{'count':len(part),'mean_energy':statistics.mean(r[ENERGY] for r in part)} for band in BANDS if (part:=[r for r in rows if r['band']==band])}
    technologies = {technology:{'count':len(part),'mean_inches':statistics.mean(r['inches'] for r in part)} for technology in TECHNOLOGIES if (part:=[r for r in rows if r['Screen_Tech']==technology])}
    comparison = {technology:{band:{'count':len(part),'mean_energy':statistics.mean(r[ENERGY] for r in part)} for band in BANDS if (part:=[r for r in rows if r['Screen_Tech']==technology and r['band']==band])} for technology in TECHNOLOGIES}
    reference = [158.1098109810981,404.6804273919378,748.8849028400598]
    for band,expected in zip(BANDS,reference):
        assert math.isclose(bands[band]['mean_energy'],expected,abs_tol=1e-6)
    summary = {'snapshot':'2026-02-15','raw_count':len(raw),'filtered_count':len(rows),'bands':bands,'technologies':technologies,'comparison':comparison}
    (BASE/'data/story_summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
    (BASE/'assets/size-energy.svg').write_text(bars('Mean annual energy by screen-size group','Mean energy (kWh/year)',BANDS,[bands[b]['mean_energy'] for b in BANDS],['#1665d8']*3,800),encoding='utf-8')
    (BASE/'assets/technology-size.svg').write_text(bars('Mean screen size by technology','Mean diagonal (inches)',TECHNOLOGIES,[technologies[t]['mean_inches'] for t in TECHNOLOGIES],[COLOURS[t] for t in TECHNOLOGIES],80),encoding='utf-8')
    (BASE/'assets/technology-energy.svg').write_text(grouped_bars(comparison),encoding='utf-8')
    print('PASS: static chart data checked; 4,508 records; size means and technology counts match the Lab 2 reference.')

if __name__=='__main__':
    main()
