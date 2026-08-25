import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { Train } from './train';

describe('Train', () => {
  let fixture: ComponentFixture<Train>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Train],
      providers: [
        provideRouter([
          { path: 'train', component: Train },
          { path: 'train/:dayId', component: Train },
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

  it('shows day picker by default', () => {
    expect(fixture.nativeElement.textContent).toContain('¿Qué día toca?');
    expect(fixture.nativeElement.textContent).toContain('Pecho, hombros y tríceps');
  });
});
