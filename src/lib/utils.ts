import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 조건부로 병합하는 유틸리티 함수
 * @param inputs - 병합할 클래스 값들
 * @returns 병합된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 파일명을 URL 친화적으로 정규화하는 함수
 * @param name - 정규화할 이름
 * @returns URL 친화적인 파일명
 */
export function normalizeFileName(name: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  // 유니코드 정규화 (NFD 형식으로 분해)
  const normalized = name.normalize("NFD");

  // 결합 문자 제거 (악센트 등)
  const asciiText = Array.from(normalized)
    .filter((char) => !char.match(/[\u0300-\u036f]/))
    .join("");

  // 특수문자 제거 (하이픈은 유지)
  const cleanedText = asciiText.replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s-]/g, "");

  // 소문자 변환 및 공백을 하이픈으로 치환
  return cleanedText
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/\t+/g, "-")
    .replace(/\n+/g, "-")
    .replace(/-+/g, "-") // 연속 하이픈 제거
    .replace(/^-|-$/g, ""); // 시작과 끝 하이픈 제거
}

/**
 * 딜레이를 만드는 Promise 기반 함수
 * @param ms - 딜레이할 밀리초
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 객체가 비어있는지 확인하는 함수
 * @param obj - 확인할 객체
 * @returns 비어있으면 true
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * 문자열을 지정된 길이로 자르고 생략부호를 추가하는 함수
 * @param text - 자를 문자열
 * @param maxLength - 최대 길이
 * @param suffix - 생략부호 (기본값: "...")
 * @returns 잘린 문자열
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = "...",
): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 배열을 지정된 크기의 청크로 나누는 함수
 * @param array - 나눌 배열
 * @param size - 청크 크기
 * @returns 청크로 나뉜 배열
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];

  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
