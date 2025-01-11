import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Import } from "lucide-react";
import { useState } from "react";
import { useChessGame } from "@/hooks/useChessGame";

export function ImportPGN() {
  const [pgn, setPgn] = useState("");


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Import /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>PGN 불러오기</DialogTitle>
          <DialogDescription>
            아래의 입력창에 PGN을 붙여넣어주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                id="pgn"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={pgn}
                onChange={(e) => setPgn(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button>불러오기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
