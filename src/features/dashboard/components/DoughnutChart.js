import {
  ArcElement,
  Chart as ChartJS,
  Filler,
  Legend,
  Tooltip
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
ChartJS.register(ArcElement, Tooltip, Legend,
  Tooltip,
  Filler,
  Legend);
function DoughnutChart({ chartData, title }) {
  console.log("char", chartData)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
  const labels = chartData.map(data => data.type)
  const data = {
    labels,
    datasets: [
      {
        label: '# of Orders',
        data: chartData.map(data => data.number),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }
    ],
  };
  return (
    <TitleCard title={`${title} Stats`}>
      <Doughnut options={options} data={data} />
    </TitleCard>
  )
}
export default DoughnutChart