import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Auth, DEMO_ACCOUNT } from './auth';
import { authGuard, guestGuard } from './auth-guard';

const route = {} as ActivatedRouteSnapshot;
const state = { url: '/' } as RouterStateSnapshot;

describe('auth guards', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it('sends guests to login', () => {
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });

  it('allows authenticated users into home', async () => {
    const auth = TestBed.inject(Auth);
    const login = firstValueFrom(auth.login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password));
    await vi.runAllTimersAsync();
    await login;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });

  it('keeps guests on the login page', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard(route, state));
    expect(result).toBe(true);
  });

  it('redirects authenticated users away from login', async () => {
    const auth = TestBed.inject(Auth);
    const login = firstValueFrom(auth.login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password));
    await vi.runAllTimersAsync();
    await login;

    const result = TestBed.runInInjectionContext(() => guestGuard(route, state));
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/home');
  });
});
