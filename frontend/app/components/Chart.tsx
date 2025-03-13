import { Line } from "react-chartjs-2";

interface ChartProps {
  transactions: any[];
}

export default function Chart({ transactions }: ChartProps) {
  // Process transactions to create chart data
  const labels = transactions.map((t) => t.date);
  const dataValues = transactions.map((t) => t.amount);

  const data = {
    labels,
    datasets: [
      {
        label: "Income & Expenses",
        data: dataValues,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-2">Income vs Expenses</h2>
      <div className="h-64">
        <Line data={data} />
      </div>
    </div>
  );
}
