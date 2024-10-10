"use client";

import { createContext, useContext, useState } from "react";

// Type pour le contexte
interface SignatureContextType {
  isSignatureAllowed: boolean;
  studentSignatures: string[] | null;
  currentClassId: number | null;
  allowSignature: (classId: number) => void;
  disallowSignature: () => void;
  addStudentSignature: (signature: string) => void;
  clearStudentSignatures: () => void;
}

// Création du contexte
const SignatureContext = createContext<SignatureContextType | undefined>(
  undefined,
);

// Hook pour utiliser le contexte
export const useSignatureContext = () => {
  const context = useContext(SignatureContext);
  if (!context) {
    throw new Error(
      "useSignatureContext must be used within a SignatureProvider",
    );
  }
  return context;
};

// Provider pour le contexte
export const SignatureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSignatureAllowed, setIsSignatureAllowed] = useState(false);
  const [studentSignatures, setStudentSignatures] = useState<string[] | null>(
    null,
  );
  const [currentClassId, setCurrentClassId] = useState<number | null>(null);

  const allowSignature = (classId: number) => {
    setIsSignatureAllowed(true);
    setCurrentClassId(classId);
  };

  const disallowSignature = () => {
    setIsSignatureAllowed(false);
    setCurrentClassId(null);
  };

  const addStudentSignature = (signature: string) => {
    setStudentSignatures((prevSignatures) =>
      prevSignatures ? [...prevSignatures, signature] : [signature],
    );
  };

  const clearStudentSignatures = () => {
    setStudentSignatures(null);
  };

  return (
    <SignatureContext.Provider
      value={{
        isSignatureAllowed,
        studentSignatures,
        currentClassId,
        allowSignature,
        disallowSignature,
        addStudentSignature,
        clearStudentSignatures,
      }}
    >
      {children}
    </SignatureContext.Provider>
  );
};
