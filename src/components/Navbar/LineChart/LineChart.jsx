import React, { useEffect, useState } from 'react';
import Chart from 'react-google-charts';

const chartOptions = {
  backgroundColor: 'transparent',
  chartArea: { left: 50, right: 24, top: 20, bottom: 36, width: '100%', height: '72%' },
  colors: ['#34d399'],
  curveType: 'function',
  hAxis: {
    textStyle: { color: '#a5b4fc' },
    gridlines: { color: 'transparent' },
    baselineColor: '#243041',
  },
  vAxis: {
    textStyle: { color: '#a5b4fc' },
    gridlines: { color: 'rgba(148, 163, 184, 0.12)' },
    baselineColor: '#243041',
  },
  legend: { position: 'none' },
  tooltip: {
    isHtml: true,
    textStyle: { color: '#0f172a' },
  },
};

const LineChart = ({ historicalData, currencySymbol }) => {
  const [data, setData] = useState([['Date', 'Price']]);

  useEffect(() => {
    const nextData = [['Date', 'Price']];

    historicalData.forEach(([timestamp, price]) => {
      nextData.push([
        new Date(timestamp).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
        Number(price.toFixed(2)),
      ]);
    });

    setData(nextData);
  }, [historicalData]);

  return (
    <Chart
      chartType='LineChart'
      data={data}
      height='100%'
      options={{
        ...chartOptions,
        vAxis: {
          ...chartOptions.vAxis,
          format: `${currencySymbol}#,###`,
        },
      }}
      legendToggle
    />
  );
};

export default LineChart;
