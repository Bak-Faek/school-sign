interface SignatureActionsProps {
  classId: number | null;
  isSignatureAllowed: boolean;
  allowSignature: (classId: number) => void;
  disallowSignature: () => void;
  toast: any;
}

export default function SignatureActions({
  classId,
  isSignatureAllowed,
  allowSignature,
  disallowSignature,
  toast,
}: SignatureActionsProps) {
  const handleAllowSignature = () => {
    if (classId) {
      toast({
        title: "Signatures have been sent out",
        className: "bg-green-400",
        duration: 2000,
      });
      allowSignature(classId);
    } else {
      toast({
        title: "No class is assigned to you.",
        className: "bg-orange-600",
        duration: 2000,
      });
    }
  };

  const handleDisallowSignature = () => {
    toast({
      title: "Signatures deactivated",
      className: "bg-red-400",
      duration: 2000,
    });
    disallowSignature();
  };

  return (
    <div className="flex flex-col item-center">
      <div className="flex justify-center">
        <button
          onClick={handleAllowSignature}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          Authorise signatures
        </button>
        <button
          onClick={handleDisallowSignature}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Disable signatures
        </button>
      </div>

      <p className="mt-4 text-center">
        {isSignatureAllowed
          ? `Signatures are authorised for the class ${classId}.`
          : "Signatures are disabled."}
      </p>
    </div>
  );
}
