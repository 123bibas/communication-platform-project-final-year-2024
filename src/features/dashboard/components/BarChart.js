import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function BarChart({ chartData, title }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        min: 0,
        ticks: {
          stepSize: 1
        }
      }
    },
  };
  const labels = [title];
  const data = {
    labels,
    datasets: chartData.map((data, index) => {
      return {
        label: data.type,
        data: [data.number],
        backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'][index],
      }
    })
  };
  return (
    <TitleCard title={title}>
      <Bar options={options} data={data} />
    </TitleCard>
  )
}
export default BarChart