import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.token()}` });
  }

  // Users
  getUsers() { return this.http.get<any[]>(`${this.BASE}/users`, { headers: this.headers() }); }
  getUser(id: string) { return this.http.get<any>(`${this.BASE}/users/${id}`, { headers: this.headers() }); }
  updateUser(id: string, data: any) { return this.http.put<any>(`${this.BASE}/users/${id}`, data, { headers: this.headers() }); }

  // Match
  getMatches() { return this.http.post<any[]>(`${this.BASE}/match`, {}, { headers: this.headers() }); }

  // Requests
  getRequests() { return this.http.get<any[]>(`${this.BASE}/requests`, { headers: this.headers() }); }
  sendRequest(data: any) { return this.http.post<any>(`${this.BASE}/requests`, data, { headers: this.headers() }); }
  updateRequest(id: string, status: string) { return this.http.put<any>(`${this.BASE}/requests/${id}`, { status }, { headers: this.headers() }); }

  // Sessions
  getSessions() { return this.http.get<any[]>(`${this.BASE}/sessions`, { headers: this.headers() }); }
  bookSession(data: any) { return this.http.post<any>(`${this.BASE}/sessions`, data, { headers: this.headers() }); }
  updateSession(id: string, data: any) { return this.http.put<any>(`${this.BASE}/sessions/${id}`, data, { headers: this.headers() }); }
}
