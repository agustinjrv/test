export interface WorkoutSet {
  weightKg: number;
  reps: number;
}

export interface Exercise {
  id: string;
  name: string;
  note?: string;
  lastReference: WorkoutSet[];
}

export interface WorkoutDay {
  id: string;
  label: string;
  weekday: string;
  exercises: Exercise[];
}

export const WORKOUT_DAYS: WorkoutDay[] = [
  {
    id: 'dia-1',
    label: 'Pecho, hombros y tríceps',
    weekday: 'Lunes',
    exercises: [
      {
        id: 'press-inclinado',
        name: 'Press inclinado',
        lastReference: [
          { weightKg: 10, reps: 10 },
          { weightKg: 10, reps: 8 },
          { weightKg: 7.5, reps: 9 },
        ],
      },
      {
        id: 'peck-deck',
        name: 'Peck-Deck',
        lastReference: [
          { weightKg: 35, reps: 10 },
          { weightKg: 35, reps: 8 },
          { weightKg: 30, reps: 7 },
        ],
      },
      {
        id: 'press-militar',
        name: 'Press militar en máquina',
        lastReference: [
          { weightKg: 7.5, reps: 9 },
          { weightKg: 7.5, reps: 7 },
          { weightKg: 5, reps: 10 },
        ],
      },
    ],
  },
  {
    id: 'dia-2',
    label: 'Piernas',
    weekday: 'Miércoles',
    exercises: [
      {
        id: 'cuadriceps',
        name: 'Cuádriceps',
        note: 'Variante unilateral',
        lastReference: [
          { weightKg: 35, reps: 8 },
          { weightKg: 30, reps: 10 },
          { weightKg: 30, reps: 10 },
        ],
      },
      {
        id: 'femorales',
        name: 'Femorales',
        lastReference: [
          { weightKg: 40, reps: 12 },
          { weightKg: 40, reps: 10 },
          { weightKg: 40, reps: 8 },
        ],
      },
      {
        id: 'gemelos',
        name: 'Gemelos',
        lastReference: [
          { weightKg: 65, reps: 12 },
          { weightKg: 65, reps: 10 },
          { weightKg: 65, reps: 8 },
        ],
      },
    ],
  },
  {
    id: 'dia-3',
    label: 'Espalda y bíceps',
    weekday: 'Viernes',
    exercises: [
      {
        id: 'jalon-pecho',
        name: 'Jalón al pecho',
        note: 'Mantener 45 kg',
        lastReference: [
          { weightKg: 45, reps: 12 },
          { weightKg: 45, reps: 10 },
          { weightKg: 45, reps: 8 },
        ],
      },
      {
        id: 'remo-bajo',
        name: 'Remo bajo',
        lastReference: [
          { weightKg: 35, reps: 8 },
          { weightKg: 30, reps: 10 },
          { weightKg: 30, reps: 8 },
        ],
      },
      {
        id: 'biceps-martillo',
        name: 'Bíceps martillo',
        note: 'Probar subir peso',
        lastReference: [
          { weightKg: 10, reps: 12 },
          { weightKg: 10, reps: 12 },
          { weightKg: 10, reps: 12 },
        ],
      },
    ],
  },
];

export function formatSets(sets: WorkoutSet[]): string {
  const groups: { weightKg: number; reps: number[] }[] = [];

  for (const set of sets) {
    const last = groups.at(-1);
    if (last && last.weightKg === set.weightKg) {
      last.reps.push(set.reps);
      continue;
    }
    groups.push({ weightKg: set.weightKg, reps: [set.reps] });
  }

  return groups
    .map((group) => `${group.weightKg} kg × ${group.reps.join('/')}`)
    .join(' + ');
}

export function findWorkoutDay(dayId: string): WorkoutDay | undefined {
  return WORKOUT_DAYS.find((day) => day.id === dayId);
}
