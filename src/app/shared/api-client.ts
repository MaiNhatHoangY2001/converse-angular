import { HttpClient } from '@angular/common/http';
import { UserApi } from './api/api.user';

export class ApiClient {
  readonly user: UserApi;

  constructor(private http: HttpClient) {
    this.user = new UserApi(http);
  }
}
