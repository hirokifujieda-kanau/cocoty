interface RpgScoreBarProps {
  label: string;
  value: number;
  maxValue: number;
}

export default function RpgScoreBar({ label, value, maxValue }: RpgScoreBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="flex items-center gap-4">
      <span className="w-24 font-semibold text-gray-700">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-6">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-6 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-16 text-right font-bold text-purple-600 text-lg">{value}</span>
    </div>
  );
}
