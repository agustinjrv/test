import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { formatElapsed, todayIsoDate, WorkoutSession } from './workout-session';

describe('WorkoutSession', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  it('starts a session for today', () => {
    const session = TestBed.inject(WorkoutSession);

    session.startSession('dia-3');

    expect(session.session()?.dayId).toBe('dia-3');
    expect(session.session()?.date).toBe(todayIsoDate());
    expect(session.active()).toBe(true);
  });

  it('marks exercises as done after saving sets', () => {
    const session = TestBed.inject(WorkoutSession);

    session.startSession('dia-3');
    session.saveExercise('jalon-pecho', [
      { weightKg: 45, reps: 12 },
      { weightKg: 45, reps: 10 },
    ]);

    expect(session.isExerciseDone('jalon-pecho')).toBe(true);
    expect(session.getExerciseSets('jalon-pecho')).toHaveLength(2);
  });
});

describe('formatElapsed', () => {
  it('formats minutes and seconds', () => {
    expect(formatElapsed(75)).toBe('1:15');
  });

  it('formats hours when needed', () => {
    expect(formatElapsed(3661)).toBe('1:01:01');
  });
});
