import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Auth, AUTH_STORAGE_KEY, DEMO_ACCOUNT } from './auth';

describe('Auth', () => {
  let service: Auth;

  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth);
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it('starts signed out when there is no session', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('signs in with the demo account', async () => {
    const login = firstValueFrom(service.login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password));
    await vi.runAllTimersAsync();
    const user = await login;

    expect(user).toEqual({ name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email });
    expect(service.isAuthenticated()).toBe(true);
    expect(JSON.parse(sessionStorage.getItem(AUTH_STORAGE_KEY) ?? '{}')).toEqual(user);
  });

  it('rejects invalid credentials', async () => {
    const login = firstValueFrom(service.login('otro@luma.app', 'no-vale'));
    const expectation = expect(login).rejects.toThrow('INVALID_CREDENTIALS');
    await vi.runAllTimersAsync();
    await expectation;
    expect(service.isAuthenticated()).toBe(false);
  });

  it('clears the session on logout', async () => {
    const login = firstValueFrom(service.login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password));
    await vi.runAllTimersAsync();
    await login;

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});
