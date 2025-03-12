import SummaryCard from "../components/SummaryCard";
import Chart from "../components/Chart";

export default function Dashboard() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <SummaryCard title="Total Income" amount={5000} color="green" />
        <SummaryCard title="Total Expenses" amount={2000} color="red" />
        <SummaryCard title="Net Worth" amount={3000} color="blue" />
      </div>
      <Chart />
    </section>
  );
}
