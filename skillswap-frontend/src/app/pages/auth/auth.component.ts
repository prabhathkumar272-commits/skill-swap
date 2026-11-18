import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <a routerLink="/" class="back-home">← Home</a>
        <div class="auth-brand">
          <span class="brand-icon">🎓</span>
          <span>SkillSwap Campus</span>
        </div>
        <div class="auth-tagline">
          <h2>Learn. Teach. Grow.</h2>
          <p>Exchange skills with students around you — no money, just knowledge.</p>
        </div>
        <div class="auth-features">
          <div class="feature-item" *ngFor="let f of features">
            <span class="fi">{{ f.icon }}</span>
            <span>{{ f.text }}</span>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <!-- Tabs -->
          <div class="auth-tabs">
            <button [class.active]="tab() === 'login'" (click)="tab.set('login')">Sign In</button>
            <button [class.active]="tab() === 'register'" (click)="tab.set('register')">Sign Up</button>
          </div>

          <!-- Login Form -->
          <form *ngIf="tab() === 'login'" (ngSubmit)="login()" class="auth-form fade-in">
            <div class="form-group">
              <label>Email Address</label>
              <input class="form-control" type="email" [(ngModel)]="loginData.email" name="email" placeholder="you@college.edu" required />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input class="form-control" type="password" [(ngModel)]="loginData.password" name="password" placeholder="••••••••" required />
            </div>
            <div class="error-msg" *ngIf="error()">{{ error() }}</div>
            <button class="btn btn-primary btn-block" type="submit" [disabled]="loading()">
              {{ loading() ? 'Signing In...' : 'Sign In →' }}
            </button>
            <p class="switch-link">Don't have an account? <a (click)="tab.set('register')" class="link">Sign Up</a></p>
          </form>

          <!-- Register Form -->
          <form *ngIf="tab() === 'register'" (ngSubmit)="register()" class="auth-form fade-in">
            <div class="form-group">
              <label>Full Name</label>
              <input class="form-control" type="text" [(ngModel)]="regData.name" name="name" placeholder="Your Name" required />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input class="form-control" type="email" [(ngModel)]="regData.email" name="email" placeholder="you@college.edu" required />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input class="form-control" type="password" [(ngModel)]="regData.password" name="password" placeholder="Min. 6 characters" required />
            </div>
            <div class="form-group">
              <label>Skills You Can Teach <span class="hint">(comma-separated)</span></label>
              <input class="form-control" type="text" [(ngModel)]="skillsOfferedInput" name="skillsOffered" placeholder="e.g. Python, Guitar, Photoshop" />
            </div>
            <div class="form-group">
              <label>Skills You Want to Learn <span class="hint">(comma-separated)</span></label>
              <input class="form-control" type="text" [(ngModel)]="skillsWantedInput" name="skillsWanted" placeholder="e.g. React, English, Video Editing" />
            </div>
            <div class="error-msg" *ngIf="error()">{{ error() }}</div>
            <button class="btn btn-primary btn-block" type="submit" [disabled]="loading()">
              {{ loading() ? 'Creating Account...' : 'Create Account →' }}
            </button>
            <p class="switch-link">Already have an account? <a (click)="tab.set('login')" class="link">Sign In</a></p>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
    }
    .auth-left {
      flex: 1;
      background: linear-gradient(150deg, #5F7F73 0%, #A8BDB2 100%);
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      min-height: 100vh;
    }
    .back-home { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: var(--transition); }
    .back-home:hover { color: white; }
    .auth-brand { display: flex; align-items: center; gap: 0.75rem; font-size: 1.3rem; font-weight: 800; }
    .brand-icon { font-size: 2rem; }
    .auth-tagline h2 { font-size: 2.5rem; font-weight: 800; line-height: 1.2; margin-bottom: 1rem; }
    .auth-tagline p { font-size: 1rem; opacity: 0.85; line-height: 1.6; }
    .auth-features { display: flex; flex-direction: column; gap: 1rem; }
    .feature-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; opacity: 0.9; }
    .fi { font-size: 1.3rem; }
    .auth-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: var(--bg);
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      background: white;
      border-radius: var(--radius);
      box-shadow: var(--shadow-hover);
      padding: 2.5rem;
      border: 1px solid var(--border);
    }
    .auth-tabs {
      display: flex;
      background: var(--bg);
      border-radius: var(--radius-sm);
      padding: 4px;
      margin-bottom: 2rem;
    }
    .auth-tabs button {
      flex: 1;
      padding: 0.6rem;
      border: none;
      border-radius: 8px;
      background: transparent;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      color: var(--text-light);
      transition: var(--transition);
    }
    .auth-tabs button.active { background: white; color: var(--primary-dark); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .auth-form { display: flex; flex-direction: column; gap: 0; }
    .btn-block { width: 100%; justify-content: center; padding: 0.85rem; font-size: 1rem; margin-top: 0.5rem; }
    .switch-link { text-align: center; font-size: 0.85rem; color: var(--text-light); margin-top: 1.2rem; }
    .link { color: var(--primary-dark); font-weight: 600; cursor: pointer; text-decoration: underline; }
    .hint { font-weight: 400; font-size: 0.75rem; color: var(--text-muted); }
    .error-msg { color: #d45f5f; font-size: 0.85rem; padding: 0.6rem 1rem; background: #fdf0f0; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #d45f5f; }
    @media (max-width: 768px) {
      .auth-left { display: none; }
      .auth-right { padding: 1.5rem; }
    }
  `]
})
export class AuthComponent {
  tab = signal<'login' | 'register'>('login');
  loading = signal(false);
  error = signal('');

  loginData = { email: '', password: '' };
  regData = { name: '', email: '', password: '' };
  skillsOfferedInput = '';
  skillsWantedInput = '';

  features = [
    { icon: '🔄', text: 'Barter-based learning — no money needed' },
    { icon: '🤝', text: 'Smart matching engine for perfect pairs' },
    { icon: '📅', text: 'Easy session scheduling with classmates' },
    { icon: '🌱', text: 'Grow your skillset every semester' }
  ];

  constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn()) router.navigate(['/dashboard']);
  }

  login() {
    this.loading.set(true); this.error.set('');
    this.auth.login(this.loginData).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => { this.error.set(e.error?.message || 'Login failed'); this.loading.set(false); }
    });
  }

  register() {
    this.loading.set(true); this.error.set('');
    const skillsOffered = this.skillsOfferedInput.split(',').map(s => s.trim()).filter(Boolean);
    const skillsWanted = this.skillsWantedInput.split(',').map(s => s.trim()).filter(Boolean);
    this.auth.register({ ...this.regData, skillsOffered, skillsWanted }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => { this.error.set(e.error?.message || 'Registration failed'); this.loading.set(false); }
    });
  }
}
