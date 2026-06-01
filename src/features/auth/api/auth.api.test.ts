import { mockLogin, mockRegister } from './auth.api';

jest.useFakeTimers();

describe('mockLogin', () => {
  it('resolves with user and token for valid credentials', async () => {
    const promise = mockLogin('test@example.com', 'password123');
    jest.runAllTimers();
    const result = await promise;
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toContain('mock_');
  });

  it('throws AuthError with field=email for invalid email', async () => {
    const promise = mockLogin('notanemail', 'password123');
    jest.runAllTimers();
    await expect(promise).rejects.toMatchObject({ field: 'email' });
  });

  it('throws AuthError with field=password for short password', async () => {
    const promise = mockLogin('test@example.com', '123');
    jest.runAllTimers();
    await expect(promise).rejects.toMatchObject({ field: 'password' });
  });
});

describe('mockRegister', () => {
  it('resolves with user and token for valid inputs', async () => {
    const promise = mockRegister('test@example.com', 'password123', 'Jane');
    jest.runAllTimers();
    const result = await promise;
    expect(result.user.name).toBe('Jane');
    expect(result.user.email).toBe('test@example.com');
  });

  it('throws AuthError with field=name for empty name', async () => {
    const promise = mockRegister('test@example.com', 'password123', '  ');
    jest.runAllTimers();
    await expect(promise).rejects.toMatchObject({ field: 'name' });
  });

  it('throws AuthError with field=email for invalid email', async () => {
    const promise = mockRegister('bad', 'password123', 'Jane');
    jest.runAllTimers();
    await expect(promise).rejects.toMatchObject({ field: 'email' });
  });
});
