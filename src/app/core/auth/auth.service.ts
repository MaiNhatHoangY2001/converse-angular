import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClient } from '@app/shared/api-client';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env/environment';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { IS_PUBLIC } from './auth.interceptor';
import { Login, LoginResponse } from './login/interfaces/login.interface';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Token will be refreshed 5 minutes before expiration time
  private readonly TOKEN_EXPIRY_THRESHOLD_MINUTES = 5;

  private api: ApiClient;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly CONTEXT = { context: new HttpContext().set(IS_PUBLIC, true) };

  AUTH = '/api/auth';

  constructor() {
    this.api = new ApiClient(this.http, {});
  }

  get user(): WritableSignal<User | null> {
    const token = localStorage.getItem('token');
    return signal(token ? this.jwtHelper.decodeToken(token) : null);
  }

  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  login(body: Login): Observable<LoginResponse> {
    return this.api.auth.login(body).pipe(
      map(res => {
        return res;
      }),
      catchError(error => {
        throw error;
      }),
    );
  }

  loginGoogle(token: string): Observable<LoginResponse> {
    return this.api.auth.loginGoogle(token).pipe(
      map(res => {
        return res;
      }),
      catchError(error => {
        throw error;
      }),
    );
  }

  logout(): void {
    // if you don't have any backend route to invalidate the refresh token
    // then just remove localStorage items and redirect to login route

    // const refresh_token = localStorage.getItem('refresh_token');
    // this.http
    //   .post<LoginResponse>(
    //     `${environment.baseURL}/token/invalidate`,
    //     { refresh_token },
    //     this.CONTEXT,
    //   )
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/']);
    // });
  }

  storeTokens(data: LoginResponse): void {
    if (data) {
      const token = data.data?.token;
      const userProfile = data.data;
      delete userProfile?.token;
      localStorage.setItem('token', token || '');
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
    }
  }

  refreshToken(): Observable<LoginResponse | null> {
    return this.http
      .post<LoginResponse>(`${environment.baseURL}${this.AUTH}/reset-token`, this.CONTEXT)
      .pipe(
        catchError(() => of()),
        tap(data => {
          const loginSuccessData = data;
          this.storeTokens(loginSuccessData);
        }),
      );
  }
}
