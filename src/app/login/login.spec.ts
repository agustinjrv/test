import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Auth, DEMO_ACCOUNT } from '../core/auth';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let auth: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    auth = {
      login: vi.fn().mockReturnValue(of({ name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email })),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: Auth, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows validation errors when submitted empty', () => {
    component.submit();
    fixture.detectChanges();

    expect(auth.login).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('El correo es obligatorio.');
    expect(fixture.nativeElement.textContent).toContain('La contraseña es obligatoria.');
  });

  it('fills the demo account', () => {
    component.fillDemoAccount();
    expect(component.form.getRawValue()).toEqual({
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
    });
  });

  it('navigates home after a successful login', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.fillDemoAccount();
    component.submit();

    expect(auth.login).toHaveBeenCalledWith(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
    expect(navigate).toHaveBeenCalledWith('/home');
  });

  it('shows an error when credentials are rejected', () => {
    auth.login.mockReturnValue(throwError(() => new Error('INVALID_CREDENTIALS')));
    component.fillDemoAccount();
    component.submit();
    fixture.detectChanges();

    expect(component.authError()).toContain('Correo o contraseña incorrectos');
    expect(fixture.nativeElement.textContent).toContain('Correo o contraseña incorrectos');
  });
});
