import { describe, expect, test, vi } from "vitest";
import {
  Validation,
  Valid,
  Invalid,
  PromiseValidation,
} from '../src/validation';
import { Result } from '../src/result';

describe('Validation', () => {
  describe('Type constructors', () => {
    test('valid creates Valid type', () => {
      const validation = Validation.valid;
      expect(validation).toEqual({ type: 'valid' });
      expect(Validation.isValid(validation)).toBe(true);
      expect(Validation.isInvalid(validation)).toBe(false);
    });

    test('invalid creates Invalid type', () => {
      const error = 'Something went wrong';
      const validation = Validation.invalid(error);
      expect(validation).toEqual({ type: 'invalid', error });
      expect(Validation.isInvalid(validation)).toBe(true);
      expect(Validation.isValid(validation)).toBe(false);
    });

    test('invalid works with different error types', () => {
      const stringError = Validation.invalid('string error');
      const errorObject = Validation.invalid(new Error('error object'));
      const numberError = Validation.invalid(404);
      const objectError = Validation.invalid({ code: 500, message: 'server error' });

      expect(Validation.isInvalid(stringError)).toBe(true);
      expect(Validation.isInvalid(errorObject)).toBe(true);
      expect(Validation.isInvalid(numberError)).toBe(true);
      expect(Validation.isInvalid(objectError)).toBe(true);
    });
  });

  describe('Type guards', () => {
    const valid = Validation.valid;
    const invalid = Validation.invalid('error');

    test('isValid correctly identifies Valid validations', () => {
      expect(Validation.isValid(valid)).toBe(true);
      expect(Validation.isValid(invalid)).toBe(false);
    });

    test('isInvalid correctly identifies Invalid validations', () => {
      expect(Validation.isInvalid(valid)).toBe(false);
      expect(Validation.isInvalid(invalid)).toBe(true);
    });

    test('type guards work as type predicates', () => {
      const validation: Validation<string> = Validation.valid;
      
      if (Validation.isValid(validation)) {
        // TypeScript should know this is Valid
        expect(validation.type).toBe('valid');
      }
      
      const invalidValidation: Validation<string> = Validation.invalid('error');
      if (Validation.isInvalid(invalidValidation)) {
        // TypeScript should know this is Invalid<string>
        expect(invalidValidation.error).toBe('error');
        expect(invalidValidation.type).toBe('invalid');
      }
    });
  });

  describe('match', () => {
    test('calls valid function for Valid validation', () => {
      const valid = Validation.valid;
      const result = Validation.match(
        valid,
        () => 'Valid result',
        error => `Error: ${error}`
      );
      expect(result).toBe('Valid result');
    });

    test('calls invalid function for Invalid validation', () => {
      const invalid = Validation.invalid('test error');
      const result = Validation.match(
        invalid,
        () => 'Valid result',
        error => `Error: ${error}`
      );
      expect(result).toBe('Error: test error');
    });

    test('can return different types from match functions', () => {
      const valid = Validation.valid;
      const result = Validation.match(
        valid,
        () => ({ type: 'success', data: null }),
        error => ({ type: 'error', message: error })
      );
      expect(result).toEqual({ type: 'success', data: null });
    });

    test('valid function is not called for invalid validations', () => {
      const validFn = vi.fn(() => 'Valid result');
      const invalidFn = vi.fn(error => `Error: ${error}`);
      const invalid = Validation.invalid('error');
      
      Validation.match(invalid, validFn, invalidFn);
      
      expect(validFn).not.toHaveBeenCalled();
      expect(invalidFn).toHaveBeenCalledWith('error');
    });

    test('invalid function is not called for valid validations', () => {
      const validFn = vi.fn(() => 'Valid result');
      const invalidFn = vi.fn(error => `Error: ${error}`);
      const valid = Validation.valid;
      
      Validation.match(valid, validFn, invalidFn);
      
      expect(validFn).toHaveBeenCalledOnce();
      expect(invalidFn).not.toHaveBeenCalled();
    });
  });

  describe('toResult', () => {
    test('converts valid validation to success result', () => {
      const valid = Validation.valid;
      const result = Validation.toResult(valid, 42);
      
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(42);
      }
    });

    test('converts invalid validation to failure result', () => {
      const invalid = Validation.invalid('test error');
      const result = Validation.toResult(invalid, 42);
      
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('test error');
      }
    });

    test('works with different value types', () => {
      const valid = Validation.valid;
      
      const stringResult = Validation.toResult(valid, 'hello');
      const objectResult = Validation.toResult(valid, { id: 1, name: 'test' });
      const arrayResult = Validation.toResult(valid, [1, 2, 3]);
      const nullResult = Validation.toResult(valid, null);
      const undefinedResult = Validation.toResult(valid, undefined);

      expect(Result.isSuccess(stringResult)).toBe(true);
      expect(Result.isSuccess(objectResult)).toBe(true);
      expect(Result.isSuccess(arrayResult)).toBe(true);
      expect(Result.isSuccess(nullResult)).toBe(true);
      expect(Result.isSuccess(undefinedResult)).toBe(true);
    });

    test('works with different error types', () => {
      const stringError = Validation.invalid('string error');
      const errorObject = Validation.invalid(new Error('error object'));
      const numberError = Validation.invalid(404);
      
      const stringResult = Validation.toResult(stringError, 'value');
      const errorResult = Validation.toResult(errorObject, 'value');
      const numberResult = Validation.toResult(numberError, 'value');

      expect(Result.isFailure(stringResult)).toBe(true);
      expect(Result.isFailure(errorResult)).toBe(true);
      expect(Result.isFailure(numberResult)).toBe(true);
    });
  });

  describe('whenValid', () => {
    test('calls function for valid validation and returns original validation', () => {
      const valid = Validation.valid;
      const mockFn = vi.fn();
      const result = Validation.whenValid(valid, mockFn);
      
      expect(mockFn).toHaveBeenCalledOnce();
      expect(result).toBe(valid);
    });

    test('does not call function for invalid validation', () => {
      const invalid = Validation.invalid('error');
      const mockFn = vi.fn();
      const result = Validation.whenValid(invalid, mockFn);
      
      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBe(invalid);
    });

    test('can be chained with other operations', () => {
      const valid = Validation.valid;
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();
      
      const result = Validation.whenValid(
        Validation.whenValid(valid, mockFn1),
        mockFn2
      );
      
      expect(mockFn1).toHaveBeenCalledOnce();
      expect(mockFn2).toHaveBeenCalledOnce();
      expect(result).toBe(valid);
    });
  });

  describe('whenInvalid', () => {
    test('calls function for invalid validation and returns original validation', () => {
      const invalid = Validation.invalid('test error');
      const mockFn = vi.fn();
      const result = Validation.whenInvalid(invalid, mockFn);
      
      expect(mockFn).toHaveBeenCalledWith('test error');
      expect(result).toBe(invalid);
    });

    test('does not call function for valid validation', () => {
      const valid = Validation.valid;
      const mockFn = vi.fn();
      const result = Validation.whenInvalid(valid, mockFn);
      
      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBe(valid);
    });

    test('can be chained with other operations', () => {
      const invalid = Validation.invalid('error');
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();
      
      const result = Validation.whenInvalid(
        Validation.whenInvalid(invalid, mockFn1),
        mockFn2
      );
      
      expect(mockFn1).toHaveBeenCalledWith('error');
      expect(mockFn2).toHaveBeenCalledWith('error');
      expect(result).toBe(invalid);
    });
  });

  describe('Type compatibility and usage patterns', () => {
    test('Validation can be used with different error types', () => {
      // String errors
      const stringValidation: Validation<string> = Validation.invalid('error');
      expect(Validation.isInvalid(stringValidation)).toBe(true);
      
      // Error object errors
      const errorValidation: Validation<Error> = Validation.invalid(new Error('error'));
      expect(Validation.isInvalid(errorValidation)).toBe(true);
      
      // Custom error types
      type CustomError = { code: number; message: string };
      const customValidation: Validation<CustomError> = Validation.invalid({ code: 404, message: 'Not found' });
      expect(Validation.isInvalid(customValidation)).toBe(true);
    });

    test('Valid type is compatible across different error types', () => {
      const valid1: Validation<string> = Validation.valid;
      const valid2: Validation<Error> = Validation.valid;
      const valid3: Validation<number> = Validation.valid;
      
      expect(valid1).toBe(valid2);
      expect(valid2).toBe(valid3);
      expect(Validation.isValid(valid1)).toBe(true);
      expect(Validation.isValid(valid2)).toBe(true);
      expect(Validation.isValid(valid3)).toBe(true);
    });

    test('can be used in validation chains', () => {
      const validateNotEmpty = (value: string): Validation<string> =>
        value.length > 0 ? Validation.valid : Validation.invalid('Value cannot be empty');
      
      const validateMinLength = (value: string, min: number): Validation<string> =>
        value.length >= min ? Validation.valid : Validation.invalid(`Value must be at least ${min} characters`);
      
      const validateEmail = (value: string): Validation<string> => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? Validation.valid : Validation.invalid('Invalid email format');
      };
      
      // Test valid email
      const validEmail = 'test@example.com';
      expect(Validation.isValid(validateNotEmpty(validEmail))).toBe(true);
      expect(Validation.isValid(validateMinLength(validEmail, 5))).toBe(true);
      expect(Validation.isValid(validateEmail(validEmail))).toBe(true);
      
      // Test invalid email
      const invalidEmail = 'invalid';
      expect(Validation.isValid(validateNotEmpty(invalidEmail))).toBe(true);
      expect(Validation.isValid(validateMinLength(invalidEmail, 5))).toBe(true);
      expect(Validation.isValid(validateEmail(invalidEmail))).toBe(false);
    });

    test('integrates well with Result type', () => {
      const validation = Validation.invalid('validation error');
      const result = Validation.toResult(validation, 'some value');
      
      expect(Result.isFailure(result)).toBe(true);
      
      // Convert back from Result to Validation
      const backToValidation = Result.toValidation(result);
      expect(Validation.isInvalid(backToValidation)).toBe(true);
      if (Validation.isInvalid(backToValidation)) {
        expect(backToValidation.error).toBe('validation error');
      }
    });
  });

  describe('Practical usage examples', () => {
    test('form validation example', () => {
      interface FormData {
        email: string;
        password: string;
        confirmPassword: string;
      }
      
      const validateForm = (data: FormData): Validation<string[]> => {
        const errors: string[] = [];
        
        // Email validation
        if (!data.email) {
          errors.push('Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.push('Invalid email format');
        }
        
        // Password validation
        if (!data.password) {
          errors.push('Password is required');
        } else if (data.password.length < 8) {
          errors.push('Password must be at least 8 characters');
        }
        
        // Confirm password validation
        if (data.password !== data.confirmPassword) {
          errors.push('Passwords do not match');
        }
        
        return errors.length > 0 ? Validation.invalid(errors) : Validation.valid;
      };
      
      // Valid form
      const validForm: FormData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      const validResult = validateForm(validForm);
      expect(Validation.isValid(validResult)).toBe(true);
      
      // Invalid form
      const invalidForm: FormData = {
        email: 'invalid-email',
        password: '123',
        confirmPassword: '456'
      };
      
      const invalidResult = validateForm(invalidForm);
      expect(Validation.isInvalid(invalidResult)).toBe(true);
      if (Validation.isInvalid(invalidResult)) {
        expect(invalidResult.error).toContain('Invalid email format');
        expect(invalidResult.error).toContain('Password must be at least 8 characters');
        expect(invalidResult.error).toContain('Passwords do not match');
      }
    });

    test('async validation with PromiseValidation', async () => {
      const asyncValidate = async (value: string): Promise<Validation<string>> => {
        // Simulate async validation (e.g., checking if username is available)
        await new Promise(resolve => setTimeout(resolve, 10));
        
        return value === 'taken' 
          ? Validation.invalid('Username is already taken')
          : Validation.valid;
      };
      
      const validResult = await asyncValidate('available');
      expect(Validation.isValid(validResult)).toBe(true);
      
      const invalidResult = await asyncValidate('taken');
      expect(Validation.isInvalid(invalidResult)).toBe(true);
      if (Validation.isInvalid(invalidResult)) {
        expect(invalidResult.error).toBe('Username is already taken');
      }
    });
  });
});
