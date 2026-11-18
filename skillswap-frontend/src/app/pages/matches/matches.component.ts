import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page fade-in">
      <div class="page-header">
        <h1>🔍 Skill Matches</h1>
        <p>Students with complementary skill profiles — you teach them, they teach you!</p>
      </div>

      <!-- Search Filter -->
      <div class="filter-bar">
        <input class="form-control search-input" [(ngModel)]="searchTerm" placeholder="🔍 Search by name or skill..." />
        <div class="filter-tags">
          <span class="filter-hint">{{ filteredMatches().length }} match(es) found</span>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-state" *ngIf="loading()">
        <div class="spinner"></div>
        <p>Finding your matches...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading() && filteredMatches().length === 0">
        <div class="empty-icon">🤷</div>
        <h3>No matches found yet</h3>
        <p>Update your profile with more skills to get better matches!</p>
      </div>

      <!-- Matches Grid -->
      <div class="grid-auto" *ngIf="!loading()">
        <div class="match-card card" *ngFor="let m of filteredMatches()">
          <div class="match-header">
            <div class="match-avatar">{{ getInitials(m.user.name) }}</div>
            <div class="match-meta">
              <h4>{{ m.user.name }}</h4>
              <p>{{ m.user.email }}</p>
              <div class="match-score-badge">⭐ Match Score: {{ m.matchScore }}</div>
            </div>
          </div>

          <div class="exchange-section">
            <div class="exchange-col">
              <div class="ex-label">They can teach you:</div>
              <div class="tags-row">
                <span class="skill-tag skill-offered" *ngFor="let s of m.canLearn">{{ s }}</span>
                <span class="no-skill" *ngIf="!m.canLearn.length">—</span>
              </div>
            </div>
            <div class="exchange-divider">⇄</div>
            <div class="exchange-col">
              <div class="ex-label">You can teach them:</div>
              <div class="tags-row">
                <span class="skill-tag skill-wanted" *ngFor="let s of m.canTeach">{{ s }}</span>
                <span class="no-skill" *ngIf="!m.canTeach.length">—</span>
              </div>
            </div>
          </div>

          <div class="availability-row" *ngIf="m.user.availability?.days?.length">
            <span class="avail-icon">📅</span>
            <span>Available: {{ m.user.availability.days.slice(0,3).join(', ') }}</span>
          </div>

          <div class="match-actions">
            <button
              class="btn btn-primary"
              (click)="openRequestModal(m)"
              [disabled]="!!sentRequests[m.user._id]"
            >
              {{ sentRequests[m.user._id] ? '✅ Request Sent' : '🤝 Send Swap Request' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Modal -->
    <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Send Swap Request</h3>
          <button class="modal-close" (click)="closeModal()">×</button>
        </div>
        <div class="modal-body" *ngIf="selectedMatch">
          <p style="color:var(--text-light);font-size:0.9rem;margin-bottom:1.2rem">
            to <strong>{{ selectedMatch.user.name }}</strong>
          </p>
          <div class="form-group">
            <label>Skill you'll offer</label>
            <select class="form-control" [(ngModel)]="reqData.skillOffered">
              <option value="">Select...</option>
              <option *ngFor="let s of mySkillsOffered">{{ s }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Skill you want to learn</label>
            <select class="form-control" [(ngModel)]="reqData.skillRequested">
              <option value="">Select...</option>
              <option *ngFor="let s of selectedMatch.canLearn">{{ s }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Message (optional)</label>
            <textarea class="form-control" [(ngModel)]="reqData.message" rows="3" placeholder="Hi! I'd love to swap skills with you..."></textarea>
          </div>
          <div class="error-msg" *ngIf="reqError()">{{ reqError() }}</div>
          <button class="btn btn-primary btn-block" (click)="sendRequest()" [disabled]="reqLoading()">
            {{ reqLoading() ? 'Sending...' : '🚀 Send Request' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .search-input { flex: 1; max-width: 400px; }
    .filter-hint { font-size: 0.85rem; color: var(--text-light); font-weight: 500; }
    .loading-state { text-align: center; padding: 4rem; color: var(--text-light); }
    .spinner {
      width: 40px; height: 40px; border: 3px solid var(--border);
      border-top-color: var(--primary-dark); border-radius: 50%;
      animation: spin 0.8s linear infinite; margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .match-card { display: flex; flex-direction: column; gap: 1rem; }
    .match-header { display: flex; gap: 1rem; align-items: flex-start; }
    .match-avatar {
      width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #5F7F73, #A8BDB2);
      color: white; font-weight: 800; font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
    }
    .match-meta h4 { font-size: 1rem; font-weight: 700; }
    .match-meta p { font-size: 0.8rem; color: var(--text-light); margin-top: 0.1rem; }
    .match-score-badge {
      display: inline-block; margin-top: 0.4rem;
      padding: 0.2rem 0.7rem; border-radius: 12px;
      background: #fef9ec; color: #8a6d00; font-size: 0.75rem; font-weight: 700;
      border: 1px solid #f0d977;
    }
    .exchange-section {
      display: flex; gap: 0.5rem; align-items: flex-start;
      background: #fafaf9; border-radius: var(--radius-sm); padding: 1rem;
      border: 1px solid var(--border);
    }
    .exchange-col { flex: 1; }
    .ex-label { font-size: 0.75rem; font-weight: 600; color: var(--text-light); margin-bottom: 0.4rem; }
    .exchange-divider { font-size: 1.5rem; color: var(--primary-dark); font-weight: 800; align-self: center; padding: 0 0.25rem; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 0.3rem; }
    .no-skill { font-size: 0.78rem; color: var(--text-muted); }
    .availability-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-light); }
    .avail-icon { font-size: 1rem; }
    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 999;
    }
    .modal-box {
      background: white; border-radius: var(--radius); padding: 2rem;
      width: 90%; max-width: 460px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      animation: fadeIn 0.25s ease;
    }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
    .modal-header h3 { font-size: 1.1rem; font-weight: 700; }
    .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-light); }
    .btn-block { width: 100%; justify-content: center; padding: 0.85rem; margin-top: 0.5rem; }
    .error-msg { color: #d45f5f; background: #fdf0f0; padding: 0.6rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; }
  `]
})
export class MatchesComponent implements OnInit {
  loading = signal(true);
  showModal = signal(false);
  reqLoading = signal(false);
  reqError = signal('');
  matches = signal<any[]>([]);
  selectedMatch: any = null;
  sentRequests: Record<string, boolean> = {};
  searchTerm = '';
  reqData = { skillOffered: '', skillRequested: '', message: '' };
  mySkillsOffered: string[] = [];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.mySkillsOffered = this.auth.currentUser()?.skillsOffered || [];
    this.api.getMatches().subscribe({
      next: data => { this.matches.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  filteredMatches() {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.matches();
    return this.matches().filter(m =>
      m.user.name.toLowerCase().includes(term) ||
      m.canLearn.some((s: string) => s.toLowerCase().includes(term)) ||
      m.canTeach.some((s: string) => s.toLowerCase().includes(term))
    );
  }

  openRequestModal(m: any) { this.selectedMatch = m; this.reqData = { skillOffered: '', skillRequested: '', message: '' }; this.showModal.set(true); }
  closeModal() { this.showModal.set(false); this.selectedMatch = null; }

  sendRequest() {
    if (!this.reqData.skillOffered || !this.reqData.skillRequested) { this.reqError.set('Please select skills for both sides'); return; }
    this.reqLoading.set(true); this.reqError.set('');
    this.api.sendRequest({ receiverId: this.selectedMatch.user._id, ...this.reqData }).subscribe({
      next: () => { this.sentRequests[this.selectedMatch.user._id] = true; this.reqLoading.set(false); this.closeModal(); },
      error: (e) => { this.reqError.set(e.error?.message || 'Failed to send request'); this.reqLoading.set(false); }
    });
  }

  getInitials(name: string) { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
}
