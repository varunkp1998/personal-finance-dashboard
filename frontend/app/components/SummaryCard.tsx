export default function SummaryCard({ title, amount, color }: { title: string; amount: number; color: string }) {
    return (
      <div className={`p-6 rounded-lg shadow-md bg-${color}-100`}>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className={`text-2xl text-${color}-700 font-bold`}>${amount}</p>
      </div>
    );
  }
  