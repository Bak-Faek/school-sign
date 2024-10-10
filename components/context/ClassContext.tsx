"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface ClassContextType {
  classId: number | null;
  setClassId: (id: number | null) => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [classId, setClassId] = useState<number | null>(null);

  return (
    <ClassContext.Provider value={{ classId, setClassId }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
};
