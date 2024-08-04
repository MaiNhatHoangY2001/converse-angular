export interface DataLogin {
  _id: string;
  token: string;
  refresh_token: string;
  firstName: string;
  lastName: string;
}

export interface LoginSuccess {
  status: number;
  message: number;
  data: DataLogin;
  code: number;
}
