import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page fade-in">
      <div class="page-header">
        <h1>📅 My Sessions</h1>
        <p>View and manage your scheduled skill exchange sessions</p>
      </div>

      <div class="sessions-layout">
        <!-- Sessions List -->
        <div class="sessions-main">
          <div class="loading-state" *ngIf="loading()">
            <div class="spinner"></div>
            <p>Loading sessions...</p>
          </div>

          <div class="empty-state" *ngIf="!loading() && sessions().length === 0">
            <div class="empty-icon">📭</div>
            <h3>No sessions scheduled yet</h3>
            <p>Use the form on the right to book your first skill exchange session.</p>
          </div>

          <div class="sessions-list" *ngIf="!loading()">
            <div class="session-card card" *ngFor="let s of sessions()">
              <div class="session-header">
                <div class="session-icon">🎓</div>
                <div class="session-meta">
                  <h4>{{ s.skillTopic || 'Skill Session' }}</h4>
                  <div class="session-users">
                    <span *ngFor="let u of s.users" class="user-chip">{{ u.name || u }}</span>
                  </div>
                </div>
                <span class="badge" [class]="'badge-' + s.status">{{ s.status }}</span>
              </div>

              <div class="session-details">
                <div class="detail-row">
                  <span class="detail-icon">📅</span>
                  <span>{{ s.date }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-icon">🕐</span>
                  <span>{{ s.timeSlot }}</span>
                </div>
                <div class="detail-row" *ngIf="s.meetLink">
                  <span class="detail-icon">🔗</span>
                  <a [href]="s.meetLink" target="_blank" class="meet-link">Join Meeting</a>
                </div>
                <div class="detail-row" *ngIf="s.notes">
                  <span class="detail-icon">📝</span>
                  <span>{{ s.notes }}</span>
                </div>
              </div>

              <div class="session-actions" *ngIf="s.status === 'scheduled'">
                <button class="btn btn-success btn-sm" (click)="updateStatus(s._id, 'completed')">✅ Mark Completed</button>
                <button class="btn btn-danger btn-sm" (click)="updateStatus(s._id, 'cancelled')">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Book Session Form -->
        <div class="book-panel card">
          <h3 style="margin-bottom:1.5rem;font-size:1rem;font-weight:700">📅 Book a Session</h3>
          <div class="form-group">
            <label>Skill Topic</label>
            <input class="form-control" [(ngModel)]="bookData.skillTopic" placeholder="e.g. Python Basics" />
          </div>
          <div class="form-group">
            <label>Partner's User ID</label>
            <input class="form-control" [(ngModel)]="bookData.partnerId" placeholder="Paste user ID from matches" />
          </div>
          <div class="form-group">
            <label>Date</label>
            <input class="form-control" type="date" [(ngModel)]="bookData.date" />
          </div>
          <div class="form-group">
            <label>Time Slot</label>
            <select class="form-control" [(ngModel)]="bookData.timeSlot">
              <option value="">Select...</option>
              <option *ngFor="let s of timeSlots">{{ s }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Meet Link (optional)</label>
            <input class="form-control" [(ngModel)]="bookData.meetLink" placeholder="https://meet.google.com/..." />
          </div>
          <div class="form-group">
            <label>Notes (optional)</label>
            <textarea class="form-control" [(ngModel)]="bookData.notes" rows="2" placeholder="Topics to cover..."></textarea>
          </div>
          <div class="success-msg" *ngIf="bookSuccess()">✅ Session booked successfully!</div>
          <div class="error-msg" *ngIf="bookError()">{{ bookError() }}</div>
          <button class="btn btn-primary btn-block" (click)="bookSession()" [disabled]="bookLoading()">
            {{ bookLoading() ? 'Booking...' : '📅 Book Session' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sessions-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; align-items: start; }
    .sessions-list { display: flex; flex-direction: column; gap: 1rem; }
    .session-card { display: flex; flex-direction: column; gap: 1rem; }
    .session-header { display: flex; align-items: flex-start; gap: 1rem; }
    .session-icon { font-size: 2rem; }
    .session-meta { flex: 1; }
    .session-meta h4 { font-size: 0.95rem; font-weight: 700; }
    .session-users { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.3rem; }
    .user-chip {
      padding: 0.2rem 0.6rem; border-radius: 12px;
      background: var(--primary); color: white; font-size: 0.75rem; font-weight: 600;
    }
    .session-details { display: flex; flex-direction: column; gap: 0.5rem; background: #fafaf9; padding: 0.9rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border); }
    .detail-row { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; }
    .detail-icon { font-size: 1rem; }
    .meet-link { color: var(--primary-dark); font-weight: 600; text-decoration: underline; }
    .session-actions { display: flex; gap: 0.75rem; }
    .book-panel { position: sticky; top: 80px; }
    .btn-block { width: 100%; justify-content: center; padding: 0.85rem; margin-top: 0.5rem; }
    .success-msg { color: #155724; background: #d4edda; padding: 0.6rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; }
    .error-msg { color: #d45f5f; background: #fdf0f0; padding: 0.6rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; }
    .loading-state { text-align: center; padding: 3rem; color: var(--text-light); }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary-dark); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 900px) { .sessions-layout { grid-template-columns: 1fr; } }
  `]
})
export class SessionsComponent implements OnInit {
  loading = signal(true);
  sessions = signal<any[]>([]);
  bookLoading = signal(false);
  bookSuccess = signal(false);
  bookError = signal('');
  bookData: any = { skillTopic: '', partnerId: '', date: '', timeSlot: '', meetLink: '', notes: '' };
  timeSlots = ['8:00-10:00 AM', '10:00-12:00 PM', '12:00-2:00 PM', '2:00-4:00 PM', '4:00-6:00 PM', '6:00-8:00 PM'];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.getSessions().subscribe({ next: data => { this.sessions.set(data); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  bookSession() {
    if (!this.bookData.date || !this.bookData.timeSlot) { this.bookError.set('Date and time slot are required'); return; }
    this.bookLoading.set(true); this.bookSuccess.set(false); this.bookError.set('');
    const myId = this.auth.currentUser()?._id;
    const users = [myId, this.bookData.partnerId].filter(Boolean);
    this.api.bookSession({ ...this.bookData, users }).subscribe({
      next: () => {
        this.bookSuccess.set(true);
        this.bookLoading.set(false);
        this.bookData = { skillTopic: '', partnerId: '', date: '', timeSlot: '', meetLink: '', notes: '' };
        this.load();
        setTimeout(() => this.bookSuccess.set(false), 3000);
      },
      error: (e) => { this.bookError.set(e.error?.message || 'Booking failed'); this.bookLoading.set(false); }
    });
  }

  updateStatus(id: string, status: string) {
    this.api.updateSession(id, { status }).subscribe({ next: () => this.load(), error: () => {} });
  }
}
