
export interface UsernameFeatures {
  hasNumbers: boolean;
  hasSeparator: boolean;
  separatorCount: number;
}


export interface ParsedUsername {
  original: string;
  normalized: string;
  tokens: string[];
  length: number;
  features: UsernameFeatures;
}


export type NormaliseUsernameFn = (rawInput: string) => string;
export type TokenizeUsernameFn = (username: string) => string[];
export type ParseUsernameFn = (rawInput: string) => ParsedUsername;
