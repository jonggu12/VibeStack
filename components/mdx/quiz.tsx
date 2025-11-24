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
        <div className="my-6 p-6 bg-gray-50 rounded-lg border">
            {/* 질문 */}
            <div className="flex items-start gap-3 mb-4">
                <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <h3 className="font-semibold text-gray-900">{question}</h3>
            </div>

            {/* 옵션들 */}
            <div className="space-y-2 ml-8">
                {options.map((option, index) => {
                    const isSelected = selectedIndex === index
                    const isOptionCorrect = option.correct

                    let bgColor = 'bg-white hover:bg-gray-100'
                    let borderColor = 'border-gray-200'
                    let textColor = 'text-gray-700'

                    if (showResult && isSelected) {
                        if (isOptionCorrect) {
                            bgColor = 'bg-green-50'
                            borderColor = 'border-green-500'
                            textColor = 'text-green-700'
                        } else {
                            bgColor = 'bg-red-50'
                            borderColor = 'border-red-500'
                            textColor = 'text-red-700'
                        }
                    } else if (showResult && isOptionCorrect) {
                        bgColor = 'bg-green-50'
                        borderColor = 'border-green-500'
                        textColor = 'text-green-700'
                    } else if (isSelected) {
                        bgColor = 'bg-blue-50'
                        borderColor = 'border-blue-500'
                        textColor = 'text-blue-700'
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        정답 확인
                    </button>
                ) : (
                    <div className="space-y-3">
                        <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                            <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                {isCorrect ? '🎉 정답입니다!' : '❌ 틀렸습니다.'}
                            </p>
                            {explanation && (
                                <p className="text-sm text-gray-600 mt-1">{explanation}</p>
                            )}
                        </div>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            다시 풀기
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
