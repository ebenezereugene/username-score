// normalizers/leetspeak.ts

export const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "2": "z",
  "3": "e",
  "4": "a",
  "5": "s",
  "6": "g",
  "7": "t",
  "8": "b",
  "9": "g",
};

export function decodeLeetspeak(text: string): string {
  return text
    .split("")
    .map((char) => LEET_MAP[char] ?? char)
    .join("");
}
