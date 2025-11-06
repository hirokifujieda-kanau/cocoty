'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Calendar, 
  Target,
  Lightbulb,
  X,
  Minimize2
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onMinimize: () => void;
  communityData?: {
    communities: Array<{ name: string; memberCount: number; activeRate: number; recentPosts: number }>;
    upcomingEvents: Array<{ title: string; date: string; community: string }>;
    recentActivity: Array<{ type: string; count: number }>;
  };
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onToggle,
  onMinimize,
  communityData
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'ココティマネージャーのAIアシスタントです！活動促進のためのアドバイスや分析をお手伝いします。何かお聞きしたいことはありますか？',
      timestamp: '今',
      suggestions: [
        'メンバーの参加率を上げるには？',
        '今月の活動を分析して',
        'イベント企画のアイデアが欲しい',
        'inactive なメンバーへのアプローチ方法'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    {
      icon: TrendingUp,
      title: '活動分析',
      description: '今月の活動データを分析',
      prompt: '今月のココティ活動を分析して、改善点を教えてください'
    },
    {
      icon: Users,
      title: 'メンバー促進',
      description: '参加促進のアドバイス',
      prompt: 'メンバーの参加率を向上させる具体的な方法を教えてください'
    },
    {
      icon: Calendar,
      title: 'イベント企画',
      description: 'イベントアイデアの提案',
      prompt: '来月開催するイベントのアイデアを季節感も含めて提案してください'
    },
    {
      icon: Target,
      title: '目標設定',
      description: '活動目標の設定支援',
      prompt: 'ココティの成長のための短期・中期目標設定をサポートしてください'
    }
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: '今'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // AI応答をシミュレート
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    // シミュレート用の応答生成
    let response = '';
    let suggestions: string[] = [];

    if (userInput.includes('参加率') || userInput.includes('メンバー')) {
      response = `📊 **メンバー参加促進の提案**

現在のデータを分析すると、以下の改善策が効果的です：

**1. ゲーミフィケーション導入**
・参加ポイント制度の実装
・月間MVP制度でモチベーション向上

**2. コミュニケーション改善**  
・定期的な1on1面談の実施
・新メンバー向けのオンボーディング強化

**3. イベント多様化**
・短時間参加可能なミニイベント
・オンライン/オフライン選択制

これらの施策により参加率15-20%向上が期待できます。`;

      suggestions = [
        '具体的な実装手順を教えて',
        'ポイント制度の詳細設計',
        '他の成功事例はある？'
      ];
    } else if (userInput.includes('分析') || userInput.includes('活動')) {
      response = `📈 **今月の活動分析レポート**

**活動状況サマリー:**
・総投稿数: 45件 (先月比+12%)
・アクティブメンバー: 28人 (78%)
・イベント参加率: 85%

**好調なココティ:**
🏆 プログラミング部 (参加率92%)
🏆 写真部 (投稿数+25%)

**要注意ココティ:**
⚠️ 映像制作部 (参加率65%に低下)

**推奨アクション:**
1. 映像制作部への追加サポート検討
2. 好調部活の成功ノウハウ共有会開催`;

      suggestions = [
        '映像制作部の改善策を詳しく',
        '成功要因の分析をもっと',
        '来月の目標設定をしたい'
      ];
    } else if (userInput.includes('イベント') || userInput.includes('企画')) {
      response = `🎉 **季節感のあるイベント企画提案**

**11月開催におすすめ:**

**🍂 秋の合同発表会**
・各部活の成果物展示
・相互交流でココティ活性化
・社内広報効果も期待

**📷 紅葉撮影ツアー**
・写真部主催、他部活も参加OK  
・自然の中でのリラックス交流

**🍳 秋の味覚料理大会**
・料理部企画、チーム戦形式
・食を通じた部活間交流促進

どのイベントに興味がありますか？詳細な企画書も作成できます。`;

      suggestions = [
        '合同発表会の詳細企画書が欲しい',
        '予算や準備期間は？',
        '参加促進の方法も教えて'
      ];
    } else {
      response = `🤖 ご質問ありがとうございます！

ココティマネージャーとして以下の分野でサポートできます：

・**活動分析**: データに基づく改善提案
・**メンバー促進**: 参加率向上の具体策  
・**イベント企画**: 季節や目的に応じた企画提案
・**目標設定**: 短期・中期の成長戦略

具体的に何についてアドバイスが必要でしょうか？`;

      suggestions = [
        'メンバーの参加率を上げたい',
        '来月のイベントを企画したい',
        '活動データを分析して欲しい'
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: '今',
      suggestions
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        >
          <Bot className="h-7 w-7" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">AIアシスタント</h3>
            <p className="text-xs text-blue-100">ココティマネージャーサポート</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                >
                  <Icon className="h-4 w-4 text-blue-500 mb-2" />
                  <h4 className="font-medium text-xs text-gray-900">{action.title}</h4>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-2xl p-3`}>
              <div className="flex items-start space-x-2">
                {message.type === 'ai' && (
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-3 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs bg-white bg-opacity-50 hover:bg-opacity-80 rounded-lg p-2 transition-colors"
                        >
                          💡 {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputText)}
            placeholder="質問やお悩みを入力..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;