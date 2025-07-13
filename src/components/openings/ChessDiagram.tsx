import Image from "next/image";

interface PieceProps {
  piece: {
    type: "p" | "n" | "b" | "r" | "q" | "k";
    color: "w" | "b";
  } | null;
}

const pieceImages = {
  p: { b: "black/bp.svg", w: "white/wp.svg" },
  n: { b: "black/bn.svg", w: "white/wn.svg" },
  b: { b: "black/bb.svg", w: "white/wb.svg" },
  r: { b: "black/br.svg", w: "white/wr.svg" },
  q: { b: "black/bq.svg", w: "white/wq.svg" },
  k: { b: "black/bk.svg", w: "white/wk.svg" },
};

const ChessPiece = ({ piece }: PieceProps) => {
  if (!piece) return null;
  const imagePath = `/pieces/${pieceImages[piece.type][piece.color]}`;

  return (
    <div className="absolute flex items-center justify-center h-full w-full">
      <Image
        src={imagePath}
        alt={`${piece.color === "w" ? "White" : "Black"} ${piece.type.toUpperCase()}`}
        className="object-contain p-0.5"
        width={45}
        height={45}
        loading="lazy"
      />
    </div>
  );
};

export default function ChessDiagram({ position }: { position: string }) {
  const rows = position
    .trim()
    .split("\n")
    .map((row) => row.trim());

  const getPiece = (
    char: string,
  ): { type: "p" | "n" | "b" | "r" | "q" | "k"; color: "w" | "b" } | null => {
    if (char === ".") return null;
    const lowerChar = char.toLowerCase() as "p" | "n" | "b" | "r" | "q" | "k";
    if (!["p", "n", "b", "r", "q", "k"].includes(lowerChar)) return null;
    const isWhite = char === char.toUpperCase();
    return {
      type: lowerChar,
      color: isWhite ? "w" : ("b" as const),
    };
  };

  return (
    <div className="flex justify-start">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          aspectRatio: "1",
          width: "50%",
          maxWidth: "400px",
        }}
      >
        {rows.map((row, i) =>
          row.split("").map((char, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                aspectRatio: "1",
                backgroundColor: (i + j) % 2 === 0 ? "#EBECD0" : "#739552",
                position: "relative",
              }}
            >
              <ChessPiece piece={getPiece(char)} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
