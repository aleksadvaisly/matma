'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calculator, Target, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
  completed: boolean;
  progress: number;
}

interface Chapter {
  id: string;
  title: string;
  icon: React.ReactNode;
  sections: Section[];
  totalProgress: number;
}

const chapters: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Liczby dodatnie i ujemne',
    icon: <Target className="h-4 w-4" />,
    totalProgress: 0,
    sections: [
      {
        id: '1-1',
        title: 'Liczby na osi liczbowej',
        completed: false,
        progress: 0
      },
      {
        id: '1-2', 
        title: 'Porównywanie liczb',
        completed: false,
        progress: 0
      },
      {
        id: '1-3',
        title: 'Liczby przeciwne i odwrotne',
        completed: false,
        progress: 0
      },
      {
        id: '1-4',
        title: 'Wartość bezwzględna',
        completed: false,
        progress: 0
      },
      {
        id: '1-5',
        title: 'Zbiór liczb całkowitych',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: 'chapter-2',
    title: 'Dodawanie liczb całkowitych',
    icon: <Calculator className="h-4 w-4" />,
    totalProgress: 0,
    sections: [
      {
        id: '2-1',
        title: 'Zasady dodawania',
        completed: false,
        progress: 0
      },
      {
        id: '2-2',
        title: 'Techniki obliczeniowe',
        completed: false,
        progress: 0
      },
      {
        id: '2-3',
        title: 'Zadania z treścią',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: 'chapter-3',
    title: 'Mnożenie i dzielenie liczb całkowitych',
    icon: <Calculator className="h-4 w-4" />,
    totalProgress: 0,
    sections: [
      {
        id: '3-1',
        title: 'Zasady znaków',
        completed: false,
        progress: 0
      },
      {
        id: '3-2',
        title: 'Mnożenie',
        completed: false,
        progress: 0
      },
      {
        id: '3-3',
        title: 'Dzielenie',
        completed: false,
        progress: 0
      },
      {
        id: '3-4',
        title: 'Techniki algebraiczne',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: 'chapter-4',
    title: 'Odejmowanie liczb całkowitych',
    icon: <Calculator className="h-4 w-4" />,
    totalProgress: 0,
    sections: [
      {
        id: '4-1',
        title: 'Odejmowanie jako dodawanie liczby przeciwnej',
        completed: false,
        progress: 0
      },
      {
        id: '4-2',
        title: 'Interpretacje odejmowania',
        completed: false,
        progress: 0
      },
      {
        id: '4-3',
        title: 'Zadania praktyczne',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: 'chapter-5',
    title: 'Własności działań na liczbach całkowitych',
    icon: <BookOpen className="h-4 w-4" />,
    totalProgress: 0,
    sections: [
      {
        id: '5-1',
        title: 'Przemienność i łączność',
        completed: false,
        progress: 0
      },
      {
        id: '5-2',
        title: 'Rozdzielność mnożenia',
        completed: false,
        progress: 0
      },
      {
        id: '5-3',
        title: 'Kolejność wykonywania działań',
        completed: false,
        progress: 0
      },
      {
        id: '5-4',
        title: 'Techniki obliczeniowe',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: 'chapter-6',
    title: 'Powtórzenie przed klasówką',
    icon: <Users className="h-4 w-4" />,
    totalProgress: 0,
    sections: [
      {
        id: '6-1',
        title: 'Zadania z treścią - konteksty życiowe',
        completed: false,
        progress: 0
      },
      {
        id: '6-2',
        title: 'Zadania praktyczne',
        completed: false,
        progress: 0
      },
      {
        id: '6-3',
        title: 'Zadania z humorem',
        completed: false,
        progress: 0
      },
      {
        id: '6-4',
        title: 'Zadania tematyczne',
        completed: false,
        progress: 0
      },
      {
        id: '6-5',
        title: 'Zadania kompleksowe',
        completed: false,
        progress: 0
      }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-80 h-screen bg-background border-r border-border overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Matematyka</h2>
          <p className="text-sm text-muted-foreground">Klasa 6 - Liczby całkowite</p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {chapters.map((chapter) => (
            <AccordionItem key={chapter.id} value={chapter.id} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    {chapter.icon}
                    <span className="text-left font-medium">{chapter.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={chapter.totalProgress} className="w-12 h-2" />
                    <Badge variant="secondary" className="text-xs">
                      {chapter.sections.filter(s => s.completed).length}/{chapter.sections.length}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-1">
                  {chapter.sections.map((section) => (
                    <Link
                      key={section.id}
                      href={`/dashboard/chapters/${chapter.id}/sections/${section.id}`}
                      className={cn(
                        "block px-3 py-2 text-sm rounded-md transition-colors",
                        pathname === `/dashboard/chapters/${chapter.id}/sections/${section.id}`
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{section.title}</span>
                        <div className="flex items-center gap-2">
                          {section.completed && (
                            <Badge variant="default" className="text-xs">
                              ✓
                            </Badge>
                          )}
                          {section.progress > 0 && !section.completed && (
                            <Progress value={section.progress} className="w-8 h-1.5" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}