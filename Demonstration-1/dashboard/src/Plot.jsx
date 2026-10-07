import { useEffect, useRef, useState } from "react";

let plotlyPromise;

function loadPlotly() {
  if (window.Plotly) return Promise.resolve(window.Plotly);
  if (!plotlyPromise) {
    plotlyPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.plot.ly/plotly-2.35.2.min.js";
      script.onload = () => resolve(window.Plotly);
      script.onerror = () => reject(new Error("Plotly could not be loaded"));
      document.head.append(script);
    });
  }
  return plotlyPromise;
}

const CONFIG = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: ["lasso2d", "select2d"],
};

export default function Plot({ data, layout, label, className = "chart" }) {
  const element = useRef(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const target = element.current;
    let active = true;
    let plotly;
    loadPlotly()
      .then((library) => {
        if (!active) return;
        plotly = library;
        return library.react(target, data, layout, CONFIG);
      })
      .catch((reason) => active && setError(reason.message));
    return () => {
      active = false;
      if (plotly) plotly.purge(target);
    };
  }, [data, layout]);
  if (error) return <p className="empty-state" role="alert">{error}. Check your internet connection and retry.</p>;
  return <div ref={element} className={className} role="img" aria-label={label} />;
}
