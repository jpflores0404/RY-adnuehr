"use server";

import { db } from "@/lib/sql";
import { revalidatePath } from "next/cache";

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function routeFor(patientId: string, isNewborn: boolean) {
  return isNewborn ? `/newborn/${patientId}` : `/maternal/${patientId}`;
}

function parentColumn(isNewborn: boolean) {
  return isNewborn ? "newbornRecordId" : "maternalPatientId";
}

async function getParentIds(table: string, id: string) {
  const res = await db.execute({
    sql: `SELECT maternalPatientId, newbornRecordId FROM "${table}" WHERE id = ? LIMIT 1`,
    args: [id],
  });
  return (res.rows[0] as any) || null;
}

export async function addVitalSign(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const id = uid("vs");
  const parent = parentColumn(isNewborn);

  await db.execute({
    sql: `
      INSERT INTO "VitalSign" (id, date, time, bloodPressure, pulseRate, respiratoryRate, temperature, signature, ${parent})
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      data.date as string,
      data.time as string,
      (data.bloodPressure as string) || null,
      data.pulseRate as string,
      data.respiratoryRate as string,
      data.temperature as string,
      data.signature as string,
      patientId,
    ],
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return {
    id,
    date: data.date,
    time: data.time,
    bloodPressure: data.bloodPressure || null,
    pulseRate: data.pulseRate,
    respiratoryRate: data.respiratoryRate,
    temperature: data.temperature,
    signature: data.signature,
  };
}

export async function deleteVitalSign(id: string) {
  const parent = await getParentIds("VitalSign", id);
  await db.execute({ sql: `DELETE FROM "VitalSign" WHERE id = ?`, args: [id] });
  if (parent?.maternalPatientId) revalidatePath(`/maternal/${parent.maternalPatientId}`);
  if (parent?.newbornRecordId) revalidatePath(`/newborn/${parent.newbornRecordId}`);
}

export async function addMedication(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const id = uid("med");
  const parent = parentColumn(isNewborn);

  await db.execute({
    sql: `
      INSERT INTO "Medication" (id, medicationName, dateGiven, timeGiven, route, givenBy, ${parent})
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      data.medicationName as string,
      data.dateGiven as string,
      (data.timeGiven as string) || null,
      data.route as string,
      data.givenBy as string,
      patientId,
    ],
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return {
    id,
    medicationName: data.medicationName,
    dateGiven: data.dateGiven,
    timeGiven: data.timeGiven || null,
    route: data.route,
    givenBy: data.givenBy,
  };
}

export async function deleteMedication(id: string) {
  const parent = await getParentIds("Medication", id);
  await db.execute({ sql: `DELETE FROM "Medication" WHERE id = ?`, args: [id] });
  if (parent?.maternalPatientId) revalidatePath(`/maternal/${parent.maternalPatientId}`);
  if (parent?.newbornRecordId) revalidatePath(`/newborn/${parent.newbornRecordId}`);
}

export async function addNurseNote(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const id = uid("note");
  const parent = parentColumn(isNewborn);

  await db.execute({
    sql: `
      INSERT INTO "NurseNote" (id, date, time, shift, focus, data, action, response, ${parent})
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      data.date as string,
      (data.time as string) || null,
      data.shift as string,
      data.focus as string,
      data.data as string,
      data.action as string,
      data.response as string,
      patientId,
    ],
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return {
    id,
    date: data.date,
    time: data.time || null,
    shift: data.shift,
    focus: data.focus,
    data: data.data,
    action: data.action,
    response: data.response,
  };
}

export async function deleteNurseNote(id: string) {
  const parent = await getParentIds("NurseNote", id);
  await db.execute({ sql: `DELETE FROM "NurseNote" WHERE id = ?`, args: [id] });
  if (parent?.maternalPatientId) revalidatePath(`/maternal/${parent.maternalPatientId}`);
  if (parent?.newbornRecordId) revalidatePath(`/newborn/${parent.newbornRecordId}`);
}

export async function addOutputChart(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const id = uid("out");
  const parent = parentColumn(isNewborn);

  await db.execute({
    sql: `
      INSERT INTO "OutputChart" (id, date, shift, stoolCount, urineCount, ${parent})
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      data.date as string,
      data.shift as string,
      parseInt(data.stoolCount as string, 10) || 0,
      parseInt(data.urineCount as string, 10) || 0,
      patientId,
    ],
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return {
    id,
    date: data.date,
    shift: data.shift,
    stoolCount: parseInt(data.stoolCount as string, 10) || 0,
    urineCount: parseInt(data.urineCount as string, 10) || 0,
  };
}

export async function deleteOutputChart(id: string) {
  const parent = await getParentIds("OutputChart", id);
  await db.execute({ sql: `DELETE FROM "OutputChart" WHERE id = ?`, args: [id] });
  if (parent?.maternalPatientId) revalidatePath(`/maternal/${parent.maternalPatientId}`);
  if (parent?.newbornRecordId) revalidatePath(`/newborn/${parent.newbornRecordId}`);
}

export async function submitApgarScore(newbornId: string, minuteType: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const id = uid("apgar");

  const heartRate = parseInt(data.heartRate as string, 10) || 0;
  const respiratoryEffort = parseInt(data.respiratoryEffort as string, 10) || 0;
  const muscleTone = parseInt(data.muscleTone as string, 10) || 0;
  const reflexIrritability = parseInt(data.reflexIrritability as string, 10) || 0;
  const skinColor = parseInt(data.skinColor as string, 10) || 0;
  const totalScore = heartRate + respiratoryEffort + muscleTone + reflexIrritability + skinColor;

  await db.execute({
    sql: `
      INSERT INTO "ApgarScore" (
        id, newbornRecordId, minuteType, heartRate, respiratoryEffort, muscleTone, reflexIrritability, skinColor, totalScore
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [id, newbornId, minuteType, heartRate, respiratoryEffort, muscleTone, reflexIrritability, skinColor, totalScore],
  });

  revalidatePath(`/newborn/${newbornId}`);
  return { id, newbornRecordId: newbornId, minuteType, heartRate, respiratoryEffort, muscleTone, reflexIrritability, skinColor, totalScore };
}

export async function addPhysicianOrder(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const id = uid("ord");
  const parent = parentColumn(isNewborn);

  await db.execute({
    sql: `INSERT INTO "PhysicianOrder" (id, date, notes, ${parent}) VALUES (?, ?, ?, ?)`,
    args: [id, data.date as string, data.notes as string, patientId],
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return { id, date: data.date, notes: data.notes };
}

export async function deletePhysicianOrder(id: string) {
  const parent = await getParentIds("PhysicianOrder", id);
  await db.execute({ sql: `DELETE FROM "PhysicianOrder" WHERE id = ?`, args: [id] });
  if (parent?.maternalPatientId) revalidatePath(`/maternal/${parent.maternalPatientId}`);
  if (parent?.newbornRecordId) revalidatePath(`/newborn/${parent.newbornRecordId}`);
}

export async function addUltrasoundResult(patientId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const id = uid("utz");

  await db.execute({
    sql: `INSERT INTO "UltrasoundResult" (id, maternalPatientId, datePerformed, impression) VALUES (?, ?, ?, ?)`,
    args: [id, patientId, data.datePerformed as string, data.impression as string],
  });

  revalidatePath(`/maternal/${patientId}`);
  return { id, maternalPatientId: patientId, datePerformed: data.datePerformed, impression: data.impression };
}

export async function deleteUltrasoundResult(id: string) {
  const res = await db.execute({ sql: `SELECT maternalPatientId FROM "UltrasoundResult" WHERE id = ? LIMIT 1`, args: [id] });
  const patientId = (res.rows[0] as any)?.maternalPatientId;
  await db.execute({ sql: `DELETE FROM "UltrasoundResult" WHERE id = ?`, args: [id] });
  if (patientId) revalidatePath(`/maternal/${patientId}`);
}

export async function addLabResult(patientId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const id = uid("lab");

  await db.execute({
    sql: `
      INSERT INTO "LabResult" (
        id, maternalPatientId, datePerformed, remarks,
        wbcCount, rbcCount, hemoglobin, hematocrit, mcv, mch, mchc,
        neutrophils, lymphocytes, monocytes, eosinophils, basophils, plateletCount,
        urineColor, urineTransparency, urineReaction, urinePH, urineSpecificGravity,
        urineGlucose, urineProtein, urineWBC, urineRBC, urineEpithelialCells, urineMicroscopicOther,
        bloodTypeABO, bloodTypeRh, antiA, antiB, antiD
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      patientId,
      data.datePerformed as string,
      (data.remarks as string) || null,
      (data.wbcCount as string) || null,
      (data.rbcCount as string) || null,
      (data.hemoglobin as string) || null,
      (data.hematocrit as string) || null,
      (data.mcv as string) || null,
      (data.mch as string) || null,
      (data.mchc as string) || null,
      (data.neutrophils as string) || null,
      (data.lymphocytes as string) || null,
      (data.monocytes as string) || null,
      (data.eosinophils as string) || null,
      (data.basophils as string) || null,
      (data.plateletCount as string) || null,
      (data.urineColor as string) || null,
      (data.urineTransparency as string) || null,
      (data.urineReaction as string) || null,
      (data.urinePH as string) || null,
      (data.urineSpecificGravity as string) || null,
      (data.urineGlucose as string) || null,
      (data.urineProtein as string) || null,
      (data.urineWBC as string) || null,
      (data.urineRBC as string) || null,
      (data.urineEpithelialCells as string) || null,
      (data.urineMicroscopicOther as string) || null,
      (data.bloodTypeABO as string) || null,
      (data.bloodTypeRh as string) || null,
      (data.antiA as string) || null,
      (data.antiB as string) || null,
      (data.antiD as string) || null,
    ],
  });

  revalidatePath(`/maternal/${patientId}`);
  return { id, maternalPatientId: patientId, ...data };
}

export async function deleteLabResult(id: string) {
  const res = await db.execute({ sql: `SELECT maternalPatientId FROM "LabResult" WHERE id = ? LIMIT 1`, args: [id] });
  const patientId = (res.rows[0] as any)?.maternalPatientId;
  await db.execute({ sql: `DELETE FROM "LabResult" WHERE id = ?`, args: [id] });
  if (patientId) revalidatePath(`/maternal/${patientId}`);
}

export async function updateBloodTyping(patientId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  await db.execute({
    sql: `
      UPDATE "MaternalPatient"
      SET antiA = ?, antiB = ?, antiD = ?, bloodTypeABO = ?, bloodTypeRh = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      (data.antiA as string) || null,
      (data.antiB as string) || null,
      (data.antiD as string) || null,
      (data.bloodTypeABO as string) || null,
      (data.bloodTypeRh as string) || null,
      patientId,
    ],
  });
  revalidatePath(`/maternal/${patientId}`);
}

export async function addPostpartumRecord(patientId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const id = uid("pp");

  await db.execute({
    sql: `
      INSERT INTO "PostpartumRecord" (id, maternalPatientId, assessmentTime, bleeding, uterusFirmness, bloodPressure, pulse, urineVoided, vulvaStatus, newbornBreathing, newbornWarmth)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      patientId,
      data.assessmentTime as string,
      (data.bleeding as string) || null,
      (data.uterusFirmness as string) || null,
      (data.maternalBP as string) || null,
      (data.pulse as string) || null,
      (data.urineVoided as string) || null,
      (data.vulvaStatus as string) || null,
      (data.newbornBreathing as string) || null,
      (data.newbornWarmth as string) || null,
    ],
  });

  revalidatePath(`/maternal/${patientId}`);
  return { id, maternalPatientId: patientId, ...data };
}

export async function deletePostpartumRecord(id: string) {
  const res = await db.execute({ sql: `SELECT maternalPatientId FROM "PostpartumRecord" WHERE id = ? LIMIT 1`, args: [id] });
  const patientId = (res.rows[0] as any)?.maternalPatientId;
  await db.execute({ sql: `DELETE FROM "PostpartumRecord" WHERE id = ?`, args: [id] });
  if (patientId) revalidatePath(`/maternal/${patientId}`);
}
