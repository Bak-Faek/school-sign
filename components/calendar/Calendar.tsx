import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventDialog } from "./EventDialog";
import { DeleteDialog } from "./DeleteDialog";
import { DraggableEvents } from "./DraggableEvents";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

export default function Calendar() {
  const {
    events,
    allEvents,
    showModal,
    showDeleteModal,
    idToDelete,
    newEvent,
    handleDateClick,
    addEvent,
    handleDeleteModal,
    handleDelete,
    handleCloseModal,
    onEventUpdate,
  } = useCalendarEvents();
  console.log(onEventUpdate);

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between p-10">
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "resourceTimelineWeek, dayGridMonth, timeGridWeek",
              }}
              events={allEvents}
              eventDisplay="auto"
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
            />
          </div>
          <DraggableEvents events={events} />
        </div>

        <DeleteDialog
          open={showDeleteModal}
          onClose={handleCloseModal}
          onDelete={handleDelete}
          eventIdToDelete={idToDelete}
          eventTitle={allEvents.find((e) => e.id === idToDelete)?.title}
        />

        <EventDialog
          event={newEvent}
          open={showModal}
          onClose={handleCloseModal}
          onEventUpdate={onEventUpdate}
        />
      </div>
    </>
  );
}
