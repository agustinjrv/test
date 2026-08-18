import { computed, Injectable, signal } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface SessionUser {
  name: string;
  email: string;
}

interface DemoAccount extends SessionUser {
  password: string;
}

export const AUTH_STORAGE_KEY = 'luma.auth.session';

export const DEMO_ACCOUNT = {
  email: 'demo@luma.app',
  password: 'Luma1234',
  name: 'Sofía Marín',
} as const;

const DEMO_ACCOUNTS: readonly DemoAccount[] = [DEMO_ACCOUNT];

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly session = signal<SessionUser | null>(this.readSession());

  readonly user = this.session.asReadonly();
  readonly isAuthenticated = computed(() => this.session() !== null);

  login(email: string, password: string): Observable<SessionUser> {
    return timer(350).pipe(
      switchMap(() => {
        const account = DEMO_ACCOUNTS.find(
          (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
        );

        if (!account) {
          return throwError(() => new Error('INVALID_CREDENTIALS'));
        }

        const user: SessionUser = { name: account.name, email: account.email };
        this.persist(user);
        this.session.set(user);
        return of(user);
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    this.session.set(null);
  }

  private persist(user: SessionUser): void {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  private readSession(): SessionUser | null {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<SessionUser>;
      if (typeof parsed.name === 'string' && typeof parsed.email === 'string') {
        return { name: parsed.name, email: parsed.email };
      }
    } catch {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }

    return null;
  }
}
