import { useState } from 'react';
import { ANNUAL } from './data';
import { comparisonChoices, comparisonSize, defaultComparisonTVs, lowestEnergyRegistrations, tvKey } from './analysis';

const number = new Intl.NumberFormat('en-AU', { maximumFractionDigits: 1 });
const sizeNumber = new Intl.NumberFormat('en-AU', { maximumFractionDigits: 2 });

export default function TVComparison({ rows }) {
  const [localSize, setLocalSize] = useState(50);
  const [chosenKeys, setChosenKeys] = useState([]);
  const sizes = [...new Set(rows.map(comparisonSize))].sort((a, b) => a - b);
  const size = sizes.includes(localSize) ? localSize
    : sizes.reduce((closest, value) => Math.abs(value - 50) < Math.abs(closest - 50) ? value : closest, sizes[0]);
  const candidates = comparisonChoices(rows, size);
  const selected = defaultComparisonTVs(candidates).map((row, index) => candidates.find(item => tvKey(item) === chosenKeys[index]) || row);
  const minimum = Math.min(...selected.map(row => row[ANNUAL]));
  const winners = selected.filter(row => row[ANNUAL] === minimum).length;
  const changeTV = (index, row) => setChosenKeys(selected.map((item, position) => tvKey(position === index ? row : item)));

  return <section className="panel model-panel" id="models" aria-labelledby="models-title">
    <div className="section-heading">
      <div><p className="chart-number">Analysis 08 · Model comparison</p><h2 id="models-title">{selected.length === 3 ? 'Compare three similar-sized TVs' : 'Compare matching TVs'}</h2></div>
      <label className="comparison-size" htmlFor="comparison-size">Screen size (approximate)
        <select id="comparison-size" value={size ?? ''} disabled={!sizes.length} onChange={event => { setLocalSize(Number(event.target.value)); setChosenKeys([]); }}>
          {sizes.map(value => <option key={value} value={value}>Around {value} inches</option>)}
        </select>
      </label>
    </div>
    {selected.length ? <div className="tv-comparison">
      {selected.map((row, index) => {
        const others = new Set(selected.filter((_, position) => position !== index).map(tvKey));
        const available = candidates.filter(item => !others.has(tvKey(item)));
        const brands = [...new Set(available.map(item => item.Brand_Reg))].sort();
        const models = available.filter(item => item.Brand_Reg === row.Brand_Reg);
        const winner = selected.length > 1 && row[ANNUAL] === minimum;
        return <article className={`tv-card${winner ? ' tv-card-lowest' : ''}`} key={index} aria-label={`TV ${index + 1}: ${row.Brand_Reg} ${row.Model_No}`}>
          <div className="tv-card-heading"><h3>{row.Brand_Reg}</h3><p>{row.Model_No}</p></div>
          <div className="tv-card-energy">
            <p className="tv-card-badge" aria-hidden={!winner}>{winner ? `${winners > 1 ? 'Joint lowest' : 'Lowest'} energy of these ${selected.length} TVs` : ''}</p>
            <p className="tv-energy-label">Annual electricity use</p>
            <div><strong>{number.format(row[ANNUAL])}</strong><span>kWh/year</span></div>
          </div>
          <dl className="tv-card-facts">
            <div><dt>Screen size</dt><dd>{sizeNumber.format(row['Screen Size (inches)'])} inches</dd></div>
            <div><dt>Display technology</dt><dd>{row.Screen_Tech}</dd></div>
            <div><dt>Energy rating</dt><dd>{number.format(row.Star2)} stars</dd></div>
          </dl>
          <details className="tv-card-choice">
            <summary aria-label={`Change TV ${index + 1}`}>Change TV</summary>
            <div>
              <label htmlFor={`tv-brand-${index}`}>Brand
                <select id={`tv-brand-${index}`} value={row.Brand_Reg} onChange={event => changeTV(index, lowestEnergyRegistrations(available.filter(item => item.Brand_Reg === event.target.value), 1)[0])}>
                  {brands.map(brand => <option key={brand}>{brand}</option>)}
                </select>
              </label>
              <label htmlFor={`tv-model-${index}`}>TV model
                <select id={`tv-model-${index}`} value={tvKey(row)} onChange={event => changeTV(index, candidates.find(item => tvKey(item) === event.target.value))}>
                  {models.map(item => <option key={tvKey(item)} value={tvKey(item)}>{item.Model_No} · {item['Registration Number']}</option>)}
                </select>
              </label>
            </div>
          </details>
        </article>;
      })}
    </div> : <p className="chart-note">No TVs match these filters.</p>}
  </section>;
}
