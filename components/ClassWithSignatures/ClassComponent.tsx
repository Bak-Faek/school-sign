interface ClassHeaderProps {
  className: string | null;
  lessonName: string | null;
  startHour: string | null;
  endHour: string | null;
  classId: number | null;
}

export default function ClassComponent({
  className,
  lessonName,
  startHour,
  endHour,
  classId,
}: ClassHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-10">
      <h2 className="text-center text-xl font-semibold mb-2">
        {className ? `Class : ${className}` : "Unknown class"}
      </h2>
      <h3
        className="text-xl 
         mb-1"
      >
        {lessonName ? `Course : ${lessonName}` : "Unknown lesson"}
      </h3>
      {startHour ? `${startHour}` : "Unknown"} -{" "}
      {endHour ? `${endHour}` : "Unknown"}
    </div>
  );
}
