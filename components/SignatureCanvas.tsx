import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { useSignatureContext } from "@/components/context/SignatureContext";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface SignatureCanvasProps {
  lessonId: number | null;
}

export default function SignatureCanvas({ lessonId }: SignatureCanvasProps) {
  const [dataURL, setDataURL] = useState<string | null>(null);
  const [canvasKey, setCanvasKey] = useState<number>(0);
  const [signatureId, setSignatureId] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const { addStudentSignature } = useSignatureContext();
  const { toast } = useToast();

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }

      const signaturePad = new SignaturePad(canvas);
      signaturePadRef.current = signaturePad;
    }
  }, [canvasKey]);

  const saveAsPNG = async () => {
    if (signaturePadRef.current) {
      const dataUrl = signaturePadRef.current.toDataURL();
      setDataURL(dataUrl);

      try {
        const response = await fetch("/api/signature", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dataUrl, lesson: lessonId }),
        });

        if (response.ok) {
          toast({
            className: "bg-green-400",
            description: "Signature registered",
            duration: 2000,
          });
          const result = await response.json();
          setSignatureId(result.sign.id);
          addStudentSignature(dataUrl);
        } else {
          const error = await response.json();
          console.error("Failed to save signature:", error);
          toast({
            className: "bg-red-500",
            description: "Failed to save signature",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Error saving signature:", error);
        toast({
          className: "bg-red-500",
          description: "Error saving signature",
          duration: 2000,
        });
      }
    }
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      toast({
        description: "Signature cleared",
        className: "bg-green-400",
        duration: 2000,
      });
      signaturePadRef.current.clear();
      setDataURL(null);
      setSignatureId(null);
    }
  };

  const restartSignature = async () => {
    if (signatureId) {
      try {
        const response = await fetch(`/api/signature/${signatureId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            description: "Signature deleted",
            className: "bg-green-400",
            duration: 2000,
          });
        } else {
          const error = await response.json();
          console.error("Error deleting signature:", error);
          toast({
            className: "bg-red-500",
            description: "Failed to delete signature",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          className: "bg-red-500",
          description: "Error deleting signature",
          duration: 2000,
        });
      }
    }
    setCanvasKey((prevKey) => prevKey + 1);
    setDataURL(null);
  };

  return (
    <div>
      {!dataURL ? (
        <div className="flex flex-col items-center">
          <div
            className="relative border-4 border-gray-600"
            style={{ width: "300px", height: "150px" }}
          >
            <canvas
              ref={canvasRef}
              key={canvasKey}
              style={{ width: "100%", height: "100%" }}
              aria-label="Signature Canvas"
            ></canvas>
          </div>
          <div className="mt-4">
            <button
              onClick={saveAsPNG}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              aria-label="Save Signature as PNG"
            >
              Save as PNG
            </button>
            <button
              onClick={clearSignature}
              className="px-4 py-2 bg-red-500 text-white rounded"
              aria-label="Clear Signature"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h4 className="mb-4">Saved Signature</h4>
          <Image src={dataURL} alt="Signature" width={600} height={500} />

          <button
            onClick={restartSignature}
            className="px-4 py-2 bg-green-500 text-white rounded mt-4"
            aria-label="Restart Signature"
          >
            Restart Signature
          </button>
        </div>
      )}
    </div>
  );
}
