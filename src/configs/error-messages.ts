export type ErrorMsgsObject = Record<string, string>;

export const authErrorMsgs: ErrorMsgsObject = {
  '/api/v1/auth/login': 'Invalid username/email or password',
  '/api/v1/auth/signup': 'Registration failed',
  '/api/v1/auth/check-username': 'Invalid username',
};
