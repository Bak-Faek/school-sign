"use client"

import React, { useEffect, useState } from "react";

// Fonction pour obtenir la date actuelle
const getCurrentDate = (): string => {
  const now = new Date();
  return now.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Fonction pour obtenir l'heure actuelle formatée
const getCurrentTime = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("fr-FR", options).format(now);
};

const RealTimeClockWithDate: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    setCurrentDate(getCurrentDate());

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-center">
      <h2>Date Actuelle : {currentDate}</h2>
      <h2>Heure Actuelle : {currentTime}</h2>
    </div>
  );
};

export default RealTimeClockWithDate;
