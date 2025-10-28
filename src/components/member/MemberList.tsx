 'use client';

import React, { useState } from 'react';
import PublicProfile from '@/components/profile/PublicProfile';

const sampleMembers = [
  { id: '1', nickname: 'たなか', bio: '写真が好きです', goal: '月1回は撮影会', teamName: '写真部', diagnosis: 'ENFP' },
  { id: '2', nickname: 'やまだ', bio: 'コード書きます', goal: '新しいライブラリを学ぶ', teamName: 'プログラミング部', diagnosis: 'INTP' },
  { id: '3', nickname: 'さとう', bio: '料理担当', goal: 'レシピ10個公開', teamName: '料理部', diagnosis: 'ISFP' }
];

const MemberList: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">メンバー</h2>
      <div className="space-y-3">
        {sampleMembers.map((m, i) => (
          <div key={m.id} className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
            <div>
              <div className="font-medium">{m.nickname}</div>
              <div className="text-sm text-gray-500">{m.teamName}</div>
            </div>
            <button onClick={() => setSelected(i)} className="px-3 py-1 bg-stone-100 rounded">表示</button>
          </div>
        ))}
      </div>

      {selected !== null && (
        <PublicProfile onClose={() => setSelected(null)} profileData={sampleMembers[selected] as any} />
      )}
    </div>
  );
};

export default MemberList;
