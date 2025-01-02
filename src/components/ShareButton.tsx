import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Copy } from "lucide-react"
import { useCallback } from "react"
import { DialogTrigger } from "@radix-ui/react-dialog"

interface ShareButtonProps {
  fen: string
  pgn: string
}

export function ShareButton({ fen, pgn }: ShareButtonProps) {
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">공유</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게임 공유</DialogTitle>
          <DialogDescription>현재 게임 상태를 복사하세요.</DialogDescription>
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
            <Button onClick={() => copyToClipboard(fen)} size="sm" className="px-3">
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
            <Button onClick={() => copyToClipboard(pgn)} size="sm" className="px-3">
              <span className="sr-only">Copy PGN</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}