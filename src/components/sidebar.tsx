'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/lib/navigation-store';

interface Section {
  id: string;
  chapter_id: string;
  title: string;
  description: string;
  completed?: boolean;
  progress?: number;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  sections: Section[];
  totalProgress?: number;
}


export function Sidebar() {
  const pathname = usePathname();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [textbookInfo, setTextbookInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { shouldRefresh, setRefreshed } = useNavigationStore();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch textbook info and navigation in parallel
        const [textbookRes, navigationRes] = await Promise.all([
          fetch('/api/current-textbook'),
          fetch(`/api/navigation?userId=${localStorage.getItem('userId') || 'default-user'}`)
        ]);

        if (!textbookRes.ok || !navigationRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [textbook, navigation] = await Promise.all([
          textbookRes.json(),
          navigationRes.json()
        ]);
        
        setTextbookInfo(textbook);
        setChapters(navigation.chapters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Refresh navigation when progress changes
  useEffect(() => {
    if (shouldRefresh) {
      const fetchNavigation = async () => {
        try {
          const userId = localStorage.getItem('userId') || 'default-user';
          const response = await fetch(`/api/navigation?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            setChapters(data.chapters);
          }
        } catch (err) {
          console.error('Failed to refresh navigation:', err);
        } finally {
          setRefreshed();
        }
      };
      
      fetchNavigation();
    }
  }, [shouldRefresh, setRefreshed]);

  if (loading) {
    return (
      <div className="w-80 h-screen bg-background border-r border-border overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">📐 Matematyka</h2>
            <p className="text-sm text-muted-foreground">Ładowanie...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 h-screen bg-background border-r border-border overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">📐 Matematyka</h2>
            <p className="text-sm text-destructive">Błąd: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-screen bg-background border-r border-border overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {textbookInfo?.subject_icon} {textbookInfo?.subject_name || 'Matematyka'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Klasa {textbookInfo?.grade_level || '6'} - {textbookInfo?.title || 'Ćwiczenia'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {chapters.map((chapter) => (
            <AccordionItem key={chapter.id} value={chapter.id} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-left font-medium">{chapter.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={chapter.totalProgress || 0} className="w-12 h-2" />
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
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          {(section.progress || 0) > 0 && !section.completed && (
                            <Progress value={section.progress || 0} className="w-8 h-1.5" />
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