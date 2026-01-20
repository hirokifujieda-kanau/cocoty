'use client';

import { useState } from 'react';
import { updateTarotCardImage } from '@/lib/api/tarotAdmin';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary/config';

interface UploadStatus {
  cardId: number;
  cardName: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  cloudinaryUrl?: string;
  error?: string;
}

export default function TarotImageUploadPage() {
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Cloudinaryにアップロード
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // 既存のプリセット
    formData.append('folder', 'tarot-cards/major-arcana'); // フォルダ指定

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Cloudinaryへのアップロード失敗');
    }

    const data = await response.json();
    return data.secure_url;
  };

  // 複数ファイルをアップロード
  const handleFilesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    // ファイル名からカードIDを抽出（例: "0-the-fool.png" → 0）
    const fileArray = Array.from(files);
    const initialStatuses: UploadStatus[] = fileArray.map((file) => {
      const match = file.name.match(/^(\d+)-/);
      const cardId = match ? parseInt(match[1]) : -1;
      return {
        cardId,
        cardName: file.name,
        status: 'pending',
      };
    });

    setUploadStatuses(initialStatuses);

    // 順番にアップロード
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const status = initialStatuses[i];

      if (status.cardId === -1) {
        setUploadStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: 'error', error: 'ファイル名が不正です（例: 0-the-fool.png）' } : s
          )
        );
        continue;
      }

      try {
        // ステータス更新: アップロード中
        setUploadStatuses((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: 'uploading' } : s))
        );

        // Cloudinaryにアップロード
        const cloudinaryUrl = await uploadToCloudinary(file);

        // DBを更新
        await updateTarotCardImage(status.cardId, cloudinaryUrl);

        // ステータス更新: 成功
        setUploadStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: 'success', cloudinaryUrl } : s
          )
        );
      } catch (error: any) {
        // ステータス更新: エラー
        setUploadStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: 'error', error: error.message } : s
          )
        );
      }
    }

    setIsUploading(false);
  };

  const successCount = uploadStatuses.filter((s) => s.status === 'success').length;
  const allSuccess = uploadStatuses.length > 0 && uploadStatuses.every((s) => s.status === 'success');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-white text-center">
          🃏 タロットカード画像アップロード
        </h1>

        {/* 手順説明 */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6">
          <h2 className="font-bold text-white text-xl mb-4">📝 アップロード手順</h2>
          <ol className="list-decimal list-inside space-y-2 text-white/90">
            <li>
              画像ファイル名を <code className="bg-white/20 px-2 py-1 rounded">0-the-fool.png</code>,{' '}
              <code className="bg-white/20 px-2 py-1 rounded">1-the-magician.png</code> のように命名
            </li>
            <li>22枚のファイルを選択（Cmd/Ctrlキーで複数選択）</li>
            <li>自動的にCloudinaryにアップロード → データベース更新</li>
            <li>完了後、タロット占い画面で画像が表示されます</li>
          </ol>
        </div>

        {/* ファイル選択 */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6">
          <label className="block mb-4 font-semibold text-white text-lg">
            🖼️ 画像を選択（22枚の Major Arcana）
          </label>
          <input
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            multiple
            onChange={handleFilesUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none p-3 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-2 text-sm text-white/70">
            PNG, JPG形式、ファイル名は <code className="bg-white/20 px-1 rounded">数字-カード名.png</code> の形式
          </p>
        </div>

        {/* アップロード状況 */}
        {uploadStatuses.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6">
            <h2 className="font-bold mb-4 text-white text-xl">
              📊 アップロード状況（{successCount}/{uploadStatuses.length}）
            </h2>

            <div className="space-y-3">
              {uploadStatuses.map((status, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg flex items-center justify-between transition-all ${
                    status.status === 'success'
                      ? 'bg-green-500/20 border border-green-400/50'
                      : status.status === 'error'
                      ? 'bg-red-500/20 border border-red-400/50'
                      : status.status === 'uploading'
                      ? 'bg-blue-500/20 border border-blue-400/50'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* ステータスアイコン */}
                    <div className="text-3xl">
                      {status.status === 'success' && '✅'}
                      {status.status === 'error' && '❌'}
                      {status.status === 'uploading' && (
                        <span className="animate-spin inline-block">⏳</span>
                      )}
                      {status.status === 'pending' && '⏸️'}
                    </div>

                    {/* ファイル情報 */}
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {status.cardId >= 0 ? `Card ${status.cardId}` : '不明'}: {status.cardName}
                      </div>
                      {status.cloudinaryUrl && (
                        <div className="text-xs text-white/60 truncate max-w-md mt-1">
                          {status.cloudinaryUrl}
                        </div>
                      )}
                      {status.error && (
                        <div className="text-xs text-red-300 mt-1">{status.error}</div>
                      )}
                    </div>

                    {/* プレビュー */}
                    {status.cloudinaryUrl && (
                      <img
                        src={status.cloudinaryUrl}
                        alt={status.cardName}
                        className="w-16 h-20 object-cover rounded border-2 border-white/30 shadow-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 完了メッセージ */}
        {allSuccess && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/50 rounded-xl p-6 text-white">
            <h3 className="font-bold text-2xl mb-3 flex items-center gap-2">
              🎉 アップロード完了！
            </h3>
            <p className="mb-3 text-white/90">
              22枚すべてのタロットカード画像がCloudinaryにアップロードされ、データベースも更新されました。
            </p>
            <div className="flex gap-4">
              <a
                href="/api/v1/tarot/cards"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                📡 APIレスポンスを確認 →
              </a>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                🏠 トップページへ →
              </a>
            </div>
          </div>
        )}

        {/* 進行中の表示 */}
        {isUploading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4 animate-spin">⏳</div>
              <p className="text-white text-xl font-semibold">アップロード中...</p>
              <p className="text-white/70 mt-2">
                {successCount}/{uploadStatuses.length} 完了
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
