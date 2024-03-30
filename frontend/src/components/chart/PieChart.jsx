import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, title }) => {
    const chartData = {
      labels: data?.map((item) => item.incident_type || item.status),
      datasets: [
        {
          data: data?.map((item) => item.count),
          backgroundColor: data?.map((_, index) => `hsl(${(index * 60) % 360}, 70%, 50%)`),
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    };
  
    return (
      <div className="pie-chart">
        <h3>{title}</h3>
        <div className="chart-container">
          <Pie data={chartData} options={options} />
        </div>
      </div>
    );
  };

  export default PieChart