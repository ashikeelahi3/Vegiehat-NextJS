"use client";

import { useEffect, useState } from 'react';
import { WebR } from 'webr';
import Plotly from 'plotly.js-dist';

// Initialize WebR with correct path for Next.js public directory
const webR = new WebR({
  baseUrl: '/webr/',  // Update this path
  interactive: false
});

let packagesInstalled = false;

export default function Report() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sampleSize, setSampleSize] = useState<number>(100);

  async function initializeWebR() {
    try {
      setStatus('Initializing WebR...');
      setProgress(20);
      await webR.init();
      
      // Install required packages
      const packages = ['ggplot2', 'plotly', 'purrr', 'dplyr'];
      for (let i = 0; i < packages.length; i++) {
        setProgress(20 + ((i + 1) * 20));
        setStatus(`Installing ${packages[i]}...`);
        await webR.installPackages([packages[i]], { quiet: true });
      }
      
      packagesInstalled = true;
      setStatus('Ready');
      setIsLoading(false);
    } catch (error) {
      setError('Failed to initialize WebR');
      setIsLoading(false);
    }
  }

  async function generatePlot(sampleSize: number = 100) {
    if (!packagesInstalled) {
      setError('Please wait for package installation');
      return;
    }

    try {
      setIsLoading(true);
      setProgress(50);
      setStatus('Generating plot...');

      const plotlyData = await webR.evalRString(`
        library(plotly)
        library(ggplot2)
        library(purrr)
        library(dplyr)

        sampleSize <- ${sampleSize}
        meanBinom <- 1:sampleSize %>% 
          map_dbl(
            function(i){
              mean(rbinom(size=1, n=i, prob=0.5))
            }
          )
        df <- data.frame(n = c(1:sampleSize), meanBinom=meanBinom)
        p <- ggplot() +
          geom_point(
            data = df,
            aes(x = n, y = meanBinom),
            color = "#667eea",
            size = 3,
            alpha = 0.7
          ) +
          geom_hline(yintercept=0.5, linetype="dashed", color="#764ba2", size=1) +
          xlab("Sample Size") +
          ylab("Mean") +
          ylim(c(0,1)) +
          theme_minimal()
        
        plotly_json(p, pretty = FALSE)
      `);

      setProgress(75);
      const plotData = JSON.parse(plotlyData);
      
      // Create plot
      const layout = {
        autosize: true,
        margin: { l: 50, r: 30, t: 30, b: 50 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Inter, sans-serif' }
      };

      const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d' as const, 'select2d' as const],
        displaylogo: false
      };

      Plotly.newPlot('plot-container', plotData, layout, config);
      
      setProgress(100);
      setStatus('Plot generated');
      setIsLoading(false);
    } catch (error) {
      setError('Failed to generate plot');
      setIsLoading(false);
    }
  }

  useEffect(() => {
    initializeWebR();
  }, []);

  return (
    <main className="p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">WebR Analysis</h1>
        
        {isLoading && (
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded">
              <div 
                className="h-2 bg-blue-600 rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{status}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <label htmlFor="sampleSize" className="block text-sm font-medium text-gray-700 mb-1">
              Sample Size
            </label>
            <input
              id="sampleSize"
              type="number"
              min="1"
              max="1000"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => generatePlot(sampleSize)}
            disabled={isLoading || !packagesInstalled}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Generate Plot
          </button>
        </div>

        <div 
          id="plot-container" 
          className="w-full h-[500px] bg-white rounded shadow"
        />
      </div>
    </main>
  );
}