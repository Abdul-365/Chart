// src/components/ForexChart.js
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

const ForexChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chart`, {
          params: {
            f: 'json',
            n: 50,
            i: 1200,
            s: 'EURUSD',
          },
        });

        const data = response.data.data.EURUSD;
        
        const labels = data.map(entry => new Date(entry.time * 1000).toLocaleTimeString());
        const closingPrices = data.map(entry => parseFloat(entry.close));
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Closing Prices',
              data: closingPrices,
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching the forex data', error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) 
    return <p>Loading...</p>;
  return (
    <>
      <h2>EURUSD</h2>
      <Line data={chartData} />
    </>
  );
};

export default ForexChart;
