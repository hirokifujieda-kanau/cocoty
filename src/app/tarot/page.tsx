'use client';

import React, { useState } from 'react';
import TarotDraw from '@/components/tarot/TarotDraw';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './tarot.module.css';

type TargetType = 'self' | 'partner' | null;

// 選択画面のコンテンツコンポーネント
function TarotSelectionContent({ 
  setSelectedTarget, 
  router 
}: { 
  setSelectedTarget: (target: TargetType) => void; 
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      {/* ヘッダー */}
      <div className="sticky top-0 z-10">
        <div style={{ paddingInline: 'calc(var(--spacing) * 1)' }}>
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-4xl mx-auto p-8 md:pt-[135px]">
        <div className="text-center">
          <h3 
            className="font-bold"
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '16px',
              textAlign: 'center',
              background: 'linear-gradient(360deg, #EDCFAC -31.25%, #E4BC89 75%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginTop: '30px',
              marginBottom: '12px'
            }}
          >
            タロット占い
          </h3>
          <p
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '12px',
              lineHeight: '20px',
              textAlign: 'center',
              color: '#FFFFFF',
              marginBottom: '32px'
            }}
          >
            どちらを占いますか？
          </p>
          <div className="flex justify-center gap-6">
            {/* 自分ボタン */}
            <button
              onClick={() => setSelectedTarget('self')}
              className="transform hover:scale-105 transition-all"
            >
              <Image
                src="/tarot-material/tarot_me.svg"
                alt="自分"
                width={95}
                height={153}
              />
            </button>

            {/* 相手ボタン */}
            <button
              onClick={() => setSelectedTarget('partner')}
              className="transform hover:scale-105 transition-all"
            >
              <Image
                src="/tarot-material/tarot_someone.svg"
                alt="相手"
                width={95}
                height={153}
              />
            </button>
          </div>
          
          {/* 決定ボタン */}
          <div className="flex justify-center mt-8">
            <button
              style={{
                width: '140px',
                height: '48px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)',
                border: '1px solid #CECECE',
                boxShadow: '0px 4px 0px 0px #676158',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '16px',
                textAlign: 'center',
                color: '#FFFFFF'
              }}
            >
              決定
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TarotPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTarget, setSelectedTarget] = useState<TargetType>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h2 className="font-noto font-bold text-xl text-gray-900 mb-4">
            ログインが必要です
          </h2>
          <p className="text-gray-600 mb-6">
            タロット占いを利用するにはログインしてください
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all"
          >
            ログインページへ
          </button>
        </div>
      </div>
    );
  }

  // ターゲット選択前の画面
  if (selectedTarget === null) {
    return (
      <>
        {/* SP用 */}
        <div className={`min-h-screen md:hidden ${styles.tarotBackgroundSp}`}>
          <TarotSelectionContent setSelectedTarget={setSelectedTarget} router={router} />
        </div>
        {/* PC用 */}
        <div className={`min-h-screen hidden md:block ${styles.tarotBackgroundPc}`}>
          <TarotSelectionContent setSelectedTarget={setSelectedTarget} router={router} />
        </div>
      </>
    );
  }

  // カード引く画面
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0B031A 0%, #180936 100%)' }}>
      {/* ヘッダー */}
      <div className="sticky top-0 z-10">
        <div style={{ paddingInline: 'calc(var(--spacing) * 4)' }} className="flex items-center gap-4">
          <button
            onClick={() => setSelectedTarget(null)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 className="text-xl font-bold text-white">
            {selectedTarget === 'self' ? '自分の運勢' : '相手との関係'}
          </h2>
        </div>
      </div>

      {/* タロット占いコンテンツ */}
      <div className="max-w-6xl mx-auto">
        <TarotDraw />
      </div>
    </div>
  );
}
