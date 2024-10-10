import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export interface Lesson {
  id: number;
  name: string;
  dateStart: string;
  dateEnd: string;
  classID?: number;
}

export default function CalendarTest() {
  const calendarRef = useRef<FullCalendar>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Lesson>({
    id: 0,
    name: "",
    dateStart: "",
    dateEnd: "",
  });
  const [events, setEvents] = useState<Lesson[]>([]);
  const [userClassId, setUserClassId] = useState(null);
  const [role, setRole] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClassId = async () => {
      try {
        const response = await fetch("/api/getClassIdByToken");
        if (response.ok) {
          const data = await response.json();
          console.log(data, 'DATA');
          setRole(data.user.role)
          setUserClassId(data.user.classId);
        } else {
          console.error("Error fetching classId");
        }
      } catch (error) {
        console.error("Error fetching classId", error);
      }
    };

    fetchClassId();
  }, []);

  useEffect(() => {
    if (userClassId) {
      const fetchLessons = async () => {
        try {
          const response = await fetch(`/api/lessons?classId=${userClassId}`);
          if (response.ok) {
            const data: Lesson[] = await response.json();
            setEvents(data);
          } else {
            console.error("Error fetching lessons");
          }
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      };

      fetchLessons();
    }
  }, [userClassId]);

  const handleDateClick = (arg: { dateStr: string }) => {
    setNewEvent({
      ...newEvent,
      dateStart: new Date(arg.dateStr).toISOString(),
      dateEnd: new Date(
        new Date(arg.dateStr).getTime() + 60 * 60 * 1000,
      ).toISOString(), // Add 1 hour by default
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addLesson(newEvent);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const addLesson = async (lesson: Lesson) => {
    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lesson),
      });

      if (!response.ok) {
        throw new Error("Error adding lesson");
      }
      toast({
        title: "Course added successfully",
        className: "bg-green-400",
        duration: 2000,
      });

      const createdLesson = await response.json();

      if (calendarRef.current) {
        calendarRef.current.getApi().addEvent({
          title: createdLesson.name,
          start: createdLesson.dateStart,
          end: createdLesson.dateEnd,
        });
      }

      setEvents((prevEvents) => [...prevEvents, createdLesson]);
    } catch (error) {
      console.error(error);
      alert("Failed to add lesson. Please try again.");
    }
  };

  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return ""; // Prevent formatting invalid dates
    return new Date(dateString)
      .toLocaleString("sv-SE", {
        timeZone: "Europe/Paris",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .slice(0, 16); // For datetime-local, we need YYYY-MM-DDTHH:mm format
  };

  return (
    // <div className="w-full sm:w-2/5 md:w-3/5 lg:w-4/5 h-[70vh] sm:h-[80vh] lg:h-[90vh] mx-auto  mb-5 p-6">
    <>
      <FullCalendar
        height={750}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        timeZone="Europe/Paris"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: false,
        }}
        locale="en-GB"
        dateClick={handleDateClick}
        ref={calendarRef}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          title: event.name,
          start: new Date(event.dateStart).toISOString(),
          end: new Date(event.dateEnd).toISOString(),
        }))}
      />
      {showModal && role === "TEACHER" && (
        <div className="modal flex flex-col justify-center items-center mb-32">
          <form
            onSubmit={handleModalSubmit}
            className="flex flex-col justify-center items-center"
          >
            <input
              type="text"
              placeholder="Lesson Name"
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
              required
            />
            <input
              type="datetime-local"
              value={formatDateTimeLocal(newEvent.dateStart)}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  dateStart: new Date(e.target.value).toISOString(),
                })
              }
              required
            />
            <input
              type="datetime-local"
              value={formatDateTimeLocal(newEvent.dateEnd)}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  dateEnd: new Date(e.target.value).toISOString(),
                })
              }
              required
            />
            <button type="submit">Add Lesson</button>
            <button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
}
