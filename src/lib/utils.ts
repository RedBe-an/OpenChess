import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizeFileName = (name: string): string => {
  return name
    .toLowerCase()
    // 공백을 하이픈으로 변환
    .replace(/\s+/g, '-')
    // 알파벳, 숫자, 하이픈을 제외한 모든 문자 제거
    .replace(/[^a-z0-9-]/g, '');
};