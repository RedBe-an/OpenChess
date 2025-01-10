import * as fs from "fs";
import * as path from "path";

function namuIt(input: string): string {
  // 변환 규칙 정의
  const rules: {
    regex: RegExp;
    replacement: string | ((...args: any[]) => string);
  }[] = [
    // 문단
    {
      regex: /^(=+)\s*(.+?)\s*\1$/gm,
      replacement: (_, level: string, title: string) =>
        "#".repeat(level.length) + " " + title.trim(),
    },

    // 리스트
    {
      regex: /^\*\s+(.*)$/gm,
      replacement: (_, item: string) => "- " + item.trim(),
    },
    {
      regex: /^\s*\*\s+(.*)$/gm,
      replacement: (_, item: string) => "  - " + item.trim(),
    }, // 하위 리스트

    // 강조
    {
      regex: /'''(.*?)'''/g,
      replacement: (_, text: string) => "**" + text + "**",
    }, // 굵게
    { regex: /''(.*?)''/g, replacement: (_, text: string) => "*" + text + "*" }, // 기울임
    {
      regex: /__(.*?)__/g,
      replacement: (_, text: string) => "<u>" + text + "</u>",
    }, // 밑줄
    {
      regex: /~~(.*?)~~/g,
      replacement: (_, text: string) => "~~" + text + "~~",
    }, // 취소선

    // 하이퍼링크
    {
      regex: /\[\[(.*?)\|?(.*?)\]\]/g,
      replacement: (_, link: string, text: string) =>
        `[${text || link}](https://namu.wiki/w/${encodeURIComponent(link)})`,
    },

    // 외부 링크
    {
      regex: /\[\[(https?:\/\/[^\s]+)\|?(.*?)\]\]/g,
      replacement: (_, url: string, text: string) => `[${text || url}](${url})`,
    },

    // 이미지
    {
      regex: /\[\[파일:(.*?)\]\]/g,
      replacement: (_, filename: string) =>
        `![${filename}](https://namu.wiki/w/파일:${encodeURIComponent(filename)})`,
    },

    // 동영상
    {
      regex: /\[\[youtube\((.*?)\)\]\]/g,
      replacement: (_, id: string) => `https://www.youtube.com/watch?v=${id}`,
    },

    // 표
    { regex: /\|\|/g, replacement: "|" }, // 표의 셀 구분
    { regex: /(\|.*?)(\n\|)/g, replacement: "$1$2\n" }, // 줄 바꿈 처리
  ];

  // 변환 적용
  let output = input;
  for (const rule of rules) {
    output = output.replace(rule.regex, (match, ...args) => {
      const replacement = rule.replacement;
      return typeof replacement === "function"
        ? replacement(match, ...args)
        : replacement;
    });
  }

  return output;
}

// openings 폴더의 모든 .namu 파일을 읽어서 변환한 결과를 각각의 .mdx 파일에 쓰기
const inputDir = "openings";
const outputDir = "openings"; // 출력 디렉토리도 openings로 설정

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error("디렉토리 읽기 오류:", err);
    return;
  }

  files.forEach((file) => {
    if (file.endsWith(".namu")) {
      const inputFilePath = path.join(inputDir, file);
      const outputFilePath = path.join(
        outputDir,
        file.replace(/\.namu$/, ".mdx"),
      );

      fs.readFile(inputFilePath, "utf8", (err, data) => {
        if (err) {
          console.error(`파일 읽기 오류 (${inputFilePath}):`, err);
          return;
        }

        const convertedData = namuIt(data);

        fs.writeFile(outputFilePath, convertedData, "utf8", (err) => {
          if (err) {
            console.error(`파일 쓰기 오류 (${outputFilePath}):`, err);
          } else {
            console.log(`변환 완료: ${inputFilePath} -> ${outputFilePath}`);

            fs.unlink(inputFilePath, (err) => {
              if (err) {
                console.error(`파일 삭제 오류 (${inputFilePath}):`, err);
              } else {
                console.log(`원본 파일 삭제 완료: ${inputFilePath}`);
              }
            });
          }
        });
      });
    }
  });
});
