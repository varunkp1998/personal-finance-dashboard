import { Pie } from "react-chartjs-2";

interface PieChartProps {
  transactions: any[];
}

export default function PieChart({ transactions }: PieChartProps) {
  // Process transactions for pie chart
  const categories = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"],
      },
    ],
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-2">Expense Breakdown</h2>
      <div className="h-64">
        <Pie data={data} />
      </div>
    </div>
  );
}
