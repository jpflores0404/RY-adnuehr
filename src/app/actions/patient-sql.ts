"use server";

import { db } from "@/lib/sql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPatientRecord(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const countRes = await db.execute(`SELECT COUNT(*) AS c FROM "MaternalPatient"`);
  const count = Number((countRes.rows[0] as any)?.c ?? 0);
  const year = new Date().getFullYear();
  const admissionNumber = `ADM-${year}-${String(count + 1).padStart(3, "0")}`;
  const id = `mat-${crypto.randomUUID()}`;

  await db.execute({
    sql: `
      INSERT INTO "MaternalPatient" (
        id, admissionNumber, lastName, firstName, middleName,
        age, gender, civilStatus, address, religion, dateOfBirth,
        occupation, contactNumber, dateAdmitted, attendingPhysician,
        admittingDiagnosis, aog, bloodTypeABO, bloodTypeRh, preExistingIllness,
        status, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', CURRENT_TIMESTAMP)
    `,
    args: [
      id,
      admissionNumber,
      (data.lastName as string) || "",
      (data.firstName as string) || "",
      (data.middleName as string) || null,
      parseInt(data.age as string, 10) || 0,
      (data.gender as string) || "Female",
      (data.civilStatus as string) || "Single",
      (data.address as string) || "",
      (data.religion as string) || null,
      (data.dateOfBirth as string) || "1990-01-01",
      (data.occupation as string) || null,
      (data.contactNumber as string) || "N/A",
      (data.dateAdmitted as string) || new Date().toISOString().split("T")[0],
      (data.attendingPhysician as string) || null,
      (data.admittingDiagnosis as string) || null,
      (data.aog as string) || null,
      (data.bloodTypeABO as string) || null,
      (data.bloodTypeRh as string) || null,
      (data.preExistingIllness as string) || null,
    ],
  });

  await db.execute({
    sql: `INSERT INTO "CarePlan" (id, maternalPatientId, diagnosis, planning, intervention, evaluation) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      `cp-${id}`,
      id,
      (data.adpieDiagnosis as string) || null,
      (data.adpiePlanning as string) || null,
      (data.adpieIntervention as string) || null,
      (data.adpieEvaluation as string) || null,
    ],
  });

  await db.execute({
    sql: `INSERT INTO "IntakeOutputSummary" (id, maternalPatientId, oralIntakeMl, ivIntakeMl, urineOutputMl, stoolCount, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      `io-${id}`,
      id,
      (data.oralIntakeMl as string) || null,
      (data.ivIntakeMl as string) || null,
      (data.urineOutputMl as string) || null,
      (data.stoolCount as string) || null,
      (data.ioNotes as string) || null,
    ],
  });

  revalidatePath("/");
  revalidatePath("/maternal");
  redirect(`/maternal/${id}`);
}
