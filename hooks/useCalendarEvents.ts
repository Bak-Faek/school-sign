import { useState, useEffect } from "react";
import { Draggable, DropArg } from "@fullcalendar/interaction";
import { Event } from "@/components/calendar/types";

export function useCalendarEvents() {
  const [events, setEvents] = useState([
    { title: "event 1", id: 1 },
    { title: "event 2", id: 2 },
    { title: "event 3", id: 3 },
    { title: "event 4", id: 4 },
    { title: "event 5", id: 5 },
  ]);

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "New Lesson",
    date: new Date(),
    allDay: false,
    id: 0,
  });

  useEffect(() => {
    let draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      const draggable = new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData(eventEl) {
          let title = eventEl.getAttribute("title");
          let date = eventEl.getAttribute("date");
          let id = eventEl.getAttribute("data-event");
          return { title, date, id };
        },
      });
      return () => draggable.destroy();
    }
  }, []);

  const handleDateClick = (arg: {
    title: string;
    date: Date;
    allDay: boolean;
  }) => {
    setNewEvent({
      ...newEvent,
      title: arg.title,
      date: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
    });
    setShowModal(true);
  };

  const addEvent = (data: DropArg) => {
    const event = {
      ...newEvent,
      title: data.draggedEl.innerText,
      date: data.date, // .toISOString()
      allDay: data.allDay,
      id: new Date().getTime(),
    };
    console.log("event: ", event);
    console.log("allEvents: ", allEvents);
    setAllEvents([...allEvents, event]);
  };

  const handleDeleteModal = (data: { event: { id: string } }) => {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  };

  const handleDelete = () => {
    setAllEvents(
      allEvents.filter((event) => Number(event.id) !== Number(idToDelete)),
    );
    setShowDeleteModal(false);
    setIdToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // setNewEvent({
    //   title: "",
    //   date: new Date(),
    //   allDay: false,
    //   id: 0,
    // });
    setShowDeleteModal(false);
    setIdToDelete(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
    setShowModal(false);
    setNewEvent({
      title: "",
      date: new Date(),
      allDay: false,
      id: 0,
    });
  };

  const onEventUpdate = (updatedEvent: Event) => {
    setAllEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  return {
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
    handleChange,
    handleCloseModal,
    handleSubmit,
    onEventUpdate,
  };
}
