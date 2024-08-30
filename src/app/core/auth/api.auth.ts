import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, catchError } from 'rxjs';
import { ApiClientConfig } from '../../shared/api-client.config';
import { IS_PUBLIC } from './auth.interceptor';
import { Login, LoginResponse } from './login/interfaces/login.interface';

export class AuthApi {
  private apiUrl: string = environment.baseURL;
  AUTH = '/api/auth';

  private readonly CONTEXT = { context: new HttpContext().set(IS_PUBLIC, true) };

  constructor(
    public readonly http: HttpClient,
    public config: ApiClientConfig,
  ) {}

  login(body: Login): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}${this.AUTH}/login`, body, this.CONTEXT)
      .pipe(
        catchError(error => {
          throw error;
        }),
      );
  }

  loginGoogle(token: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}${this.AUTH}/google`, { token }, this.CONTEXT)
      .pipe(
        catchError(error => {
          throw error;
        }),
      );
  }
}
