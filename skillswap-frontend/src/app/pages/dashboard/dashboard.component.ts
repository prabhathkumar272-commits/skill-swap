import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page fade-in">
      <div class="page-header">
        <h1>Welcome back, {{ user?.name?.split(' ')[0] }}! 👋</h1>
        <p>Here's your skill exchange overview</p>
      </div>

      <!-- Stats Row -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🔄</div>
          <div class="stat-info">
            <div class="stat-value">{{ matches().length }}</div>
            <div class="stat-label">Potential Matches</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📨</div>
          <div class="stat-info">
            <div class="stat-value">{{ pendingRequests().length }}</div>
            <div class="stat-label">Pending Requests</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <div class="stat-value">{{ sessions().length }}</div>
            <div class="stat-label">Sessions Booked</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-info">
            <div class="stat-value">{{ user?.skillsOffered?.length || 0 }}</div>
            <div class="stat-label">Skills Offered</div>
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-top:2rem">
        <!-- Profile Summary -->
        <div class="card">
          <div class="card-header">
            <h3>My Profile</h3>
            <a routerLink="/profile" class="btn btn-ghost btn-sm">Edit →</a>
          </div>
          <div class="profile-summary">
            <div class="profile-avatar">{{ getInitials(user?.name) }}</div>
            <div class="profile-info">
              <h4>{{ user?.name }}</h4>
              <p>{{ user?.email }}</p>
              <p class="bio" *ngIf="user?.bio">{{ user?.bio }}</p>
            </div>
          </div>
          <div class="skills-section">
            <div class="skills-row">
              <span class="skills-label">✅ I can teach:</span>
              <div class="tags-row">
                <span class="skill-tag skill-offered" *ngFor="let s of user?.skillsOffered">{{ s }}</span>
                <span class="empty-tag" *ngIf="!user?.skillsOffered?.length">None added yet</span>
              </div>
            </div>
            <div class="skills-row" style="margin-top:0.8rem">
              <span class="skills-label">🎯 I want to learn:</span>
              <div class="tags-row">
                <span class="skill-tag skill-wanted" *ngFor="let s of user?.skillsWanted">{{ s }}</span>
                <span class="empty-tag" *ngIf="!user?.skillsWanted?.length">None added yet</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 style="margin-bottom:1.5rem">Quick Actions</h3>
          <div class="actions-list">
            <a routerLink="/matches" class="action-item">
              <span class="action-icon">🔍</span>
              <div>
                <div class="action-title">Find Matches</div>
                <div class="action-sub">Discover {{ matches().length }} compatible students</div>
              </div>
              <span class="action-arrow">→</span>
            </a>
            <a routerLink="/requests" class="action-item">
              <span class="action-icon">📨</span>
              <div>
                <div class="action-title">View Requests</div>
                <div class="action-sub">{{ pendingRequests().length }} pending request(s)</div>
              </div>
              <span class="action-arrow">→</span>
            </a>
            <a routerLink="/sessions" class="action-item">
              <span class="action-icon">📅</span>
              <div>
                <div class="action-title">My Sessions</div>
                <div class="action-sub">{{ sessions().length }} session(s) scheduled</div>
              </div>
              <span class="action-arrow">→</span>
            </a>
            <a routerLink="/profile" class="action-item">
              <span class="action-icon">✏️</span>
              <div>
                <div class="action-title">Update Profile</div>
                <div class="action-sub">Add more skills to get better matches</div>
              </div>
              <span class="action-arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Recent Matches -->
      <div class="card" style="margin-top:2rem" *ngIf="matches().length > 0">
        <div class="card-header">
          <h3>Recent Matches</h3>
          <a routerLink="/matches" class="btn btn-ghost btn-sm">View All →</a>
        </div>
        <div class="matches-preview">
          <div class="match-preview-card" *ngFor="let m of matches().slice(0,3)">
            <div class="mp-avatar">{{ getInitials(m.user.name) }}</div>
            <div class="mp-info">
              <div class="mp-name">{{ m.user.name }}</div>
              <div class="mp-skills">
                <span class="skill-tag skill-offered" *ngFor="let s of m.canTeach.slice(0,2)">{{ s }}</span>
              </div>
            </div>
            <div class="mp-score">⭐ {{ m.matchScore }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .stat-card {
      background: white; border-radius: var(--radius); padding: 1.5rem;
      box-shadow: var(--shadow); border: 1px solid var(--border);
      display: flex; align-items: center; gap: 1rem;
      transition: var(--transition);
    }
    .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); }
    .stat-icon { font-size: 2rem; }
    .stat-value { font-size: 1.8rem; font-weight: 800; color: var(--primary-dark); }
    .stat-label { font-size: 0.8rem; color: var(--text-light); font-weight: 500; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .card-header h3 { font-size: 1rem; font-weight: 700; }
    .profile-summary { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .profile-avatar {
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #5F7F73, #A8BDB2);
      color: white; font-weight: 800; font-size: 1.1rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .profile-info h4 { font-size: 1rem; font-weight: 700; }
    .profile-info p { font-size: 0.82rem; color: var(--text-light); margin-top: 0.1rem; }
    .bio { margin-top: 0.3rem !important; }
    .skills-label { font-size: 0.82rem; font-weight: 600; color: var(--text-light); display: block; margin-bottom: 0.4rem; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .empty-tag { font-size: 0.78rem; color: var(--text-muted); font-style: italic; }
    .actions-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .action-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem; border-radius: var(--radius-sm);
      text-decoration: none; color: var(--text);
      border: 1px solid var(--border); background: #fafaf9;
      transition: var(--transition);
    }
    .action-item:hover { background: #f0f7f4; border-color: var(--primary); }
    .action-icon { font-size: 1.4rem; }
    .action-title { font-size: 0.9rem; font-weight: 600; }
    .action-sub { font-size: 0.78rem; color: var(--text-light); margin-top: 0.1rem; }
    .action-arrow { margin-left: auto; color: var(--primary-dark); font-weight: 700; }
    .matches-preview { display: flex; flex-direction: column; gap: 0.75rem; }
    .match-preview-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 0.9rem 1rem; border-radius: var(--radius-sm);
      border: 1px solid var(--border); background: #fafaf9;
    }
    .mp-avatar {
      width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(135deg, #A8BDB2, #D9C27A);
      color: white; font-weight: 700; font-size: 0.85rem;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .mp-info { flex: 1; }
    .mp-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.3rem; }
    .mp-skills { display: flex; gap: 0.3rem; flex-wrap: wrap; }
    .mp-score { font-size: 0.88rem; font-weight: 700; color: var(--primary-dark); }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  user: any;
  matches = signal<any[]>([]);
  pendingRequests = signal<any[]>([]);
  sessions = signal<any[]>([]);

  constructor(private api: ApiService, private auth: AuthService) {
    this.user = auth.currentUser();
  }

  ngOnInit() {
    this.api.getMatches().subscribe({ next: data => this.matches.set(data), error: () => {} });
    this.api.getRequests().subscribe({ next: data => this.pendingRequests.set(data.filter((r: any) => r.status === 'pending')), error: () => {} });
    this.api.getSessions().subscribe({ next: data => this.sessions.set(data), error: () => {} });
  }

  getInitials(name?: string) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
