export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

export type Piece = {
  type: PieceType;
  color: "b" | "w";
};

export type Board = (Piece | null)[][];

export interface OpeningInfo {
  eco?: string;
  name?: string;
  urlName?: string;
  pgn?: string;
  mdx?: string;
}

export interface topGames {
  uci: string;
  id: string;
  white: { name: string; rating: number };
  black: { name: string; rating: number };
  winner?: "white" | "black" | "draw";
  year: number;
  month: string;
}
