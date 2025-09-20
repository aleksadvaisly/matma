'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MathProblem {
  id: number
  question: string
  answer: number
  type: string
  createdAt: string
}

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [dbStatus, setDbStatus] = useState<string>('')

  useEffect(() => {
    testDatabase()
    generateProblem()
  }, [])

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      if (data.success) {
        setDbStatus(`Database connected! Total problems: ${data.totalProblems}`)
      } else {
        setDbStatus('Database connection failed')
      }
    } catch (error) {
      setDbStatus('Failed to test database')
    }
  }

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    const operations = ['+', '-', '*']
    const op = operations[Math.floor(Math.random() * operations.length)]
    
    let answer: number
    let question: string
    
    switch (op) {
      case '+':
        answer = a + b
        question = `${a} + ${b} = ?`
        break
      case '-':
        answer = a - b
        question = `${a} - ${b} = ?`
        break
      case '*':
        answer = a * b
        question = `${a} × ${b} = ?`
        break
      default:
        answer = a + b
        question = `${a} + ${b} = ?`
    }

    setProblem({
      id: Date.now(),
      question,
      answer,
      type: op === '+' ? 'addition' : op === '-' ? 'subtraction' : 'multiplication',
      createdAt: new Date().toISOString()
    })
    setUserAnswer('')
    setShowAnswer(false)
  }

  const checkAnswer = () => {
    setShowAnswer(true)
  }

  const isCorrect = userAnswer && problem && parseInt(userAnswer) === problem.answer

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Math Learning App</CardTitle>
            <CardDescription>
              Prototype for 6th grade math practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{dbStatus}</p>
          </CardContent>
        </Card>

        {problem && (
          <Card>
            <CardHeader>
              <CardTitle>Math Problem</CardTitle>
              <CardDescription>Type: {problem.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-center p-6 bg-blue-50 rounded-lg">
                {problem.question}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={checkAnswer} disabled={!userAnswer}>
                  Check
                </Button>
              </div>

              {showAnswer && (
                <div className={`p-4 rounded-lg ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isCorrect ? 
                    '✅ Correct! Well done!' : 
                    `❌ Incorrect. The correct answer is ${problem.answer}`
                  }
                </div>
              )}

              <Button onClick={generateProblem} variant="outline" className="w-full">
                New Problem
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}