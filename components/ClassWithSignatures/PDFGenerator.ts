import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Student } from "@/components/ClassWithSignatures/StudentList";

interface Signature {
  userId: string;
  hashedSign?: string;
}

interface PDFGeneratorProps {
  students: Student[];
  signatures: Signature[];
  schoolDetails: {
    name: string;
    address: string;
    zipcode: string;
    city: string;
  } | null;
  className: string | null;
  teacherName: string | null;
  lessonName: string | null; // Nom de la leçon
  startDate: Date | null; // Date de début de la leçon
  endDate: Date | null; // Date de fin de la leçon
  toast: (options: {
    title: string;
    className: string;
    duration: number;
  }) => void;
}

export default async function PDFGenerator({
  students,
  signatures,
  schoolDetails,
  className,
  teacherName,
  lessonName,
  startDate,
  endDate,
  toast,
}: PDFGeneratorProps) {
  // Notification d'achèvement
  toast({
    title: "Attendance sheet PDF generated",
    className: "bg-green-400",
    duration: 2000,
  });

  // Création du PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  // Titre du document
  page.drawText("Attendance sheet", {
    x: width / 2 - 70,
    y: height - 120,
    size: fontSize + 4,
    font,
    color: rgb(0, 0, 0),
  });

  // Détails de l'école
  if (schoolDetails) {
    page.drawText(schoolDetails.name, {
      x: 50,
      y: height - 50,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(schoolDetails.address, {
      x: 50,
      y: height - 70,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(`${schoolDetails.zipcode} ${schoolDetails.city}`, {
      x: 50,
      y: height - 90,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  // Détails de la classe et de l'enseignant
  if (className) {
    page.drawText(`Class: ${className}`, {
      x: 50,
      y: height - 180,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  if (teacherName) {
    page.drawText(`Teacher: ${teacherName}`, {
      x: 50,
      y: height - 200,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  // Détails de la leçon - positioned to the right
  if (lessonName) {
    page.drawText(`Lesson: ${lessonName}`, {
      x: width - 200, // Adjusted for right alignment
      y: height - 180,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  // Dates de la leçon - positioned to the right
  if (startDate && endDate) {
    const startHour = startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endHour = endDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    page.drawText(`Start Time: ${startHour}`, {
      x: width - 200, // Adjusted for right alignment
      y: height - 200,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(`End Time: ${endHour}`, {
      x: width - 200, // Adjusted for right alignment
      y: height - 220,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  // Heure de génération du PDF
  const generatedAt = new Date();
  page.drawText(`Generated At: ${generatedAt.toLocaleString()}`, {
    x: 50,
    y: height - 220,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // En-têtes de colonne
  page.drawText("Name", {
    x: 100,
    y: height - 300,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Signature", {
    x: 400,
    y: height - 300,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  const rowHeight = 50;
  let yPosition = height - 350;

  for (const [index, student] of students.entries()) {
    if (student.role === "STUDENT") {
      // Display student name
      page.drawText(`${student.firstname} ${student.lastname}`, {
        x: 100,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      // Draw a line for signature
      page.drawLine({
        start: { x: 40, y: yPosition - 20 },
        end: { x: width - 40, y: yPosition - 20 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      // Find the student's signature
      const studentSignature = signatures.find(
        (sig) => sig.userId === student.id,
      );

      if (studentSignature?.hashedSign) {
        try {
          const signatureUrl = studentSignature.hashedSign;
          const response = await fetch(signatureUrl);
          if (!response.ok)
            throw new Error(
              `Failed to fetch signature: ${response.statusText}`,
            );
          const signatureImageBytes = await response.arrayBuffer();
          const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
          const signatureDims = signatureImage.scale(0.4);

          // Draw the signature image
          page.drawImage(signatureImage, {
            x: 400,
            y: yPosition - 25,
            width: signatureDims.width,
            height: signatureDims.height,
          });
        } catch (error) {
          console.error("Error loading signature image:", error);
          // Display message when signature is missing
          page.drawText("Signature unavailable", {
            x: 400,
            y: yPosition,
            size: fontSize,
            font,
            color: rgb(1, 0, 0),
          });
        }
      } else {
        // Display message when signature is missing
        page.drawText("Signature absent", {
          x: 400,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(1, 0, 0),
        });
      }

      // Move to the next row position
      yPosition -= rowHeight;
    }
  }

  // Génération du PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "attendance_sheet.pdf";
  link.click();
}
