import { Component, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['8:00-10:00 AM', '10:00-12:00 PM', '12:00-2:00 PM', '2:00-4:00 PM', '4:00-6:00 PM', '6:00-8:00 PM'];

@Component({
    selector: 'app-profile',
    imports: [FormsModule],
    template: `
    <div class="page fade-in">
      <div class="page-header">
        <h1>My Profile</h1>
        <p>Manage your skills and availability</p>
      </div>
    
      <div class="grid-2">
        <!-- Left: Basic Info -->
        <div class="card">
          <h3 class="section-title">Basic Information</h3>
          <div class="avatar-section">
            <div class="big-avatar">{{ getInitials(profile.name) }}</div>
          </div>
          <div class="form-group">
            <label>Full Name</label>
            <input class="form-control" [(ngModel)]="profile.name" placeholder="Your name" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input class="form-control" [value]="profile.email" disabled />
          </div>
          <div class="form-group">
            <label>About Me</label>
            <textarea class="form-control" [(ngModel)]="profile.bio" rows="3" placeholder="Tell others about yourself, your year, department..."></textarea>
          </div>
        </div>
    
        <!-- Right: Skills -->
        <div class="card">
          <h3 class="section-title">My Skills</h3>
    
          <div class="form-group">
            <label>✅ Skills I Can Teach</label>
            <div class="tags-input-area">
              @for (s of profile.skillsOffered; track s) {
                <div class="skill-tag skill-offered">
                  {{ s }} <span class="remove-tag" (click)="removeSkill('offered', s)">×</span>
                </div>
              }
              <input
                class="tag-input"
                [(ngModel)]="newOffered"
                (keydown.enter)="addSkill('offered', $event)"
                placeholder="Type skill and press Enter"
                />
            </div>
          </div>
    
          <div class="form-group" style="margin-top:1.2rem">
            <label>🎯 Skills I Want to Learn</label>
            <div class="tags-input-area">
              @for (s of profile.skillsWanted; track s) {
                <div class="skill-tag skill-wanted">
                  {{ s }} <span class="remove-tag" (click)="removeSkill('wanted', s)">×</span>
                </div>
              }
              <input
                class="tag-input"
                [(ngModel)]="newWanted"
                (keydown.enter)="addSkill('wanted', $event)"
                placeholder="Type skill and press Enter"
                />
            </div>
          </div>
        </div>
    
        <!-- Availability -->
        <div class="card">
          <h3 class="section-title">📅 Availability</h3>
          <label class="avail-label">Available Days</label>
          <div class="days-grid">
            @for (d of days; track d) {
              <div
                class="day-chip"
                [class.selected]="profile.availability.days.includes(d)"
                (click)="toggleDay(d)"
              >{{ d.slice(0, 3) }}</div>
            }
          </div>
          <label class="avail-label" style="margin-top:1.2rem">Preferred Time Slots</label>
          <div class="slots-grid">
            @for (s of slots; track s) {
              <div
                class="slot-chip"
                [class.selected]="profile.availability.timeSlots.includes(s)"
                (click)="toggleSlot(s)"
              >{{ s }}</div>
            }
          </div>
        </div>
    
        <!-- Save -->
        <div class="card save-card">
          <h3 class="section-title">Save Changes</h3>
          <p style="color:var(--text-light);font-size:0.88rem;margin-bottom:1.5rem">
            Keep your profile updated to improve your match quality.
          </p>
          @if (success()) {
            <div class="success-msg">✅ Profile updated successfully!</div>
          }
          @if (error()) {
            <div class="error-msg">{{ error() }}</div>
          }
          <button class="btn btn-primary btn-block" (click)="save()" [disabled]="loading()">
            {{ loading() ? 'Saving...' : '💾 Save Profile' }}
          </button>
        </div>
      </div>
    </div>
    `,
    styles: [`
    .section-title { font-size: 1rem; font-weight: 700; margin-bottom: 1.5rem; }
    .avatar-section { display: flex; justify-content: center; margin-bottom: 1.5rem; }
    .big-avatar {
      width: 80px; height: 80px; border-radius: 50%;
      background: linear-gradient(135deg, #5F7F73, #A8BDB2);
      color: white; font-weight: 800; font-size: 1.5rem;
      display: flex; align-items: center; justify-content: center;
    }
    .tags-input-area {
      display: flex; flex-wrap: wrap; gap: 0.4rem;
      padding: 0.6rem; border-radius: var(--radius-sm);
      border: 1.5px solid var(--border); background: #fafaf9;
      min-height: 48px;
    }
    .tags-input-area:focus-within { border-color: var(--primary-dark); background: white; }
    .remove-tag { margin-left: 0.3rem; cursor: pointer; opacity: 0.7; font-weight: 700; }
    .remove-tag:hover { opacity: 1; }
    .tag-input {
      border: none; outline: none; background: transparent;
      font-size: 0.85rem; flex: 1; min-width: 120px; padding: 0.1rem;
    }
    .avail-label { font-size: 0.85rem; font-weight: 600; color: var(--text-light); display: block; margin-bottom: 0.7rem; }
    .days-grid { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .day-chip {
      padding: 0.45rem 0.9rem; border-radius: 20px; font-size: 0.82rem; font-weight: 600;
      cursor: pointer; border: 1.5px solid var(--border); background: #fafaf9;
      transition: var(--transition);
    }
    .day-chip.selected { background: var(--primary-dark); color: white; border-color: var(--primary-dark); }
    .slots-grid { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .slot-chip {
      padding: 0.45rem 0.9rem; border-radius: 20px; font-size: 0.78rem; font-weight: 500;
      cursor: pointer; border: 1.5px solid var(--border); background: #fafaf9;
      transition: var(--transition);
    }
    .slot-chip.selected { background: var(--accent); color: #5a4a10; border-color: var(--accent); }
    .save-card { display: flex; flex-direction: column; }
    .btn-block { width: 100%; justify-content: center; padding: 0.85rem; }
    .success-msg { color: #155724; background: #d4edda; padding: 0.6rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; }
    .error-msg { color: #d45f5f; background: #fdf0f0; padding: 0.6rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; }
  `]
})
export class ProfileComponent implements OnInit {
  profile: any = { name: '', email: '', bio: '', skillsOffered: [], skillsWanted: [], availability: { days: [], timeSlots: [] } };
  newOffered = '';
  newWanted = '';
  days = DAYS;
  slots = SLOTS;
  loading = signal(false);
  success = signal(false);
  error = signal('');

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    const u = this.auth.currentUser();
    if (u) {
      this.profile = {
        name: u.name || '',
        email: u.email || '',
        bio: u.bio || '',
        skillsOffered: [...(u.skillsOffered || [])],
        skillsWanted: [...(u.skillsWanted || [])],
        availability: { days: [...(u.availability?.days || [])], timeSlots: [...(u.availability?.timeSlots || [])] }
      };
    }
  }

  addSkill(type: 'offered' | 'wanted', e: any) {
    e.preventDefault();
    const val = type === 'offered' ? this.newOffered.trim() : this.newWanted.trim();
    if (!val) return;
    if (type === 'offered') { this.profile.skillsOffered.push(val); this.newOffered = ''; }
    else { this.profile.skillsWanted.push(val); this.newWanted = ''; }
  }

  removeSkill(type: 'offered' | 'wanted', skill: string) {
    if (type === 'offered') this.profile.skillsOffered = this.profile.skillsOffered.filter((s: string) => s !== skill);
    else this.profile.skillsWanted = this.profile.skillsWanted.filter((s: string) => s !== skill);
  }

  toggleDay(d: string) {
    const idx = this.profile.availability.days.indexOf(d);
    if (idx > -1) this.profile.availability.days.splice(idx, 1);
    else this.profile.availability.days.push(d);
  }

  toggleSlot(s: string) {
    const idx = this.profile.availability.timeSlots.indexOf(s);
    if (idx > -1) this.profile.availability.timeSlots.splice(idx, 1);
    else this.profile.availability.timeSlots.push(s);
  }

  save() {
    this.loading.set(true); this.success.set(false); this.error.set('');
    const userId = this.auth.currentUser()?._id;
    this.api.updateUser(userId!, this.profile).subscribe({
      next: (updated) => {
        this.auth.updateCurrentUser(updated);
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => this.success.set(false), 3000);
      },
      error: (e) => { this.error.set(e.error?.message || 'Update failed'); this.loading.set(false); }
    });
  }

  getInitials(name?: string) {
    if (!name) return '?';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
