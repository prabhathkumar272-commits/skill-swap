import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar" *ngIf="authService.isLoggedIn()">
      <div class="nav-brand">
        <span class="brand-icon">🎓</span>
        <span class="brand-text">SkillSwap</span>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/matches" routerLinkActive="active">Matches</a>
        <a routerLink="/requests" routerLinkActive="active">Requests</a>
        <a routerLink="/sessions" routerLinkActive="active">Sessions</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
      </div>
      <div class="nav-actions">
        <span class="user-greeting">Hi, {{ (authService.currentUser()?.name || '').split(' ')[0] }} 👋</span>
        <button class="btn-logout" (click)="logout()">Sign Out</button>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(12px);
      box-shadow: 0 2px 16px rgba(95,127,115,0.10);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1.5px solid #e0ede8;
    }
    .nav-brand { display: flex; align-items: center; gap: 0.5rem; }
    .brand-icon { font-size: 1.5rem; }
    .brand-text { font-size: 1.2rem; font-weight: 700; color: #5F7F73; letter-spacing: -0.5px; }
    .nav-links { display: flex; gap: 0.5rem; }
    .nav-links a {
      text-decoration: none;
      padding: 0.45rem 1rem;
      border-radius: 20px;
      color: #555;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      background: #5F7F73;
      color: white;
    }
    .nav-actions { display: flex; align-items: center; gap: 1rem; }
    .user-greeting { font-size: 0.88rem; color: #666; }
    .btn-logout {
      padding: 0.45rem 1.2rem;
      border-radius: 20px;
      border: 1.5px solid #5F7F73;
      background: transparent;
      color: #5F7F73;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn-logout:hover { background: #5F7F73; color: white; }
    main { min-height: calc(100vh - 72px); }
    @media (max-width: 900px) {
      .navbar { flex-wrap: wrap; gap: 0.75rem 1rem; padding: 0.85rem 1.25rem; }
      .nav-links { order: 3; width: 100%; overflow-x: auto; padding-bottom: 0.2rem; }
      .nav-links a { white-space: nowrap; }
      .nav-actions { margin-left: auto; }
    }
    @media (max-width: 480px) {
      .user-greeting { display: none; }
      .btn-logout { padding: 0.4rem 0.8rem; }
      .nav-links { gap: 0.15rem; }
      .nav-links a { padding: 0.45rem 0.75rem; }
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
