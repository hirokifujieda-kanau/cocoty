interface RpgRoleCardProps {
  role: string;
  description: string;
}

const roleEmojis: Record<string, string> = {
  fencer: '⚔️',
  healer: '💚',
  schemer: '🎭',
  gunner: '🔫',
  shielder: '🛡️',
};

export default function RpgRoleCard({ role, description }: RpgRoleCardProps) {
  const roleLower = role.toLowerCase();
  
  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 transition-all">
      <h4 className="font-bold text-lg mb-2 capitalize flex items-center gap-2">
        <span className="text-2xl">{roleEmojis[roleLower] || '🎮'}</span>
        {role}
      </h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
