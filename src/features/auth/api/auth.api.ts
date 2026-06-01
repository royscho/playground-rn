import type { User, AuthError } from '../types/auth.types';

const MOCK_DELAY_MS = 800;

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const validateEmail = (email: string): AuthError | null => {
  if (!email.includes('@') || !email.includes('.')) {
    return { message: 'Enter a valid email address', field: 'email' };
  }
  return null;
};

const validatePassword = (password: string): AuthError | null => {
  if (password.length < 6) {
    return { message: 'Password must be at least 6 characters', field: 'password' };
  }
  return null;
};

export const mockLogin = async (
  email: string,
  password: string,
): Promise<{ user: User; token: string }> => {
  await delay(MOCK_DELAY_MS);

  const emailError = validateEmail(email);
  if (emailError) throw emailError;

  const passwordError = validatePassword(password);
  if (passwordError) throw passwordError;

  const user: User = {
    id: `user_${email.replace(/[^a-z0-9]/gi, '')}`,
    email: email.toLowerCase(),
    name: email.split('@')[0],
  };
  const token = `mock_${Date.now()}_${email}`;

  return { user, token };
};

export const mockRegister = async (
  email: string,
  password: string,
  name: string,
): Promise<{ user: User; token: string }> => {
  await delay(MOCK_DELAY_MS);

  const emailError = validateEmail(email);
  if (emailError) throw emailError;

  const passwordError = validatePassword(password);
  if (passwordError) throw passwordError;

  if (!name.trim()) {
    throw { message: 'Name is required', field: 'name' } satisfies AuthError;
  }

  const user: User = {
    id: `user_${Date.now()}`,
    email: email.toLowerCase(),
    name: name.trim(),
  };
  const token = `mock_${Date.now()}_${email}`;

  return { user, token };
};
