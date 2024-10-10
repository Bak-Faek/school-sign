import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calendarFormSchema } from "@/lib/schemas/calendarFormSchema";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarFormValues,
  EventDialogProps,
} from "@/components/calendar/types";
import { toast } from "@/hooks/use-toast";

export function EventDialog({
  event,
  open,
  onClose,
  onEventUpdate,
}: EventDialogProps) {
  const defaultValues: Partial<CalendarFormValues> = {
    title: event.title || "",
    date: new Date(event.date),
  };
  const form = useForm<CalendarFormValues>({
    resolver: zodResolver(calendarFormSchema),
    defaultValues,
  });
  // console.log(form);

  const onSubmit = (data: CalendarFormValues) => {
    const updatedEvent = {
      ...event,
      title: data.title,
      date: new Date(data.date), // format(new Date(data.date), "yyyy-MM-dd HH:mm:ss"),
      allDay: event.allDay,
    };
    onEventUpdate(updatedEvent);

    toast({
      title: "Event updated",
      description: `Event ${data.title} updated successfully!`,
    });
    console.log("updatedEvent: ", updatedEvent);

    onClose();

    // MySQL datetime: 9999-12-31 23:59:59
    //   
    // data.date.toDateString() Outputs: Tue Sep 17 2024
    // getUTCDate() or getDate() Outputs: 17
    // toLocaleString() Outputs: 9/17/2024, 5:19:55 PM
    // toLocaleDateString() Outputs: 9/17/2024
    // toISOString() Outputs: 2024-09-17T15:14:34.810Z

    // console.log(": ", data.date.toLocaleString());
    // const formatDateFNS = format(new Date(), "yyyy-MM-dd HH-mm-ss");
    // console.log(formatDateFNS);

    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  };

  // useEffect(() => {
  //   if (event) {
  //     form.reset({
  //       title: event.title,
  //       date: event.date, // format(new Date(event.date), "yyyy-MM-dd HH:mm:ss")
  //     });
  //   }
  // }, [event, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  {/*<FormControl>*/}
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Title"
                    {...field}
                  />
                  {/*</FormControl>*/}
                  <FormDescription>This is the class name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd HH:mm:ss") // format(new Date(field.value), "yyyy-MM-dd HH:mm:ss")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>This is the class date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  !form.watch("title") || !(form.watch("date") instanceof Date)
                }
              >
                Create
              </Button>
              <Button type="reset" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
