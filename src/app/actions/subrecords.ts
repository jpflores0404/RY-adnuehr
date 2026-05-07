"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function routeFor(patientId: string, isNewborn: boolean) {
  return isNewborn ? `/newborn/${patientId}` : `/maternal/${patientId}`;
}

export async function addVitalSign(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const record = await prisma.vitalSign.create({
    data: {
      date: data.date as string,
      time: data.time as string,
      bloodPressure: (data.bloodPressure as string) || null,
      pulseRate: data.pulseRate as string,
      respiratoryRate: data.respiratoryRate as string,
      temperature: data.temperature as string,
      signature: data.signature as string,
      ...(isNewborn
        ? { newbornRecordId: patientId }
        : { maternalPatientId: patientId }),
    },
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return {
    id: record.id,
    date: record.date,
    time: record.time,
    bloodPressure: record.bloodPressure,
    pulseRate: record.pulseRate,
    respiratoryRate: record.respiratoryRate,
    temperature: record.temperature,
    signature: record.signature,
  };
}

export async function deleteVitalSign(id: string) {
  const record = await prisma.vitalSign.findUnique({ where: { id } });
  await prisma.vitalSign.delete({ where: { id } });
  if (record?.maternalPatientId) revalidatePath(`/maternal/${record.maternalPatientId}`);
  if (record?.newbornRecordId) revalidatePath(`/newborn/${record.newbornRecordId}`);
}

export async function addMedication(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const record = await prisma.medication.create({
    data: {
      medicationName: data.medicationName as string,
      dateGiven: data.dateGiven as string,
      timeGiven: (data.timeGiven as string) || null,
      route: data.route as string,
      givenBy: data.givenBy as string,
      ...(isNewborn
        ? { newbornRecordId: patientId }
        : { maternalPatientId: patientId }),
    },
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return {
    id: record.id,
    medicationName: record.medicationName,
    dateGiven: record.dateGiven,
    timeGiven: record.timeGiven,
    route: record.route,
    givenBy: record.givenBy,
  };
}

export async function deleteMedication(id: string) {
  const record = await prisma.medication.findUnique({ where: { id } });
  await prisma.medication.delete({ where: { id } });
  if (record?.maternalPatientId) revalidatePath(`/maternal/${record.maternalPatientId}`);
  if (record?.newbornRecordId) revalidatePath(`/newborn/${record.newbornRecordId}`);
}

export async function addNurseNote(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const record = await prisma.nurseNote.create({
    data: {
      date: data.date as string,
      time: (data.time as string) || null,
      shift: data.shift as string,
      focus: data.focus as string,
      data: data.data as string,
      action: data.action as string,
      response: data.response as string,
      ...(isNewborn
        ? { newbornRecordId: patientId }
        : { maternalPatientId: patientId }),
    },
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return {
    id: record.id,
    date: record.date,
    time: record.time,
    shift: record.shift,
    focus: record.focus,
    data: record.data,
    action: record.action,
    response: record.response,
  };
}

export async function deleteNurseNote(id: string) {
  const record = await prisma.nurseNote.findUnique({ where: { id } });
  await prisma.nurseNote.delete({ where: { id } });
  if (record?.maternalPatientId) revalidatePath(`/maternal/${record.maternalPatientId}`);
  if (record?.newbornRecordId) revalidatePath(`/newborn/${record.newbornRecordId}`);
}

export async function addOutputChart(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const record = await prisma.outputChart.create({
    data: {
      date: data.date as string,
      shift: data.shift as string,
      stoolCount: parseInt(data.stoolCount as string, 10) || 0,
      urineCount: parseInt(data.urineCount as string, 10) || 0,
      ...(isNewborn
        ? { newbornRecordId: patientId }
        : { maternalPatientId: patientId }),
    },
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return {
    id: record.id,
    date: record.date,
    shift: record.shift,
    stoolCount: record.stoolCount,
    urineCount: record.urineCount,
  };
}

export async function deleteOutputChart(id: string) {
  const record = await prisma.outputChart.findUnique({ where: { id } });
  await prisma.outputChart.delete({ where: { id } });
  if (record?.maternalPatientId) revalidatePath(`/maternal/${record.maternalPatientId}`);
  if (record?.newbornRecordId) revalidatePath(`/newborn/${record.newbornRecordId}`);
}

export async function submitApgarScore(newbornId: string, minuteType: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const heartRate = parseInt(data.heartRate as string, 10) || 0;
  const respiratoryEffort = parseInt(data.respiratoryEffort as string, 10) || 0;
  const muscleTone = parseInt(data.muscleTone as string, 10) || 0;
  const reflexIrritability = parseInt(data.reflexIrritability as string, 10) || 0;
  const skinColor = parseInt(data.skinColor as string, 10) || 0;
  const totalScore = heartRate + respiratoryEffort + muscleTone + reflexIrritability + skinColor;

  const record = await prisma.apgarScore.create({
    data: {
      newbornRecordId: newbornId,
      minuteType,
      heartRate,
      respiratoryEffort,
      muscleTone,
      reflexIrritability,
      skinColor,
      totalScore,
    },
  });

  revalidatePath(`/newborn/${newbornId}`);
  return record;
}

export async function addPhysicianOrder(patientId: string, isNewborn: boolean, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const record = await prisma.physicianOrder.create({
    data: {
      date: data.date as string,
      notes: data.notes as string,
      ...(isNewborn
        ? { newbornRecordId: patientId }
        : { maternalPatientId: patientId }),
    },
  });

  revalidatePath(routeFor(patientId, isNewborn));
  return { id: record.id, date: record.date, notes: record.notes };
}

export async function deletePhysicianOrder(id: string) {
  const record = await prisma.physicianOrder.findUnique({ where: { id } });
  await prisma.physicianOrder.delete({ where: { id } });
  if (record?.maternalPatientId) revalidatePath(`/maternal/${record.maternalPatientId}`);
  if (record?.newbornRecordId) revalidatePath(`/newborn/${record.newbornRecordId}`);
}

export async function addUltrasoundResult(patientId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const record = await prisma.ultrasoundResult.create({
    data: {
      maternalPatientId: patientId,
      datePerformed: data.datePerformed as string,
      impression: data.impression as string,
    },
  });

  revalidatePath(`/maternal/${patientId}`);
  return record;
}

export async function deleteUltrasoundResult(id: string) {
  const record = await prisma.ultrasoundResult.findUnique({ where: { id } });
  await prisma.ultrasoundResult.delete({ where: { id } });
  if (record?.maternalPatientId) revalidatePath(`/maternal/${record.maternalPatientId}`);
}

export async function addLabResult(patientId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const record = await prisma.labResult.create({
    data: {
      maternalPatientId: patientId,
      datePerformed: (data.datePerformed as string) || null,
      remarks: (data.remarks as string) || null,
      wbcCount: (data.wbcCount as string) || null,
      rbcCount: (data.rbcCount as string) || null,
      hemoglobin: (data.hemoglobin as string) || null,
      hematocrit: (data.hematocrit as string) || null,
      mcv: (data.mcv as string) || null,
      mch: (data.mch as string) || null,
      mchc: (data.mchc as string) || null,
      neutrophils: (data.neutrophils as string) || null,
      lymphocytes: (data.lymphocytes as string) || null,
      monocytes: (data.monocytes as string) || null,
      eosinophils: (data.eosinophils as string) || null,
      basophils: (data.basophils as string) || null,
      plateletCount: (data.plateletCount as string) || null,
      urineColor: (data.urineColor as string) || null,
      urineTransparency: (data.urineTransparency as string) || null,
      urineReaction: (data.urineReaction as string) || null,
      urinePH: (data.urinePH as string) || null,
      urineSpecificGravity: (data.urineSpecificGravity as string) || null,
      urineGlucose: (data.urineGlucose as string) || null,
      urineProtein: (data.urineProtein as string) || null,
      urineWBC: (data.urineWBC as string) || null,
      urineRBC: (data.urineRBC as string) || null,
      urineEpithelialCells: (data.urineEpithelialCells as string) || null,
      urineMicroscopicOther: (data.urineMicroscopicOther as string) || null,
      bloodTypeABO: (data.bloodTypeABO as string) || null,
      bloodTypeRh: (data.bloodTypeRh as string) || null,
      antiA: (data.antiA as string) || null,
      antiB: (data.antiB as string) || null,
      antiD: (data.antiD as string) || null,
    },
  });

  revalidatePath(`/maternal/${patientId}`);
  return record;
}

export async function deleteLabResult(id: string) {
  const record = await prisma.labResult.findUnique({ where: { id } });
  await prisma.labResult.delete({ where: { id } });
  if (record?.maternalPatientId) revalidatePath(`/maternal/${record.maternalPatientId}`);
}

export async function updateBloodTyping(patientId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  await prisma.maternalPatient.update({
    where: { id: patientId },
    data: {
      antiA: (data.antiA as string) || null,
      antiB: (data.antiB as string) || null,
      antiD: (data.antiD as string) || null,
      bloodTypeABO: (data.bloodTypeABO as string) || null,
      bloodTypeRh: (data.bloodTypeRh as string) || null,
    },
  });

  revalidatePath(`/maternal/${patientId}`);
}

export async function addPostpartumRecord(patientId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const record = await prisma.postpartumRecord.create({
    data: {
      maternalPatientId: patientId,
      assessmentTime: data.assessmentTime as string,
      hoursLabel: (data.hoursLabel as string) || null,
      rapidAssessment: (data.rapidAssessment as string) || null,
      bleeding: (data.bleeding as string) || null,
      uterusFirmness: (data.uterusFirmness as string) || null,
      maternalBP: (data.maternalBP as string) || null,
      pulse: (data.pulse as string) || null,
      temperature: (data.temperature as string) || null,
      urineVoided: (data.urineVoided as string) || null,
      vulvaStatus: (data.vulvaStatus as string) || null,
      newbornBreathing: (data.newbornBreathing as string) || null,
      newbornWarmth: (data.newbornWarmth as string) || null,
      newbornAbnormalSigns: (data.newbornAbnormalSigns as string) || null,
      feedingObserved: (data.feedingObserved as string) || null,
      comments: (data.comments as string) || null,
      motherTreatments: (data.motherTreatments as string) || null,
      newbornTreatments: (data.newbornTreatments as string) || null,
      ifReferred: (data.ifReferred as string) || null,
      ifDeath: (data.ifDeath as string) || null,
      adviseMotherChecklist: (data.adviseMotherChecklist as string) || null,
      adviseBabyChecklist: (data.adviseBabyChecklist as string) || null,
      preventiveMotherChecklist: (data.preventiveMotherChecklist as string) || null,
      preventiveBabyChecklist: (data.preventiveBabyChecklist as string) || null,
    },
  });

  revalidatePath(`/maternal/${patientId}`);
  return record;
}

export async function deletePostpartumRecord(id: string) {
  const record = await prisma.postpartumRecord.findUnique({ where: { id } });
  await prisma.postpartumRecord.delete({ where: { id } });
  if (record?.maternalPatientId) revalidatePath(`/maternal/${record.maternalPatientId}`);
}
