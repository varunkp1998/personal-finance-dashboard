"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Chart() {
  const data = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Income",
        data: [4000, 4200, 4500, 4700, 5000, 5200],
        borderColor: "green",
        fill: false,
      },
      {
        label: "Expenses",
        data: [2000, 2500, 2300, 2700, 2600, 2800],
        borderColor: "red",
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
}
