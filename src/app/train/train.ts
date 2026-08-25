import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WorkoutSession } from '../core/workout-session';
import {
  findExercise,
  findWorkoutDay,
  formatSets,
  WORKOUT_DAYS,
  type WorkoutDay,
  type WorkoutSet,
} from '../data/routine';

interface DraftSet {
  weightKg: string;
  reps: string;
}

@Component({
  selector: 'app-train',
  imports: [RouterLink],
  templateUrl: './train.html',
  styleUrl: './train.scss',
})
export class Train {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly session = inject(WorkoutSession);

  readonly days = WORKOUT_DAYS;
  readonly formatSets = formatSets;

  draftSets: DraftSet[] = [];

  private readonly dayIdSignal = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('dayId'))),
    { initialValue: null },
  );

  private readonly exerciseId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('exerciseId'))),
    { initialValue: null },
  );

  readonly dayId = this.dayIdSignal;

  readonly selectedDay = computed<WorkoutDay | null>(() => {
    const dayId = this.dayIdSignal();
    return dayId ? (findWorkoutDay(dayId) ?? null) : null;
  });

  readonly selectedExercise = computed(() => {
    const dayId = this.dayIdSignal();
    const exerciseId = this.exerciseId();
    if (!dayId || !exerciseId) {
      return null;
    }

    return findExercise(dayId, exerciseId) ?? null;
  });

  constructor() {
    effect(() => {
      const dayId = this.dayIdSignal();
      if (dayId) {
        this.session.startSession(dayId);
      }
    });

    effect(() => {
      const exercise = this.selectedExercise();
      if (!exercise) {
        this.draftSets = [];
        return;
      }

      const saved = this.session.getExerciseSets(exercise.id);
      this.draftSets = saved.length
        ? saved.map((set) => ({
            weightKg: String(set.weightKg),
            reps: String(set.reps),
          }))
        : [];
    });
  }

  isExerciseDone(exerciseId: string): boolean {
    return this.session.isExerciseDone(exerciseId);
  }

  addSet(weightKg: string | number = '', reps: string | number = ''): void {
    this.draftSets = [
      ...this.draftSets,
      { weightKg: String(weightKg), reps: String(reps) },
    ];
  }

  applySuggestion(set: WorkoutSet): void {
    this.addSet(set.weightKg, set.reps);
  }

  updateSet(index: number, field: keyof DraftSet, value: string): void {
    this.draftSets = this.draftSets.map((set, i) =>
      i === index ? { ...set, [field]: value } : set,
    );
  }

  removeSet(index: number): void {
    this.draftSets = this.draftSets.filter((_, i) => i !== index);
  }

  saveExerciseAndBack(): void {
    const exercise = this.selectedExercise();
    const dayId = this.dayIdSignal();
    if (!exercise || !dayId) {
      return;
    }

    const sets = this.draftSets
      .map((set) => ({
        weightKg: Number.parseFloat(set.weightKg.replace(',', '.')),
        reps: Number.parseInt(set.reps, 10),
      }))
      .filter((set) => Number.isFinite(set.weightKg) && Number.isFinite(set.reps) && set.reps > 0);

    this.session.saveExercise(exercise.id, sets);
    void this.router.navigate(['/train', dayId]);
  }
}
