import { z } from "zod";
import { calendarFormSchema } from "@/lib/schemas/calendarFormSchema";

export interface Event {
  title: string;
  date: Date;
  allDay: boolean;
  id: number;
}

export interface EventDialogProps {
  event: Event;
  open: boolean;
  onClose: () => void;
  // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEventUpdate: (updatedEvent: Event) => void;
  // onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export type CalendarFormValues = z.infer<typeof calendarFormSchema>;
