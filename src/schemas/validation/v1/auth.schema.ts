import { z } from 'zod';
import { countryCodes } from '@apptypes/country.type';

const signupBody = {
  body: z
    .object({
      user_name: z
        .string({
          required_error: 'Username is required',
          invalid_type_error: 'Username must be a string',
        })
        .superRefine((val, ctx) => {
          const username = val.trim();

          if (username.length < 6 || username.length > 50) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Username must be between 6 to 50 characters long`,
            });
          } else if (!/^[a-zA-Z0-9]/.test(username)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `The first character of your username must be an ASCII letter (a-z) or number (0-9)`,
            });
          } else if (!/[a-zA-Z0-9]$/.test(username)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `The last character of your username must be an ASCII letter (a-z) or number (0-9)`,
            });
          } else if (
            !/^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/.test(username)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Username can only contain letters (a-z), numbers (0-9), underscores (_) and hyphens (-)`,
            });
          }
        }),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .trim()
        .email({ message: 'Invalid email address' }),
      password: z
        .string({
          required_error: 'Password is required',
          invalid_type_error: 'Password must be a string',
        })
        .trim()
        .min(8, { message: 'Password must be between 8 to 30 characters long' })
        .max(30, {
          message: 'Password must be between 8 to 30 characters long',
        }),
      confirm_password: z
        .string({
          required_error: 'Confirm Password is required',
          invalid_type_error: 'Confirm Password must be a string',
        })
        .trim(),
      country: z.enum(countryCodes, {
        errorMap: (_, ctx) => {
          if (ctx.data === '') {
            return { message: 'Country is required' };
          }

          return { message: 'Invalid country value' };
        },
      }),
    })
    .refine(
      (data) => {
        return data.password === data.confirm_password;
      },
      {
        message: 'Confirm password does not match',
        path: ['confirm_password'],
      },
    ),
};

export const signupSchema = z.object({
  ...signupBody,
});

export type TSignupInput = z.TypeOf<typeof signupSchema>;

const loginBody = {
  body: z.object({
    identity: z
      .string({
        required_error: 'Invalid username/email or password',
        invalid_type_error: 'Invalid username/email or password',
      })
      .trim(),
    password: z
      .string({
        required_error: 'Invalid username/email or password',
        invalid_type_error: 'Invalid username/email or password',
      })
      .trim(),
  }),
};

export const loginSchema = z.object({
  ...loginBody,
});

export type TLoginInput = z.TypeOf<typeof loginSchema>;

const usernameCheckBody = {
  body: z.object({
    user_name: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
      })
      .superRefine((val, ctx) => {
        const username = val.trim();

        if (username.length < 6 || username.length > 50) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Username must be between 6 to 50 characters long`,
          });
        } else if (!/^[a-zA-Z0-9]/.test(username)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `The first character of your username must be an ASCII letter (a-z) or number (0-9)`,
          });
        } else if (!/[a-zA-Z0-9]$/.test(username)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `The last character of your username must be an ASCII letter (a-z) or number (0-9)`,
          });
        } else if (
          !/^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/.test(username)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Username can only contain letters (a-z), numbers (0-9), underscores (_) and hyphens (-)`,
          });
        }
      }),
  }),
};

export const usernameCheckSchema = z.object({
  ...usernameCheckBody,
});

export type TUsernameCheckInput = z.TypeOf<typeof usernameCheckSchema>;

const verifyEmailBody = {
  body: z.object({
    token: z
      .string({
        required_error: 'Email verification unsuccessful',
        invalid_type_error: 'Email verification unsuccessful',
      })
      .trim(),
  }),
};

export const verifyEmailSchema = z.object({
  ...verifyEmailBody,
});

export type TVerifyEmailInput = z.TypeOf<typeof verifyEmailSchema>;
