import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Clock, Target } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel główny</h1>
        <p className="text-muted-foreground">
          Witaj w aplikacji do nauki matematyki dla klasy 6. Rozpocznij naukę od pierwszego rozdziału!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukończone sekcje</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              z 25 sekcji
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postęp ogólny</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <Progress value={0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktywne rozdziały</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              dostępnych rozdziałów
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Czas nauki</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 min</div>
            <p className="text-xs text-muted-foreground">
              w tym tygodniu
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Polecane do rozpoczęcia</CardTitle>
            <CardDescription>
              Najlepsze sekcje na początek nauki
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">1.1 Liczby na osi liczbowej</p>
                <p className="text-sm text-muted-foreground">Podstawy umieszczania liczb na osi</p>
              </div>
              <Badge variant="outline">Rozpocznij</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">1.2 Porównywanie liczb</p>
                <p className="text-sm text-muted-foreground">Która liczba jest większa?</p>
              </div>
              <Badge variant="outline">Następny</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Najczęstsze błędy</CardTitle>
            <CardDescription>
              Na co należy uważać podczas nauki
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-sm font-medium">(-3) - (-5) = -8</p>
              <p className="text-xs text-muted-foreground">Prawidłowa odpowiedź: 2</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-sm font-medium">|−5| = −5</p>
              <p className="text-xs text-muted-foreground">Prawidłowa odpowiedź: 5</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-sm font-medium">-2 × -3 = -6</p>
              <p className="text-xs text-muted-foreground">Prawidłowa odpowiedź: 6</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}