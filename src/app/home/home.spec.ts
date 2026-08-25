import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Auth } from '../core/auth';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let auth: { user: () => { name: string; email: string } | null; logout: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    auth = {
      user: () => ({ name: 'Sofía Marín', email: 'demo@luma.app' }),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), { provide: Auth, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('greets the signed-in user', () => {
    expect(fixture.nativeElement.textContent).toContain('Hola, Sofía Marín');
  });

  it('shows the train menu option', () => {
    const trainLink = fixture.nativeElement.querySelector('a[href="/train"]');
    expect(trainLink?.textContent).toContain('Entrenar');
  });

  it('logs out and returns to login', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.nativeElement.querySelector('.home__bar button')?.click();

    expect(auth.logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
