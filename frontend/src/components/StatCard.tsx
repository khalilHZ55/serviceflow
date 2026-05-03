interface Props {
  label: string;
  value: string | number;
  suffix?: string; // ej: "€" o "citas"
}

function StatCard({ label, value, suffix }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-semibold text-gray-800">
        {value}
        {suffix && <span className="text-lg text-gray-400 ml-1">{suffix}</span>}
      </p>
    </div>
  );
}

export default StatCard;