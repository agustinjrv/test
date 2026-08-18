import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../core/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly user = this.auth.user;

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
