"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPatientRecord(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const count = await prisma.maternalPatient.count();
  const year = new Date().getFullYear();
  const admissionNumber = `ADM-${year}-${String(count + 1).padStart(3, "0")}`;

  const patient = await prisma.maternalPatient.create({
    data: {
      admissionNumber,
      lastName: (data.lastName as string) || "",
      firstName: (data.firstName as string) || "",
      middleName: (data.middleName as string) || null,
      age: parseInt(data.age as string, 10) || 0,
      gender: (data.gender as string) || "Female",
      civilStatus: (data.civilStatus as string) || "Single",
      address: (data.address as string) || "",
      religion: (data.religion as string) || null,
      dateOfBirth: new Date((data.dateOfBirth as string) || "1990-01-01"),
      occupation: (data.occupation as string) || null,
      contactNumber: (data.contactNumber as string) || "N/A",
      dateAdmitted: new Date((data.dateAdmitted as string) || new Date().toISOString().split("T")[0]),
      attendingPhysician: (data.attendingPhysician as string) || null,
      admittingDiagnosis: (data.admittingDiagnosis as string) || null,
      aog: (data.aog as string) || null,
      bloodTypeABO: (data.bloodTypeABO as string) || null,
      bloodTypeRh: (data.bloodTypeRh as string) || null,
      preExistingIllness: (data.preExistingIllness as string) || null,
      status: "Active",
      carePlans: {
        create: {
          diagnosis: (data.adpieDiagnosis as string) || null,
          planning: (data.adpiePlanning as string) || null,
          intervention: (data.adpieIntervention as string) || null,
          evaluation: (data.adpieEvaluation as string) || null,
        },
      },
      intakeOutputSummaries: {
        create: {
          oralIntakeMl: (data.oralIntakeMl as string) || null,
          ivIntakeMl: (data.ivIntakeMl as string) || null,
          urineOutputMl: (data.urineOutputMl as string) || null,
          stoolCount: (data.stoolCount as string) || null,
          notes: (data.ioNotes as string) || null,
        },
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/maternal");
  redirect(`/maternal/${patient.id}`);
}
