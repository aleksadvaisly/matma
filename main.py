#!/usr/bin/env python3

import random
import sys
from typing import Tuple, Optional
from enum import Enum

class Operation(Enum):
    ADD = "+"
    SUBTRACT = "-"
    MULTIPLY = "*"
    DIVIDE = "/"

class MathProblem:
    def __init__(self, a: int, b: int, operation: Operation):
        self.a = a
        self.b = b
        self.operation = operation
        
    def solve(self) -> float:
        if self.operation == Operation.ADD:
            return self.a + self.b
        elif self.operation == Operation.SUBTRACT:
            return self.a - self.b
        elif self.operation == Operation.MULTIPLY:
            return self.a * self.b
        elif self.operation == Operation.DIVIDE:
            if self.b == 0:
                raise ValueError("Division by zero")
            return self.a / self.b
    
    def __str__(self) -> str:
        return f"{self.a} {self.operation.value} {self.b} = ?"

class ProblemGenerator:
    def __init__(self, min_value: int = 1, max_value: int = 100):
        self.min_value = min_value
        self.max_value = max_value
    
    def generate_addition(self) -> MathProblem:
        a = random.randint(self.min_value, self.max_value)
        b = random.randint(self.min_value, self.max_value)
        return MathProblem(a, b, Operation.ADD)
    
    def generate_subtraction(self) -> MathProblem:
        a = random.randint(self.min_value, self.max_value)
        b = random.randint(self.min_value, min(a, self.max_value))
        return MathProblem(a, b, Operation.SUBTRACT)
    
    def generate_multiplication(self) -> MathProblem:
        a = random.randint(1, min(12, self.max_value))
        b = random.randint(1, min(12, self.max_value))
        return MathProblem(a, b, Operation.MULTIPLY)
    
    def generate_division(self) -> MathProblem:
        b = random.randint(1, min(12, self.max_value))
        result = random.randint(1, min(12, self.max_value))
        a = b * result
        return MathProblem(a, b, Operation.DIVIDE)
    
    def generate_random(self) -> MathProblem:
        generators = [
            self.generate_addition,
            self.generate_subtraction,
            self.generate_multiplication,
            self.generate_division
        ]
        return random.choice(generators)()

class WordProblemGenerator:
    def __init__(self):
        self.templates = {
            Operation.ADD: [
                "Kasia ma {a} jabłek. Dostała jeszcze {b} jabłek. Ile jabłek ma teraz?",
                "W klasie jest {a} chłopców i {b} dziewczynek. Ile jest wszystkich uczniów?",
                "Tomek przeczytał {a} stron książki rano i {b} stron wieczorem. Ile stron przeczytał tego dnia?"
            ],
            Operation.SUBTRACT: [
                "Michał miał {a} złotych. Wydał {b} złotych. Ile mu zostało?",
                "W autobusie jechało {a} osób. Na przystanku wysiadło {b} osób. Ile osób zostało?",
                "Mama kupiła {a} cukierków. Dzieci zjadły {b}. Ile cukierków zostało?"
            ],
            Operation.MULTIPLY: [
                "W każdym pudełku jest {b} czekoladek. Ile czekoladek jest w {a} pudełkach?",
                "Rower kosztuje {a} złotych. Ile kosztuje {b} takich rowerów?",
                "Każdy uczeń ma {b} zeszytów. Ilu zeszytów mają razem {a} uczniowie?"
            ],
            Operation.DIVIDE: [
                "Mama ma {a} cukierków. Chce je równo podzielić między {b} dzieci. Ile dostanie każde?",
                "{a} jabłek trzeba włożyć do pudełek po {b} sztuk. Ile będzie pudełek?",
                "Za {a} złotych kupiono {b} identycznych długopisów. Ile kosztował jeden?"
            ]
        }
    
    def generate(self, operation: Operation, a: int, b: int) -> str:
        templates = self.templates[operation]
        template = random.choice(templates)
        return template.format(a=a, b=b)

class MathTrainer:
    def __init__(self):
        self.generator = ProblemGenerator()
        self.word_generator = WordProblemGenerator()
        self.score = 0
        self.total = 0
    
    def run_session(self, count: int = 10, word_problems: bool = False):
        print("\n=== TRENING MATEMATYCZNY ===")
        print(f"Rozwiąż {count} zadań. Wpisz 'q' aby zakończyć.\n")
        
        for i in range(count):
            problem = self.generator.generate_random()
            self.total += 1
            
            if word_problems and random.random() < 0.5:
                print(f"\nZadanie {i+1}:")
                print(self.word_generator.generate(problem.operation, problem.a, problem.b))
                print(f"Działanie: {problem}")
            else:
                print(f"\nZadanie {i+1}: {problem}")
            
            while True:
                answer = input("Twoja odpowiedź: ").strip()
                
                if answer.lower() == 'q':
                    self.print_summary()
                    return
                
                try:
                    user_answer = float(answer)
                    correct_answer = problem.solve()
                    
                    if abs(user_answer - correct_answer) < 0.01:
                        print("✓ Dobrze!")
                        self.score += 1
                        break
                    else:
                        print(f"✗ Źle. Poprawna odpowiedź: {correct_answer:.0f}")
                        break
                except ValueError:
                    print("Wpisz liczbę lub 'q' aby zakończyć.")
        
        self.print_summary()
    
    def print_summary(self):
        if self.total > 0:
            percentage = (self.score / self.total) * 100
            print(f"\n=== PODSUMOWANIE ===")
            print(f"Poprawne odpowiedzi: {self.score}/{self.total} ({percentage:.1f}%)")
            
            if percentage == 100:
                print("Doskonale! Wszystko poprawnie!")
            elif percentage >= 80:
                print("Bardzo dobrze!")
            elif percentage >= 60:
                print("Dobrze, ale warto poćwiczyć więcej.")
            else:
                print("Trzeba więcej treningu. Nie poddawaj się!")

def main():
    trainer = MathTrainer()
    
    while True:
        print("\n=== MATEMATYKA DLA 6 KLASY ===")
        print("1. Ćwicz działania (10 zadań)")
        print("2. Ćwicz działania (20 zadań)")
        print("3. Zadania z treścią")
        print("4. Wyjście")
        
        choice = input("\nWybierz opcję (1-4): ").strip()
        
        if choice == '1':
            trainer.run_session(10)
        elif choice == '2':
            trainer.run_session(20)
        elif choice == '3':
            trainer.run_session(10, word_problems=True)
        elif choice == '4':
            print("Do zobaczenia!")
            sys.exit(0)
        else:
            print("Nieprawidłowy wybór. Spróbuj ponownie.")

if __name__ == "__main__":
    main()