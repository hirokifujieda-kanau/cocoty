'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getMyRpgResult, type MyRpgResult, RPG_ROLE_LABELS } from '@/lib/api/rpg';
import RpgResultChart from '@/components/rpg/RpgResultChart';
import RpgRoleCard from '@/components/rpg/RpgRoleCard';
import RpgScoreBar from '@/components/rpg/RpgScoreBar';

export default function MyRpgResultPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [result, setResult] = useState<MyRpgResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagnosed, setDiagnosed] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchMyResult();
  }, [user, router]);

  const fetchMyResult = async () => {
    try {
      const data = await getMyRpgResult();
      setResult(data.user);
      setDiagnosed(data.diagnosed);
    } catch (error: any) {
      console.error('Failed to fetch my RPG result:', error);
      if (error.message?.includes('404') || error.message?.includes('完了していません')) {
        setDiagnosed(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!diagnosed || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center max-w-2xl">
          <div className="text-6xl mb-6">🎮</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            まだRPG診断を完了していません
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            診断を受けてあなたのRPGタイプを発見しましょう！
          </p>
          <button
            onClick={() => router.push('/rpg')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-lg font-semibold"
          >
            診断ページへ戻る
          </button>
        </div>
      </div>
    );
  }

  const { rpg_chart_data } = result;

  // 時計回りの順序で並び替え（職人魂が12時）
  const roleOrder = ['Gunner', 'Fencer', 'Healer', 'Shielder', 'Schemer'];
  const sortedData = roleOrder.map(role => {
    const index = rpg_chart_data.labels.findIndex(label => label === role);
    return {
      label: RPG_ROLE_LABELS[role] || role,
      value: rpg_chart_data.values[index]
    };
  });
  const japaneseLabels = sortedData.map(d => d.label);
  const sortedValues = sortedData.map(d => d.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            あなたのRPG診断結果
          </h1>
          <p className="text-gray-600 text-lg">あなたの冒険者タイプをチェック！</p>
        </div>

        {/* 主職業カード */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold mb-3">あなたのメインロール</h2>
          <p className="text-6xl font-bold mb-4">{RPG_ROLE_LABELS[rpg_chart_data.primary_role] || rpg_chart_data.primary_role}</p>
          <p className="text-xl">
            {rpg_chart_data.role_descriptions[rpg_chart_data.primary_role.toLowerCase() as keyof typeof rpg_chart_data.role_descriptions]}
          </p>
        </div>

        {/* レーダーチャート */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">能力チャート</h3>
          <RpgResultChart
            labels={japaneseLabels}
            values={sortedValues}
            maxValue={rpg_chart_data.max_value}
          />
        </div>

        {/* 詳細スコア */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6">詳細スコア</h3>
          <div className="space-y-4">
            {japaneseLabels.map((label, index) => (
              <RpgScoreBar
                key={label}
                label={label}
                value={sortedValues[index]}
                maxValue={rpg_chart_data.max_value}
              />
            ))}
          </div>
        </div>

        {/* ロール説明 */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6">各ロールの説明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(rpg_chart_data.role_descriptions).map(([role, desc]) => (
              <RpgRoleCard key={role} role={role} description={desc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
