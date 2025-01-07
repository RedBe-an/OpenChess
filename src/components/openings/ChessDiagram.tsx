interface PieceProps {
  piece: {
    type: "p" | "n" | "b" | "r" | "q" | "k";
    color: "w" | "b";
  } | null;
}

const pieceImages = {
  p: { b: "black/bp.png", w: "white/wp.png" },
  n: { b: "black/bn.png", w: "white/wn.png" },
  b: { b: "black/bb.png", w: "white/wb.png" },
  r: { b: "black/br.png", w: "white/wr.png" },
  q: { b: "black/bq.png", w: "white/wq.png" },
  k: { b: "black/bk.png", w: "white/wk.png" },
};

const ChessPiece = ({ piece }: PieceProps) => {
  if (!piece) return null;
  const imagePath = `/pieces/${pieceImages[piece.type][piece.color]}`;

  return (
    <div className="absolute flex items-center justify-center h-full w-full">
      <img
        src={imagePath}
        alt={`${piece.color === "w" ? "White" : "Black"} ${piece.type.toUpperCase()}`}
        className="object-contain p-1"
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        aspectRatio: "1",
        width: "100%",
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
  );
}
