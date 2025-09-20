import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection by creating a sample problem
    const testProblem = await prisma.mathProblem.create({
      data: {
        question: "5 + 3 = ?",
        answer: 8,
        type: "addition",
      },
    })

    const count = await prisma.mathProblem.count()

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      testProblem,
      totalProblems: count
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}