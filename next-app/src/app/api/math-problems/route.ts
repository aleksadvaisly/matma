import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const problems = await prisma.mathProblem.findMany()
    return NextResponse.json(problems)
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, answer, type } = body

    const problem = await prisma.mathProblem.create({
      data: {
        question,
        answer,
        type,
      },
    })

    return NextResponse.json(problem)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 })
  }
}