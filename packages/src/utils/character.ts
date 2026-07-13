export const isLetter = (char: string) => /[a-z]/.test(char);
export const isDigit = (char: string) => /\d/.test(char);
export const isSymbol = (char: string) => !isLetter(char) && !isDigit(char);
