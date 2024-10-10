interface DraggableEventsProps {
  events: { title: string; id: string }[];
}

export function DraggableEvents({ events }: DraggableEventsProps) {
  return (
    <div
      id="draggable-el"
      className="ml-4 col-span-2 w-full p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50"
    >
      <h2 className="font-bold text-lg text-center">Drag Event</h2>
      {events.map((event) => (
        <div
          className="fc-event border-1 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
          title={event.title}
          key={event.id}
          data-event={JSON.stringify({ title: event.title, id: event.id })}
        >
          {event.title}
        </div>
      ))}
    </div>
  );
}
