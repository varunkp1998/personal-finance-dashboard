interface SummaryCardProps {
  title: string;
  amount: number;
  color: string;
}

export default function SummaryCard({ title, amount, color }: SummaryCardProps) {
  return (
    <div className={`bg-${color}-100 p-4 rounded-lg shadow-md`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className={`text-${color}-600 text-2xl font-bold`}>₹{amount.toLocaleString("en-IN")}</p>
    </div>
  );
}
