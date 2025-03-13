"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const data = {
    labels: ["Rent", "Food", "Utilities", "Travel", "Entertainment"],
    datasets: [
      {
        data: [800, 500, 300, 400, 300],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
      },
    ],
  };

  return <Pie data={data} />;
}
