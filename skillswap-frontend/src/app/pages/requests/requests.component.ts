import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-requests',
    imports: [CommonModule],
    template: `
    <div class="page fade-in">
      <div class="page-header">
        <h1>🤝 Swap Requests</h1>
        <p>Manage your incoming and outgoing skill exchange requests</p>
      </div>
    
      <!-- Tabs -->
      <div class="req-tabs">
        <button [class.active]="activeTab() === 'received'" (click)="activeTab.set('received')">
          Received @if (received().length) {
          <span class="count-badge">{{ received().length }}</span>
        }
      </button>
      <button [class.active]="activeTab() === 'sent'" (click)="activeTab.set('sent')">
        Sent @if (sent().length) {
        <span class="count-badge">{{ sent().length }}</span>
      }
    </button>
    </div>
    
    <!-- Loading -->
    @if (loading()) {
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading requests...</p>
      </div>
    }
    
    <!-- Received -->
    @if (!loading() && activeTab() === 'received') {
      <div>
        @if (received().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No incoming requests</h3>
            <p>When students send you swap requests, they'll appear here.</p>
          </div>
        }
        @if (received().length > 0) {
          <div class="requests-list">
            @for (r of received(); track r) {
              <div class="request-card card">
                <div class="req-header">
                  <div class="req-avatar">{{ getInitials(r.senderId?.name) }}</div>
                  <div class="req-meta">
                    <h4>{{ r.senderId?.name }}</h4>
                    <p>{{ r.senderId?.email }}</p>
                    <div class="req-time">{{ r.createdAt | date:'mediumDate' }}</div>
                  </div>
                  <span class="badge" [class]="'badge-' + r.status">{{ r.status }}</span>
                </div>
                <div class="req-exchange">
                  <div class="req-skill-row">
                    <span class="req-arrow">🎁</span>
                    <span class="req-label">They offer:</span>
                    <span class="skill-tag skill-offered">{{ r.skillOffered }}</span>
                  </div>
                  <div class="req-skill-row">
                    <span class="req-arrow">🎯</span>
                    <span class="req-label">They want:</span>
                    <span class="skill-tag skill-wanted">{{ r.skillRequested }}</span>
                  </div>
                </div>
                @if (r.message) {
                  <div class="req-message">
                    <span class="msg-icon">💬</span>
                    <span>{{ r.message }}</span>
                  </div>
                }
                @if (r.status === 'pending') {
                  <div class="req-actions">
                    <button class="btn btn-success" (click)="respond(r._id, 'accepted')">✅ Accept</button>
                    <button class="btn btn-danger" (click)="respond(r._id, 'rejected')">❌ Decline</button>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    }
    
    <!-- Sent -->
    @if (!loading() && activeTab() === 'sent') {
      <div>
        @if (sent().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📤</div>
            <h3>No sent requests yet</h3>
            <p>Go to Matches to send a swap request to a compatible student.</p>
          </div>
        }
        @if (sent().length > 0) {
          <div class="requests-list">
            @for (r of sent(); track r) {
              <div class="request-card card">
                <div class="req-header">
                  <div class="req-avatar warm">{{ getInitials(r.receiverId?.name) }}</div>
                  <div class="req-meta">
                    <h4>{{ r.receiverId?.name }}</h4>
                    <p>{{ r.receiverId?.email }}</p>
                    <div class="req-time">{{ r.createdAt | date:'mediumDate' }}</div>
                  </div>
                  <span class="badge" [class]="'badge-' + r.status">{{ r.status }}</span>
                </div>
                <div class="req-exchange">
                  <div class="req-skill-row">
                    <span class="req-arrow">🎁</span>
                    <span class="req-label">You offer:</span>
                    <span class="skill-tag skill-offered">{{ r.skillOffered }}</span>
                  </div>
                  <div class="req-skill-row">
                    <span class="req-arrow">🎯</span>
                    <span class="req-label">You want:</span>
                    <span class="skill-tag skill-wanted">{{ r.skillRequested }}</span>
                  </div>
                </div>
                @if (r.message) {
                  <div class="req-message">
                    <span class="msg-icon">💬</span>
                    <span>{{ r.message }}</span>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    }
    </div>
    `,
    styles: [`
    .req-tabs {
      display: flex; gap: 0.5rem; margin-bottom: 2rem;
      background: white; padding: 4px; border-radius: 12px;
      box-shadow: var(--shadow); width: fit-content;
      border: 1px solid var(--border);
    }
    .req-tabs button {
      padding: 0.55rem 1.5rem; border: none; border-radius: 9px;
      background: transparent; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; color: var(--text-light); transition: var(--transition);
      display: flex; align-items: center; gap: 0.5rem;
    }
    .req-tabs button.active { background: var(--primary-dark); color: white; }
    .count-badge {
      background: rgba(255,255,255,0.25); color: inherit;
      padding: 0.1rem 0.5rem; border-radius: 10px; font-size: 0.75rem; font-weight: 700;
    }
    .req-tabs button:not(.active) .count-badge { background: #f0ede6; color: var(--text-light); }
    .requests-list { display: flex; flex-direction: column; gap: 1rem; }
    .request-card { display: flex; flex-direction: column; gap: 1rem; }
    .req-header { display: flex; align-items: center; gap: 1rem; }
    .req-avatar {
      width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #5F7F73, #A8BDB2);
      color: white; font-weight: 800; font-size: 0.95rem;
      display: flex; align-items: center; justify-content: center;
    }
    .req-avatar.warm { background: linear-gradient(135deg, #D9C27A, #E8D8B5); color: #5a4a10; }
    .req-meta { flex: 1; }
    .req-meta h4 { font-size: 0.95rem; font-weight: 700; }
    .req-meta p { font-size: 0.8rem; color: var(--text-light); }
    .req-time { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem; }
    .req-exchange {
      background: #fafaf9; padding: 0.9rem 1rem;
      border-radius: var(--radius-sm); border: 1px solid var(--border);
      display: flex; flex-direction: column; gap: 0.5rem;
    }
    .req-skill-row { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; }
    .req-arrow { font-size: 1rem; }
    .req-label { color: var(--text-light); font-size: 0.82rem; min-width: 80px; }
    .req-message { display: flex; gap: 0.5rem; font-size: 0.85rem; color: var(--text-light); background: #f7f3e8; padding: 0.7rem 1rem; border-radius: var(--radius-sm); }
    .msg-icon { flex-shrink: 0; }
    .req-actions { display: flex; gap: 0.75rem; }
    .loading-state { text-align: center; padding: 4rem; color: var(--text-light); }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary-dark); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class RequestsComponent implements OnInit {
  loading = signal(true);
  activeTab = signal<'received' | 'sent'>('received');
  allRequests = signal<any[]>([]);
  myId = '';

  constructor(private api: ApiService, private auth: AuthService) {
    this.myId = auth.currentUser()?._id || '';
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.api.getRequests().subscribe({
      next: data => { this.allRequests.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  received() { return this.allRequests().filter(r => r.receiverId?._id === this.myId || r.receiverId === this.myId); }
  sent() { return this.allRequests().filter(r => r.senderId?._id === this.myId || r.senderId === this.myId); }

  respond(id: string, status: 'accepted' | 'rejected') {
    this.api.updateRequest(id, status).subscribe({ next: () => this.load(), error: () => {} });
  }

  getInitials(name?: string) {
    if (!name) return '?';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
