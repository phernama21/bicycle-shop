export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegistration extends UserLogin {
  firstName: string;
  lastName: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  user: User;
  headers: {
    'access-token': string;
    client: string;
    uid: string;
  };
}