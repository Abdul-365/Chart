import { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from "react-apexcharts";

const options = {
  chart: {
    type: 'candlestick',
    height: 350
  },
  title: {
    text: 'CandleStick Chart',
    align: 'left'
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    tooltip: {
      enabled: true
    }
  }
};

const ForexChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chart`, {
          params: {
            f: 'json',
            n: 100,
            i: 600,
            s: 'EURUSD',
          },
        });

        const data = response.data.data.EURUSD;
        const formattedData = data.map(item => ({
          x: new Date(item.time * 1000),
          y: [parseFloat(item.open), parseFloat(item.high), parseFloat(item.low), parseFloat(item.close)]
        }));
        setChartData([{data: formattedData}]);

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
      <Chart options={options} series={chartData} type="candlestick" height={350} />
    </>
  );
};

export default ForexChart;
