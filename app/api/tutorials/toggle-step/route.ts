import { NextResponse } from 'next/server'
import { toggleStepCompletion } from '@/app/tutorials/actions'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tutorialId = body?.tutorialId as string | undefined
    const rawStepNumber = body?.stepNumber as number | string | undefined

    if (!tutorialId || rawStepNumber === undefined) {
      return NextResponse.json(
        { success: false, completed: false, error: 'tutorialId와 stepNumber는 필수입니다.' },
        { status: 400 }
      )
    }

    const stepNumber = typeof rawStepNumber === 'string' ? parseInt(rawStepNumber, 10) : rawStepNumber

    if (!stepNumber || Number.isNaN(stepNumber)) {
      return NextResponse.json(
        { success: false, completed: false, error: '유효한 stepNumber가 필요합니다.' },
        { status: 400 }
      )
    }

    const result = await toggleStepCompletion(tutorialId, stepNumber)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error('Failed to toggle tutorial step:', error)
    return NextResponse.json(
      { success: false, completed: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
