export interface Login {
  email: string;
  password: string;
}

export interface DataLogin {
  _id: string;
  token?: string;
  refresh_token: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
}

export interface LoginResponse {
  status: number;
  message: number;
  data?: DataLogin;
  code: number;
}
