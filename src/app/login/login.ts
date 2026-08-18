import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, DEMO_ACCOUNT } from '../core/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  readonly demoAccount = DEMO_ACCOUNT;
  readonly submitting = signal(false);
  readonly authError = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  fillDemoAccount(): void {
    this.form.setValue({
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
    });
    this.authError.set(null);
  }

  submit(): void {
    this.authError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.submitting.set(true);

    this.auth.login(email, password).subscribe({
      next: () => {
        void this.router.navigateByUrl('/home');
      },
      error: () => {
        this.submitting.set(false);
        this.authError.set('Correo o contraseña incorrectos. Prueba con la cuenta de demo.');
      },
      complete: () => {
        this.submitting.set(false);
      },
    });
  }
}
