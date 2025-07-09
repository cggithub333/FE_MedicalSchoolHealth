
// PASSWORD VALIDATION: at least 8 characters, maximum 30 characters, at lease one uppercase, one lowercase, one number, and one special character
// for example: "haicuong@123A"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
const atLeastOneUppercase = /[A-Z]/;
const atLeastOneLowercase = /[a-z]/;
const atLeastOneNumber = /\d/;
const atLeastOneSpecialCharacter = /[@$!%*?&]/;
const minLength = 8;
const maxLength = 30;

export const passwordValidation = (password) => {
  if (!password)
    return { isValid: false, message: "Password is required" };
  if (password.length < minLength || password.length > maxLength)
    return { isValid: false, message: `Password must be between ${minLength} and ${maxLength} characters` };
  if (!atLeastOneLowercase.test(password))
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  if (!atLeastOneUppercase.test(password))
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  if (!atLeastOneNumber.test(password))
    return { isValid: false, message: "Password must contain at least one number" };
  if (!atLeastOneSpecialCharacter.test(password))
    return { isValid: false, message: "Password must contain at least one special character" };
  //else:
  return { isValid: true, message: "Password is valid" };
}