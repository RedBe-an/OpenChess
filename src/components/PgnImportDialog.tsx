"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Import } from "lucide-react";

interface PgnImportDialogProps {
  onImport: (pgn: string) => boolean;
}

/**
 * PGN 파일을 가져오는 다이얼로그 컴포넌트
 */
const PgnImportDialog: React.FC<PgnImportDialogProps> = ({ onImport }) => {
  const [importedPgn, setImportedPgn] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    if (!importedPgn.trim()) {
      setError("PGN을 입력해주세요.");
      return;
    }

    const success = onImport(importedPgn.trim());

    if (success) {
      setImportedPgn("");
      setError(null);
      setIsOpen(false);
    } else {
      setError("올바른 PGN 형식이 아닙니다.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportedPgn(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setImportedPgn("");
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="PGN 가져오기">
          <Import />
        </Button>
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
                placeholder="PGN을 입력하세요..."
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={importedPgn}
                onChange={handleInputChange}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleImport}>불러오기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PgnImportDialog;
