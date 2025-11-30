'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import {
  Plus,
  Menu,
  ChevronDown,
  ArrowUp,
  Settings,
  Bot,
  Copy,
  Loader2,
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AIChatPage() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  // Scroll to bottom when new message added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    const text = input.trim()
    if (!text || isTyping) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Simulate AI response
    setIsTyping(true)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000)
  }

  const generateAIResponse = (userText: string): string => {
    return `네, "${userText}"에 대한 답변입니다.\n\n이것은 시뮬레이션된 AI 응답입니다. 실제 AI 통합을 위해서는 OpenAI API 등을 연동해야 합니다.`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const fillInput = (text: string) => {
    setInput(text)
    textareaRef.current?.focus()
  }

  const clearChat = () => {
    if (confirm('새 대화를 시작하시겠습니까?')) {
      setMessages([])
    }
  }

  const chatHistory = [
    { category: '오늘', chats: ['Next.js 미들웨어 설정법', 'Supabase RLS 정책 에러'] },
    { category: '어제', chats: ['React useEffect 무한 루프', 'Tailwind Grid 레이아웃'] },
  ]

  const suggestions = [
    {
      emoji: '🏗️',
      title: '프로젝트 시작',
      text: 'Next.js 14 랜딩 페이지 코드 짜줘',
    },
    {
      emoji: '🚑',
      title: '에러 해결',
      text: 'Hydration failed 에러 원인 분석해줘',
    },
    {
      emoji: '🎨',
      title: 'UI 컴포넌트',
      text: 'Tailwind로 모던한 버튼 스타일 만들어줘',
    },
    {
      emoji: '📚',
      title: '개념 설명',
      text: 'useEffect와 useLayoutEffect 차이점',
    },
  ]

  return (
    <div className="h-screen flex overflow-hidden bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex-col flex shrink-0 hidden md:flex">
        {/* Header: New Chat */}
        <div className="p-4">
          <Link href="/" className="flex items-center gap-2 mb-6 px-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-bold text-xs">
              V
            </div>
            <span className="font-bold text-sm tracking-tight text-white">VibeStack</span>
          </Link>

          <button
            onClick={clearChat}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm text-white transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> 새 대화 시작
            </span>
            <span className="bg-zinc-800 group-hover:bg-zinc-700 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded border border-zinc-700">
              Cmd+N
            </span>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-6 no-scrollbar">
          {chatHistory.map((group) => (
            <div key={group.category}>
              <h4 className="px-3 text-xs font-bold text-zinc-500 mb-2">{group.category}</h4>
              <ul className="space-y-1">
                {group.chats.map((chat, idx) => (
                  <li key={idx}>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white truncate transition-colors">
                      {chat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer: User */}
        <div className="p-4 border-t border-zinc-800">
          <button className="flex items-center gap-3 w-full hover:bg-zinc-900 p-2 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {user?.firstName || '사용자'}
              </p>
              <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
            </div>
            <Settings className="w-4 h-4 text-zinc-500 ml-auto" />
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-900 relative">
        {/* Header (Model Switcher) */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur z-10">
          <div className="flex items-center gap-2 md:hidden">
            <button className="text-zinc-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors mx-auto md:mx-0">
            <span className="text-sm font-bold text-zinc-200">Vibe GPT-4o</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>

          <div className="w-8"></div>
        </header>

        {/* Chat Messages (Scrollable) */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
        >
          {messages.length === 0 ? (
            /* Empty State (Welcome) */
            <div className="h-full flex flex-col items-center justify-center text-center pb-20">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-zinc-700">
                <Bot className="w-8 h-8 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">무엇을 도와드릴까요?</h2>
              <p className="text-zinc-400 text-sm mb-8">
                코드 생성, 에러 디버깅, 개념 설명 등 무엇이든 물어보세요.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => fillInput(suggestion.text)}
                    className="p-4 bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 rounded-xl text-left transition-all group"
                  >
                    <h5 className="text-sm font-bold text-zinc-200 mb-1">
                      {suggestion.emoji} {suggestion.title}
                    </h5>
                    <p className="text-xs text-zinc-500 group-hover:text-zinc-400">
                      {suggestion.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <>
              {messages.map((message) => (
                <div key={message.id}>
                  {message.sender === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-2xl bg-zinc-800 text-white rounded-2xl rounded-tr-sm px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 max-w-3xl mx-auto w-full">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="prose prose-invert text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4 max-w-3xl mx-auto w-full">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area (Fixed Bottom) */}
        <div className="p-4 bg-zinc-900">
          <div className="max-w-3xl mx-auto relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 resize-none overflow-hidden max-h-48"
              placeholder="메시지를 입력하세요..."
            />

            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="absolute bottom-2.5 right-2.5 p-1.5 bg-white text-black rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-[10px] text-zinc-600 mt-2">
            AI는 실수를 할 수 있습니다. 코드를 사용하기 전에 확인하세요.
          </p>
        </div>
      </main>
    </div>
  )
}
