const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const d3 = require('../shared/d3.v7.min.js');
const root = path.resolve(__dirname,'..');
const lab = path.resolve(root,'../../Lab');
const source = p=>fs.readFileSync(path.join(p.startsWith('shared/')?root:lab,p),'utf8');
const header='brand,model,screenSize,screenTech,star,energyConsumption\n';

async function load(csv) {
  const nodes = new Map();
  const context = vm.createContext({
    URL, console:{log:()=>{},error:console.error,assert:console.assert}, matchMedia:()=>({matches:true}),
    window:{d3:true}, d3:{...d3,csv:async(url,parse)=>d3.csvParse(csv,parse)},
    document:{currentScript:{src:'http://localhost/Lab-6/load-data.js'},querySelector:s=>{
      if(!nodes.has(s))nodes.set(s,{textContent:''});
      return nodes.get(s);
    }}, populateFilters:()=>{}, updateTV:()=>{}
  });
  vm.runInContext(source('shared/chart.js')+source('Lab-6/shared-constants.js')+';Chart.responsive=()=>{};',context);
  vm.runInContext(source('Lab-6/load-data.js'),context);
  await new Promise(resolve=>setImmediate(resolve));
  return {context,nodes,tv:vm.runInContext('TV',context),number:vm.runInContext('Chart.number',context)};
}

(async()=>{
  const {tv,number}=await load(source('Lab-6/data/Ex6_TVdata_withStar.csv'));
  for(const missing of ['', '  ',null,undefined])assert.ok(Number.isNaN(number(missing)));
  assert.equal(number('0'),0);assert.equal(number(' 2.5 '),2.5);assert.ok(Number.isNaN(number('bad')));
  assert.equal(tv.data.length,4233);
  const all=tv.binGenerator(tv.data);
  const bounds=JSON.stringify(all.map(d=>[d.x0,d.x1]));
  for(const [tech,count] of [['LCD',455],['LED',3492],['OLED',286],['missing',0]]){
    const data=tv.data.filter(d=>d.screenTech===tech),bins=tv.binGenerator(data);
    assert.equal(data.length,count);assert.equal(d3.sum(bins,d=>d.length),count);
    assert.equal(JSON.stringify(bins.map(d=>[d.x0,d.x1])),bounds);
  }
  assert.equal(d3.sum(all,d=>d.length),tv.data.length);
  assert.ok(all.some(bin=>bin.some(d=>d.energyConsumption===2652)),'Retain the outlier');
  const boundary=tv.binGenerator([{energyConsumption:0},{energyConsumption:tv.energyMax}]);
  assert.equal(d3.sum(boundary,d=>d.length),2,'Include both domain endpoints');
  const fixture=await load(header+'A,1,55,LED,,100\nB,2,55,LED,5,0\nC,3,55,LED,5,-1\n');
  assert.equal(fixture.tv.data.length,1);assert.equal(fixture.tv.data[0].brand,'B');
  const empty=await load(header);
  assert.equal(empty.tv.data.length,0);assert.equal(empty.nodes.get('#selection-status').textContent,'No valid records to plot.');
  console.log('PASS: actual TV loader, missing values, filtering totals, fixed bins, domain endpoints, retained outlier, empty input.');
})().catch(error=>{console.error(error);process.exitCode=1;});
