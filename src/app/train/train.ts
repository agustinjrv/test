import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { findWorkoutDay, formatSets, WORKOUT_DAYS, type WorkoutDay } from '../data/routine';

@Component({
  selector: 'app-train',
  imports: [RouterLink],
  templateUrl: './train.html',
  styleUrl: './train.scss',
})
export class Train {
  private readonly route = inject(ActivatedRoute);

  readonly days = WORKOUT_DAYS;
  readonly formatSets = formatSets;

  private readonly dayId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('dayId'))),
    { initialValue: null },
  );

  readonly selectedDay = computed<WorkoutDay | null>(() => {
    const dayId = this.dayId();
    return dayId ? (findWorkoutDay(dayId) ?? null) : null;
  });
}
