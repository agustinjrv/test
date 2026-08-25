import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { WorkoutSession } from '../core/workout-session';
import { Train } from './train';

describe('Train', () => {
  let fixture: ComponentFixture<Train>;

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Train],
      providers: [
        provideRouter([
          { path: 'train', component: Train },
          { path: 'train/:dayId', component: Train },
          { path: 'train/:dayId/:exerciseId', component: Train },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Train);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows routine picker by default', () => {
    expect(fixture.nativeElement.textContent).toContain('Elegí tu rutina');
    expect(fixture.nativeElement.textContent).toContain('Espalda y bíceps');
  });

  it('starts session and shows timer on day route', async () => {
    const harness = await RouterTestingHarness.create();
    const activated = await harness.navigateByUrl('/train/dia-3', Train);

    expect(activated).toBeTruthy();

    const session = TestBed.inject(WorkoutSession);
    expect(session.session()?.dayId).toBe('dia-3');
    expect(harness.routeNativeElement?.textContent).toContain('Jalón al pecho');
    expect(harness.routeNativeElement?.querySelector('.train__timer-clock')).toBeTruthy();
  });
});
