import * as fs from "fs";
import * as path from "path";

interface ChessBoard {
  position: string[][];
  caption: string;
}

function parseChessPosition(inputText: string): string {
  const lines: string[] = inputText.split("\n").map((line) => line.trim());
  const board: string[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill("-"));

  let caption: string = "";
  lines.forEach((line) => {
    if (line.includes("caption=")) {
      caption = line.split("caption=")[1].replace(")]", "");
    }
  });

  lines.forEach((line) => {
    if (line.includes("=") && !line.includes("caption=")) {
      const positions: string[] = line.trim().replace(/,$/, "").split(",");

      positions.forEach((pos) => {
        if (!pos.includes("=")) return;

        const parts: string[] = pos.split("=");
        if (parts.length !== 2) return;

        const [square, piece] = parts.map((p) => p.trim());
        if (!piece || square.length !== 2) return;

        if (!/^[a-h][1-8]$/.test(square)) return;

        const file: number = square.charCodeAt(0) - "a".charCodeAt(0);
        const rank: number = 8 - parseInt(square[1]);

        if (piece === "") return;

        const pieceType: string = piece[0];
        const color: string = piece[1];

        let symbol: string = "";
        switch (pieceType) {
          case "R":
            symbol = "r";
            break;
          case "N":
            symbol = "n";
            break;
          case "B":
            symbol = "b";
            break;
          case "Q":
            symbol = "q";
            break;
          case "K":
            symbol = "k";
            break;
          case "P":
            symbol = "p";
            break;
          default:
            return;
        }

        if (color === "w") {
          symbol = symbol.toUpperCase();
        }

        board[rank][file] = symbol;
      });
    }
  });

  const position: string = board
    .map((row) => row.join(""))
    .join("\n           ");

  return `<ChessDiagram\n  position="${position}"\n/>\n**${caption}**\n`;
}

function namuIt(input: string): string {
  const rules: {
    regex: RegExp;
    replacement: string | ((...args: any[]) => string);
  }[] = [
    {
      regex: /^(=+)\s*(.+?)\s*\1$/gm,
      replacement: (_, level: string, title: string) =>
        "#".repeat(level.length) + " " + title.trim(),
    },
    {
      regex: /^\*\s+(.*)$/gm,
      replacement: (_, item: string) => "- " + item.trim(),
    },
    {
      regex: /^\s*\*\s+(.*)$/gm,
      replacement: (_, item: string) => "  - " + item.trim(),
    },
    {
      regex: /'''(.*?)'''/g,
      replacement: (_, text: string) => "**" + text + "**",
    },
    { regex: /''(.*?)''/g, replacement: (_, text: string) => "*" + text + "*" },
    {
      regex: /__(.*?)__/g,
      replacement: (_, text: string) => "<u>" + text + "</u>",
    },
    {
      regex: /~~(.*?)~~/g,
      replacement: (_, text: string) => "~~" + text + "~~",
    },
    {
      regex: /\[\[(.*?)\|?(.*?)\]\]/g,
      replacement: (_, link: string, text: string) =>
        `[${text || link}](https://namu.wiki/w/${encodeURIComponent(link || text)})`,
    },
    {
      regex: /\[\[(https?:\/\/[^\s]+)\|?(.*?)\]\]/g,
      replacement: (_, url: string, text: string) => `[${text || url}](${url})`,
    },
    {
      regex: /\[\[파일:(.*?)\]\]/g,
      replacement: (_, filename: string) =>
        `![${filename}](https://namu.wiki/w/파일:${encodeURIComponent(filename)})`,
    },
    {
      regex: /\[\[youtube\((.*?)\)\]\]/g,
      replacement: (_, id: string) => `https://www.youtube.com/watch?v=${id}`,
    },
    { regex: /\|\|/g, replacement: "|" },
    { regex: /(\|.*?)(\n\|)/g, replacement: "$1$2\n" },
    {
      regex: /\[include\(틀:체스게임[^)]+\)\]/gs,
      replacement: (match) => parseChessPosition(match),
    },
  ];

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

const inputDir = "openings";
const outputDir = "openings";

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
        file.replace(/\.namu$/, ".mdx")
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
