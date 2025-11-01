import { useQuery } from "@tanstack/react-query";
import { patientService } from "../services/patient-service";

export function usePatients(params) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => patientService.getPatients(params),
  });
}

export function usePatient(id) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: () => patientService.getPatientById(id),
    enabled: !!id,
  });
}
