import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability?: { days: string[]; timeSlots: string[] };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:5000/api';
  private _currentUser = signal<User | null>(null);
  private _token = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('ss_user');
    const token = localStorage.getItem('ss_token');
    if (stored && token) {
      try {
        this._currentUser.set(JSON.parse(stored));
        this._token.set(token);
      } catch {
        // A stale or manually edited storage value should not prevent the app
        // from starting. Clear the incomplete session and ask the user to sign in.
        localStorage.removeItem('ss_user');
        localStorage.removeItem('ss_token');
      }
    }
  }

  currentUser() { return this._currentUser(); }
  token() { return this._token(); }
  isLoggedIn() { return !!this._token(); }

  register(data: any) {
    return this.http.post<{ token: string; user: User }>(`${this.API}/register`, data).pipe(
      tap(res => this._save(res))
    );
  }

  login(data: any) {
    return this.http.post<{ token: string; user: User }>(`${this.API}/login`, data).pipe(
      tap(res => this._save(res))
    );
  }

  updateCurrentUser(user: User) {
    this._currentUser.set(user);
    localStorage.setItem('ss_user', JSON.stringify(user));
  }

  logout() {
    this._currentUser.set(null);
    this._token.set(null);
    localStorage.removeItem('ss_user');
    localStorage.removeItem('ss_token');
  }

  private _save(res: { token: string; user: User }) {
    this._currentUser.set(res.user);
    this._token.set(res.token);
    localStorage.setItem('ss_user', JSON.stringify(res.user));
    localStorage.setItem('ss_token', res.token);
  }
}
