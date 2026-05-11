import validator from "validator";

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 6 characters
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const sanitizeInput = (input: string): string => {
  return input.trim();
};

export const validateRequestBody = (
  data: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; error?: string } => {
  for (const field of requiredFields) {
    if (!data[field]) {
      return { valid: false, error: `${field} is required` };
    }
  }
  return { valid: true };
};
