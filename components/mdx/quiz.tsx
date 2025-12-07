'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'

interface QuizOption {
    text: string
    correct?: boolean
}

interface QuizProps {
    question: string
    options: QuizOption[]
    explanation?: string
}

export function Quiz({ question, options, explanation }: QuizProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)

    const handleSelect = (index: number) => {
        if (showResult) return
        setSelectedIndex(index)
    }

    const handleSubmit = () => {
        if (selectedIndex === null) return
        setShowResult(true)
    }

    const handleReset = () => {
        setSelectedIndex(null)
        setShowResult(false)
    }

    const isCorrect = selectedIndex !== null && options[selectedIndex]?.correct

    return (
        <div className="my-6 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
            {/* 질문 */}
            <div className="flex items-start gap-3 mb-4">
                <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <h3 className="font-semibold text-white">{question}</h3>
            </div>

            {/* 옵션들 */}
            <div className="space-y-2 ml-8">
                {options.map((option, index) => {
                    const isSelected = selectedIndex === index
                    const isOptionCorrect = option.correct

                    let bgColor = 'bg-zinc-800 hover:bg-zinc-700'
                    let borderColor = 'border-zinc-700'
                    let textColor = 'text-zinc-300'

                    if (showResult && isSelected) {
                        if (isOptionCorrect) {
                            bgColor = 'bg-green-500/10'
                            borderColor = 'border-green-500/30'
                            textColor = 'text-green-400'
                        } else {
                            bgColor = 'bg-red-500/10'
                            borderColor = 'border-red-500/30'
                            textColor = 'text-red-400'
                        }
                    } else if (showResult && isOptionCorrect) {
                        bgColor = 'bg-green-500/10'
                        borderColor = 'border-green-500/30'
                        textColor = 'text-green-400'
                    } else if (isSelected) {
                        bgColor = 'bg-blue-500/10'
                        borderColor = 'border-blue-500/30'
                        textColor = 'text-blue-400'
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleSelect(index)}
                            disabled={showResult}
                            className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${bgColor} ${borderColor} ${textColor} ${
                                showResult ? 'cursor-default' : 'cursor-pointer'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span>{option.text}</span>
                                {showResult && isSelected && (
                                    isOptionCorrect ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                                    )
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* 버튼 및 결과 */}
            <div className="mt-4 ml-8">
                {!showResult ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedIndex === null}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
                    >
                        정답 확인
                    </button>
                ) : (
                    <div className="space-y-3">
                        <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                            <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {isCorrect ? '🎉 정답입니다!' : '❌ 틀렸습니다.'}
                            </p>
                            {explanation && (
                                <p className="text-sm text-zinc-400 mt-1">{explanation}</p>
                            )}
                        </div>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                        >
                            다시 풀기
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
