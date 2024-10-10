import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  eventIdToDelete: number | null;
  eventTitle: string | undefined;
}

export function DeleteDialog({
  open,
  onClose,
  onDelete,
  eventIdToDelete,
  eventTitle,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the event "{eventTitle}"?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="destructive" onClick={onDelete}>
            <ExclamationTriangleIcon
              className="h-3.5 w-3.5 text-white mr-2"
              aria-hidden="true"
            />
            Delete
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
