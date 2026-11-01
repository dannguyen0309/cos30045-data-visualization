// Shared state connects the loader, charts and controls without loading the CSV twice.
const TV = {
  // Use the same technology colours for scatterplot points and legend entries.
  colors:{LCD:'#0b5f9a',LED:'#d1570a',OLED:'#8b3f8f'},
  // Disable animation when the user requests reduced motion; otherwise use 220 ms.
  duration:()=>matchMedia('(prefers-reduced-motion: reduce)').matches?0:220,
  // data holds all valid records; visible holds the selected subset; domains are set once.
  selected:'All',data:[],visible:[],binGenerator:null,energyMax:1,starMax:1,frequencyMax:1
};
// Build tooltip text from the bound record; reuse it for the selector and accessible labels.
const describeTV=d=>`${d.brand} ${d.model} · ${d.screenTech} · ${d.screenSize} inch · ${d.star} stars · ${d.energyConsumption} kWh/year`;
