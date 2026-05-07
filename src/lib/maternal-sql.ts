import { db } from "@/lib/sql";

function row<T>(rows: unknown[]): T | null {
  return ((rows[0] as T) ?? null);
}

export async function getMaternalPatients() {
  const result = await db.execute(`
    SELECT id, admissionNumber, lastName, firstName, age, contactNumber, attendingPhysician, dateAdmitted, status
    FROM "MaternalPatient"
    ORDER BY date(dateAdmitted) DESC, createdAt DESC
  `);
  return result.rows as any[];
}

export async function getMaternalPatientChart(id: string) {
  const patientRes = await db.execute({
    sql: `SELECT * FROM "MaternalPatient" WHERE id = ? LIMIT 1`,
    args: [id],
  });

  const patient = row<any>(patientRes.rows);
  if (!patient) return null;

  const [vitalSigns, medications, nurseNotes, outputCharts, labResults, physicianOrders, ultrasoundResults] = await Promise.all([
    db.execute({ sql: `SELECT * FROM "VitalSign" WHERE maternalPatientId = ? ORDER BY createdAt DESC`, args: [id] }),
    db.execute({ sql: `SELECT * FROM "Medication" WHERE maternalPatientId = ? ORDER BY createdAt DESC`, args: [id] }),
    db.execute({ sql: `SELECT * FROM "NurseNote" WHERE maternalPatientId = ? ORDER BY createdAt DESC`, args: [id] }),
    db.execute({ sql: `SELECT * FROM "OutputChart" WHERE maternalPatientId = ? ORDER BY createdAt DESC`, args: [id] }),
    db.execute({ sql: `SELECT * FROM "LabResult" WHERE maternalPatientId = ? ORDER BY createdAt DESC`, args: [id] }),
    db.execute({ sql: `SELECT * FROM "PhysicianOrder" WHERE maternalPatientId = ? ORDER BY createdAt DESC`, args: [id] }),
    db.execute({ sql: `SELECT * FROM "UltrasoundResult" WHERE maternalPatientId = ? ORDER BY createdAt DESC`, args: [id] }),
  ]);

  return {
    ...patient,
    vitalSigns: vitalSigns.rows,
    medications: medications.rows,
    nurseNotes: nurseNotes.rows,
    outputCharts: outputCharts.rows,
    labResults: labResults.rows,
    physicianOrders: physicianOrders.rows,
    ultrasoundResults: ultrasoundResults.rows,
    newborns: [],
    postpartumRecords: [],
  };
}

export async function getDashboardData() {
  const [maternalTotal, maternalActive, newbornTotal, recent] = await Promise.all([
    db.execute(`SELECT COUNT(*) as c FROM "MaternalPatient"`),
    db.execute(`SELECT COUNT(*) as c FROM "MaternalPatient" WHERE status = 'Active'`),
    db.execute(`SELECT COUNT(*) as c FROM "NewbornRecord"`),
    db.execute(`
      SELECT id, firstName, lastName, dateAdmitted, admittingDiagnosis, status, admissionNumber
      FROM "MaternalPatient"
      ORDER BY date(dateAdmitted) DESC, createdAt DESC
      LIMIT 5
    `),
  ]);

  return {
    totalMaternal: Number((maternalTotal.rows[0] as any)?.c ?? 0),
    activeMaternal: Number((maternalActive.rows[0] as any)?.c ?? 0),
    totalNewborn: Number((newbornTotal.rows[0] as any)?.c ?? 0),
    recentAdmissions: recent.rows as any[],
  };
}
