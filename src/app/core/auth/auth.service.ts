import { HttpClient, HttpContext } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env/environment';
import { catchError, Observable, of, tap } from 'rxjs';
import { IS_PUBLIC } from './auth.interceptor';
import { Login, LoginSuccess } from './login/interfaces';
import { LoginResponse } from './login/types/login-response.type';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Token will be refreshed 5 minutes before expiration time
  private readonly TOKEN_EXPIRY_THRESHOLD_MINUTES = 5;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly CONTEXT = { context: new HttpContext().set(IS_PUBLIC, true) };

  AUTH = '/api/auth';

  get user(): WritableSignal<User | null> {
    const token = localStorage.getItem('token');
    return signal(token ? this.jwtHelper.decodeToken(token) : null);
  }

  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  login(body: Login): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.baseURL}${this.AUTH}/login`, body, this.CONTEXT)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            // Handle invalid credentials
            console.log('Invalid credentials');
          }
          return of();
        }),
        tap(data => {
          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
          this.router.navigate(['/dashboard']);
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

  storeTokens(data: LoginSuccess): void {
    localStorage.setItem('token', data.data.token);
  }

  refreshToken(): Observable<LoginResponse | null> {
    return this.http
      .post<LoginResponse>(`${environment.baseURL}${this.AUTH}/reset-token`, this.CONTEXT)
      .pipe(
        catchError(() => of()),
        tap(data => {
          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
        }),
      );
  }
}
