import { ValidationError } from '@nestjs/common';

interface CustomError {
  field: string;
  message: string;
  in: string;
}

interface ValidationErrors {
  error: string;
  data: CustomError[];
}

// Convert validation error message array to key-value pair object
export function errorConverter(errors: ValidationError[]): ValidationErrors {
  // Helper function to convert a single validation error to CustomError
  function convertValidationError(error: ValidationError): CustomError[] {
    if (error.constraints) {
      const constraintKey = Object.keys(error.constraints)[0];
      const message = `${error.constraints[constraintKey]}`;

      return [
        {
          field: error.property,
          message,
          in: 'body',
        },
      ];
    } else if (error.children) {
      // Handle nested validation errors
      const nestedErrors: CustomError[] = [];
      for (const childError of error.children) {
        nestedErrors.push(...convertValidationError(childError));
      }

      return nestedErrors;
    } else {
      // Handle other types of errors if needed
      return [
        {
          field: error.property,
          message: 'Unknown error',
          in: 'body',
        },
      ];
    }
  }

  const customErrors: CustomError[] = [];

  for (const error of errors) {
    customErrors.push(...convertValidationError(error));
  }

  return { data: customErrors, error: 'Validation error' };
}
