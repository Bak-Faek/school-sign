import { useCallback } from "react";

export interface SchoolDetails {
  name: string;
  address: string;
  zipcode: string;
  city: string;
}

export function useFetchSchoolDetails(
  setSchoolDetails: (details: SchoolDetails | null) => void,
) {
  const fetchSchoolDetails = useCallback(async () => {
    try {
      const res = await fetch("/api/school", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const data: SchoolDetails = await res.json();
        setSchoolDetails(data);
      } else {
        throw new Error("Failed to fetch school details");
      }
    } catch (error) {
      console.error("Error fetching school details:", error);
      setSchoolDetails(null);
    }
  }, [setSchoolDetails]);

  return { fetchSchoolDetails };
}
