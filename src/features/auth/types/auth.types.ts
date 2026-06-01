export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthError {
  message: string;
  field?: 'email' | 'password' | 'name';
}
