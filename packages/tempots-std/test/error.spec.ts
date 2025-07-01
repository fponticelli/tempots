import { describe, expect, test } from "vitest";
import {
  AbortError,
  MissingImplementationError,
  ParsingError,
  ArgumentError,
} from '../src/error';

describe('Error classes', () => {
  describe('AbortError', () => {
    test('creates error with default message', () => {
      const error = new AbortError();

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AbortError);
      expect(error.name).toBe('AbortError');
      expect(error.message).toBe('Operation aborted');
    });

    test('creates error with custom message', () => {
      const customMessage = 'Custom abort message';
      const error = new AbortError(customMessage);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AbortError);
      expect(error.name).toBe('AbortError');
      expect(error.message).toBe(customMessage);
    });

    test('can be thrown and caught', () => {
      expect(() => {
        throw new AbortError('Test abort');
      }).toThrow(AbortError);

      expect(() => {
        throw new AbortError('Test abort');
      }).toThrow('Test abort');
    });

    test('has correct stack trace', () => {
      const error = new AbortError('Test error');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('AbortError');
    });

    test('instanceof checks work correctly', () => {
      const error = new AbortError();

      expect(error instanceof Error).toBe(true);
      expect(error instanceof AbortError).toBe(true);
      expect(error instanceof MissingImplementationError).toBe(false);
      expect(error instanceof ParsingError).toBe(false);
      expect(error instanceof ArgumentError).toBe(false);
    });
  });

  describe('MissingImplementationError', () => {
    test('creates error with default message', () => {
      const error = new MissingImplementationError();

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(MissingImplementationError);
      expect(error.name).toBe('MissingImplementationError');
      expect(error.message).toBe('Missing implementation');
    });

    test('creates error with custom message', () => {
      const customMessage = 'Feature not implemented yet';
      const error = new MissingImplementationError(customMessage);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(MissingImplementationError);
      expect(error.name).toBe('MissingImplementationError');
      expect(error.message).toBe(customMessage);
    });

    test('can be thrown and caught', () => {
      expect(() => {
        throw new MissingImplementationError('Not implemented');
      }).toThrow(MissingImplementationError);

      expect(() => {
        throw new MissingImplementationError('Not implemented');
      }).toThrow('Not implemented');
    });

    test('has correct stack trace', () => {
      const error = new MissingImplementationError('Test error');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('MissingImplementationError');
    });

    test('instanceof checks work correctly', () => {
      const error = new MissingImplementationError();

      expect(error instanceof Error).toBe(true);
      expect(error instanceof MissingImplementationError).toBe(true);
      expect(error instanceof AbortError).toBe(false);
      expect(error instanceof ParsingError).toBe(false);
      expect(error instanceof ArgumentError).toBe(false);
    });
  });

  describe('ParsingError', () => {
    test('creates error with required message', () => {
      const message = 'Failed to parse input';
      const error = new ParsingError(message);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ParsingError);
      expect(error.name).toBe('ParsingError');
      expect(error.message).toBe(message);
    });

    test('can be thrown and caught', () => {
      expect(() => {
        throw new ParsingError('Invalid JSON');
      }).toThrow(ParsingError);

      expect(() => {
        throw new ParsingError('Invalid JSON');
      }).toThrow('Invalid JSON');
    });

    test('has correct stack trace', () => {
      const error = new ParsingError('Test parsing error');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ParsingError');
    });

    test('instanceof checks work correctly', () => {
      const error = new ParsingError('Test message');

      expect(error instanceof Error).toBe(true);
      expect(error instanceof ParsingError).toBe(true);
      expect(error instanceof AbortError).toBe(false);
      expect(error instanceof MissingImplementationError).toBe(false);
      expect(error instanceof ArgumentError).toBe(false);
    });

    test('works with different message types', () => {
      const stringMessage = 'String error';
      const numberMessage = '123';
      const complexMessage = 'Error at line 5, column 10: unexpected token';

      expect(new ParsingError(stringMessage).message).toBe(stringMessage);
      expect(new ParsingError(numberMessage).message).toBe(numberMessage);
      expect(new ParsingError(complexMessage).message).toBe(complexMessage);
    });
  });

  describe('ArgumentError', () => {
    test('creates error with required message', () => {
      const message = 'Invalid argument provided';
      const error = new ArgumentError(message);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ArgumentError);
      expect(error.name).toBe('ArgumentError');
      expect(error.message).toBe(message);
    });

    test('can be thrown and caught', () => {
      expect(() => {
        throw new ArgumentError('Argument must be positive');
      }).toThrow(ArgumentError);

      expect(() => {
        throw new ArgumentError('Argument must be positive');
      }).toThrow('Argument must be positive');
    });

    test('has correct stack trace', () => {
      const error = new ArgumentError('Test argument error');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ArgumentError');
    });

    test('instanceof checks work correctly', () => {
      const error = new ArgumentError('Test message');

      expect(error instanceof Error).toBe(true);
      expect(error instanceof ArgumentError).toBe(true);
      expect(error instanceof AbortError).toBe(false);
      expect(error instanceof MissingImplementationError).toBe(false);
      expect(error instanceof ParsingError).toBe(false);
    });

    test('works with different message types', () => {
      const stringMessage = 'Invalid string argument';
      const numberMessage = 'Expected number, got string';
      const complexMessage = 'Argument "count" must be between 1 and 100, got -5';

      expect(new ArgumentError(stringMessage).message).toBe(stringMessage);
      expect(new ArgumentError(numberMessage).message).toBe(numberMessage);
      expect(new ArgumentError(complexMessage).message).toBe(complexMessage);
    });
  });

  describe('Error inheritance and polymorphism', () => {
    test('all custom errors are instances of Error', () => {
      const errors = [
        new AbortError(),
        new MissingImplementationError(),
        new ParsingError('test'),
        new ArgumentError('test'),
      ];

      errors.forEach(error => {
        expect(error instanceof Error).toBe(true);
      });
    });

    test('errors can be caught as generic Error', () => {
      const errors = [
        new AbortError('abort'),
        new MissingImplementationError('missing'),
        new ParsingError('parsing'),
        new ArgumentError('argument'),
      ];

      errors.forEach(error => {
        try {
          throw error;
        } catch (e) {
          expect(e instanceof Error).toBe(true);
          expect(e).toBe(error);
        }
      });
    });

    test('errors can be distinguished by name property', () => {
      const errors = [
        { error: new AbortError(), expectedName: 'AbortError' },
        { error: new MissingImplementationError(), expectedName: 'MissingImplementationError' },
        { error: new ParsingError('test'), expectedName: 'ParsingError' },
        { error: new ArgumentError('test'), expectedName: 'ArgumentError' },
      ];

      errors.forEach(({ error, expectedName }) => {
        expect(error.name).toBe(expectedName);
      });
    });

    test('errors can be distinguished by instanceof', () => {
      const abortError = new AbortError();
      const missingError = new MissingImplementationError();
      const parsingError = new ParsingError('test');
      const argumentError = new ArgumentError('test');

      // Test specific instanceof checks
      expect(abortError instanceof AbortError).toBe(true);
      expect(missingError instanceof MissingImplementationError).toBe(true);
      expect(parsingError instanceof ParsingError).toBe(true);
      expect(argumentError instanceof ArgumentError).toBe(true);

      // Test cross-type instanceof checks (should be false)
      expect(abortError instanceof MissingImplementationError).toBe(false);
      expect(missingError instanceof ParsingError).toBe(false);
      expect(parsingError instanceof ArgumentError).toBe(false);
      expect(argumentError instanceof AbortError).toBe(false);
    });
  });

  describe('Error serialization and JSON', () => {
    test('errors can be converted to string', () => {
      const error = new ParsingError('Test parsing error');
      const errorString = error.toString();

      expect(errorString).toContain('ParsingError');
      expect(errorString).toContain('Test parsing error');
    });

    test('errors have enumerable properties for serialization', () => {
      const errors = [
        new AbortError('Custom abort'),
        new MissingImplementationError('Custom missing'),
        new ParsingError('Custom parsing'),
        new ArgumentError('Custom argument'),
      ];

      errors.forEach(error => {
        // Error objects don't serialize message/name by default in JSON.stringify
        // But we can access the properties directly
        expect(error.message).toBeDefined();
        expect(error.name).toBeDefined();

        // Test that we can manually create a serializable object
        const serializable = {
          name: error.name,
          message: error.message,
          stack: error.stack
        };

        const serialized = JSON.parse(JSON.stringify(serializable));
        expect(serialized.message).toBe(error.message);
        expect(serialized.name).toBe(error.name);
      });
    });
  });
});
