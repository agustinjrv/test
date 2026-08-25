import { Injectable, computed, signal } from '@angular/core';
import type { WorkoutSet } from '../data/routine';

export interface WorkoutSessionState {
  dayId: string;
  date: string;
  startedAt: number;
  exercises: Record<string, WorkoutSet[]>;
}

const STORAGE_KEY = 'luma.workout-session';

@Injectable({ providedIn: 'root' })
export class WorkoutSession {
  private readonly state = signal<WorkoutSessionState | null>(this.loadStored());
  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly session = this.state.asReadonly();
  readonly elapsedSeconds = signal(0);

  readonly active = computed(() => this.state() !== null);

  readonly formattedDate = computed(() => {
    const date = this.state()?.date;
    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(`${date}T12:00:00`));
  });

  readonly formattedElapsed = computed(() => formatElapsed(this.elapsedSeconds()));

  constructor() {
    if (this.state()) {
      this.syncElapsed();
      this.startTimer();
    }
  }

  startSession(dayId: string): void {
    const today = todayIsoDate();
    const current = this.state();

    if (current?.dayId === dayId && current.date === today) {
      this.syncElapsed();
      this.startTimer();
      return;
    }

    const next: WorkoutSessionState = {
      dayId,
      date: today,
      startedAt: Date.now(),
      exercises: {},
    };

    this.state.set(next);
    this.persist(next);
    this.syncElapsed();
    this.startTimer();
  }

  isExerciseDone(exerciseId: string): boolean {
    const sets = this.state()?.exercises[exerciseId];
    return !!sets && sets.length > 0;
  }

  getExerciseSets(exerciseId: string): WorkoutSet[] {
    return this.state()?.exercises[exerciseId] ?? [];
  }

  saveExercise(exerciseId: string, sets: WorkoutSet[]): void {
    const current = this.state();
    if (!current) {
      return;
    }

    const next: WorkoutSessionState = {
      ...current,
      exercises: {
        ...current.exercises,
        [exerciseId]: sets,
      },
    };

    this.state.set(next);
    this.persist(next);
  }

  private loadStored(): WorkoutSessionState | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as WorkoutSessionState;
      if (parsed.date !== todayIsoDate()) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  private persist(state: WorkoutSessionState): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private syncElapsed(): void {
    const current = this.state();
    if (!current) {
      this.elapsedSeconds.set(0);
      return;
    }

    this.elapsedSeconds.set(Math.floor((Date.now() - current.startedAt) / 1000));
  }

  private startTimer(): void {
    if (this.timerId !== null) {
      return;
    }

    this.timerId = setInterval(() => {
      const current = this.state();
      if (!current) {
        this.stopTimer();
        return;
      }

      this.elapsedSeconds.set(Math.floor((Date.now() - current.startedAt) / 1000));
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId === null) {
      return;
    }

    clearInterval(this.timerId);
    this.timerId = null;
  }
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatElapsed(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
