'use client';

import type { RpgUser } from '@/lib/api/rpg';

interface RpgExportButtonProps {
  searchQuery?: string;
  filteredUsers?: RpgUser[];
}

export default function RpgExportButton({ searchQuery, filteredUsers = [] }: RpgExportButtonProps) {
  const handleExport = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      alert('出力するユーザーがいません');
      return;
    }

    // CSV生成（職人魂→狩猟本能→共感本能→防衛本能→飛躍本能の順序）
    const headers = ['ID', '名前', 'ニックネーム', '性別', '職人魂(Gunner)', '狩猟本能(Fencer)', '共感本能(Healer)', '防衛本能(Shielder)', '飛躍本能(Schemer)', '診断日時'];
    
    const rows = filteredUsers.map(user => {
      const diagnosis = user.rpg_diagnosis;
      return [
        user.id,
        user.name,
        user.nickname || '',
        user.gender === 'male' ? '男性' : user.gender === 'female' ? '女性' : user.gender || '',
        diagnosis.gunner,
        diagnosis.fencer,
        diagnosis.healer,
        diagnosis.shielder,
        diagnosis.schemer,
        new Date(diagnosis.diagnosed_at).toLocaleString('ja-JP')
      ];
    });

    // CSV文字列作成
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // BOM付きUTF-8でダウンロード（Excelで文字化けしないように）
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // ダウンロード
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `rpg_diagnoses_${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buttonText = searchQuery && searchQuery.trim() 
    ? `検索結果をCSV出力 (${filteredUsers?.length || 0}件)`
    : `CSV出力 (${filteredUsers?.length || 0}件)`;

  return (
    <button
      onClick={handleExport}
      disabled={!filteredUsers || filteredUsers.length === 0}
      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>📥</span>
      {buttonText}
    </button>
  );
}
