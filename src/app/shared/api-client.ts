import { HttpClient } from '@angular/common/http';
import { AuthApi } from '@app/core/auth/api.auth';
import { ApiClientConfig } from './api-client.config';

export class ApiClient {
  readonly auth: AuthApi;

  constructor(
    private http: HttpClient,
    config: ApiClientConfig,
  ) {
    this.auth = new AuthApi(http, config);
  }
}
