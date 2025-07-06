"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Copy, ExternalLink, Share } from "lucide-react";
import { useCallback } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  fen: string;
  pgn: string;
}

export function ShareButton({ fen, pgn }: ShareButtonProps) {
  const { toast } = useToast();
  const copyToClipboard = useCallback(
    (text: string) => {
      try {
        navigator.clipboard.writeText(text);
        toast({
          title: "복사가 성공했습니다!",
          description: "클립보드로 복사가 성공했습니다.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "복사 중 에러가 발생했습니다.",
          description: `에러: ${error}`,
        });
      }
    },
    [toast],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="">
          <ExternalLink />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>PGN - FEN 공유</DialogTitle>
          <DialogDescription>현재 보드의 상태를 복사하세요.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={fen}
                readOnly
              />
            </div>
            <Button
              onClick={() => copyToClipboard(fen)}
              size="sm"
              className="px-3"
            >
              <span className="sr-only">Copy FEN</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={pgn}
                readOnly
              />
            </div>
            <Button
              onClick={() => copyToClipboard(pgn)}
              size="sm"
              className="px-3"
            >
              <span className="sr-only">Copy PGN</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
