import { prisma } from "@/lib/prisma";

export async function getMaternalPatients() {
  const patients = await prisma.maternalPatient.findMany({
    select: {
      id: true,
      admissionNumber: true,
      lastName: true,
      firstName: true,
      age: true,
      contactNumber: true,
      attendingPhysician: true,
      dateAdmitted: true,
      status: true,
    },
    orderBy: [
      { dateAdmitted: "desc" },
      { createdAt: "desc" },
    ],
  });
  return patients;
}

export async function getMaternalPatientChart(id: string) {
  const patient = await prisma.maternalPatient.findUnique({
    where: { id },
    include: {
      vitalSigns: { orderBy: { createdAt: "desc" } },
      medications: { orderBy: { createdAt: "desc" } },
      nurseNotes: { orderBy: { createdAt: "desc" } },
      outputCharts: { orderBy: { createdAt: "desc" } },
      labResults: { orderBy: { createdAt: "desc" } },
      physicianOrders: { orderBy: { createdAt: "desc" } },
      ultrasoundResults: { orderBy: { createdAt: "desc" } },
      postpartumRecords: { orderBy: { createdAt: "desc" } },
      newborns: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!patient) return null;

  return patient;
}

export async function getDashboardData() {
  const [totalMaternal, activeMaternal, totalNewborn, recentAdmissions] = await Promise.all([
    prisma.maternalPatient.count(),
    prisma.maternalPatient.count({ where: { status: "Active" } }),
    prisma.newbornRecord.count(),
    prisma.maternalPatient.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateAdmitted: true,
        admittingDiagnosis: true,
        status: true,
        admissionNumber: true,
      },
      orderBy: [
        { dateAdmitted: "desc" },
        { createdAt: "desc" },
      ],
      take: 5,
    }),
  ]);

  return {
    totalMaternal,
    activeMaternal,
    totalNewborn,
    recentAdmissions,
  };
}
