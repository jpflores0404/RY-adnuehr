import { createClient } from "@libsql/client";

const db = createClient({ url: process.env.DATABASE_URL || "file:./dev.db" });

async function run() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS "CarePlan" (
      id TEXT PRIMARY KEY,
      maternalPatientId TEXT NOT NULL,
      diagnosis TEXT,
      planning TEXT,
      intervention TEXT,
      evaluation TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (maternalPatientId) REFERENCES "MaternalPatient"(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS "IntakeOutputSummary" (
      id TEXT PRIMARY KEY,
      maternalPatientId TEXT NOT NULL,
      oralIntakeMl TEXT,
      ivIntakeMl TEXT,
      urineOutputMl TEXT,
      stoolCount TEXT,
      notes TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (maternalPatientId) REFERENCES "MaternalPatient"(id) ON DELETE CASCADE
    )
  `);

  const cleanup = [
    "DELETE FROM \"ApgarScore\"",
    "DELETE FROM \"PostpartumRecord\"",
    "DELETE FROM \"UltrasoundResult\"",
    "DELETE FROM \"LabResult\"",
    "DELETE FROM \"OutputChart\"",
    "DELETE FROM \"NurseNote\"",
    "DELETE FROM \"Medication\"",
    "DELETE FROM \"VitalSign\"",
    "DELETE FROM \"PhysicianOrder\"",
    "DELETE FROM \"NewbornRecord\"",
    "DELETE FROM \"CarePlan\"",
    "DELETE FROM \"IntakeOutputSummary\"",
    "DELETE FROM \"MaternalPatient\"",
  ];

  for (const sql of cleanup) {
    await db.execute(sql);
  }

  const patients = [
    {
      id: "mat-ocampo-001",
      admissionNumber: "ADM-2026-001",
      lastName: "Ocampo",
      firstName: "Jennifer Mae",
      age: 35,
      gender: "Female",
      civilStatus: "Married",
      religion: "Roman Catholic",
      occupation: "Vendor",
      address: "Iriga City",
      dateOfBirth: "1990-08-15",
      attendingPhysician: "Dr. Maria Teresa Reyes",
      dateAdmitted: "2026-04-02",
      diagnosis: "Gravida 5 Para 4 (4004), PU 35 4/7 wks AOG, Breech Presentation, In Labor, Pregestational DM.",
      bloodTypeABO: "B",
      bloodTypeRh: "+",
      aog: "35 4/7 wks",
      complaint: "Lower abdominal pain and uterine contractions.",
      diet: "Diabetic",
      weight: "75kg",
      height: "160cm",
      adpie: ["Risk for impaired maternal/fetal well-being.", "Maintain maternal/fetal stability.", "Monitor VS/FHR, insulin, prep for OR.", "Stable prior to surgery."],
      io: ["500", "1000", "1200", "0", "Strict monitoring."],
    },
    {
      id: "mat-villanueva-002",
      admissionNumber: "ADM-2026-002",
      lastName: "Villanueva",
      firstName: "Angela Mae",
      age: 34,
      gender: "Female",
      civilStatus: "Married",
      religion: "Roman Catholic",
      occupation: "Storekeeper",
      address: "Naga City",
      dateOfBirth: "1992-03-22",
      attendingPhysician: "Dr. Carla Dominique Ramos",
      dateAdmitted: "2026-04-06",
      dateDischarged: "2026-04-09",
      status: "Discharged",
      diagnosis: "Gravida 4 Para 3 (3003), PU 37 1/7 wks AOG, Cephalic, Gestational HTN, In Labor.",
      bloodTypeABO: "A",
      bloodTypeRh: "+",
      aog: "37 1/7 wks",
      complaint: "Severe headache, elevated BP, contractions.",
      diet: "Low-salt",
      weight: "80kg",
      height: "160cm",
      adpie: ["Risk for decreased maternal/fetal perfusion r/t HTN.", "Maintain BP control.", "BP monitoring, left lateral position, antihypertensives.", "BP controlled, discharged stable."],
      io: ["1500", "1000", "1500", "0", "Urine output 1400-1600mL."],
    },
    {
      id: "mat-santos-003",
      admissionNumber: "ADM-2026-003",
      lastName: "Santos",
      firstName: "Maria Luz",
      age: 32,
      gender: "Female",
      civilStatus: "Married",
      religion: "Roman Catholic",
      occupation: "Housewife",
      address: "Ligao City",
      dateOfBirth: "1993-07-10",
      attendingPhysician: "Dr. Evelyn Cruz",
      dateAdmitted: "2026-04-10",
      diagnosis: "Gravida 3 Para 3 (3003), PU 38 2/7 wks AOG, Cephalic, Postpartum Hemorrhage 2/2 uterine atony.",
      bloodTypeABO: "O",
      bloodTypeRh: "+",
      aog: "38 2/7 wks",
      complaint: "Profuse vaginal bleeding post-delivery, dizziness.",
      diet: "Regular",
      weight: "78kg",
      height: "158cm",
      adpie: ["Risk for hypovolemic shock.", "Control bleeding and stabilize VS.", "Fundal massage, fluids, meds.", "Bleeding controlled, VS stable."],
      io: ["300", "1500", "900", "0", "Close postpartum monitoring."],
    },
    {
      id: "mat-delapena-004",
      admissionNumber: "ADM-2026-004",
      lastName: "dela Peña",
      firstName: "Christine Joy",
      age: 29,
      gender: "Female",
      civilStatus: "Married",
      religion: "Roman Catholic",
      occupation: "Office Staff",
      address: "Naga City",
      dateOfBirth: "1997-02-14",
      attendingPhysician: "Dr. Ramon Villaflor",
      dateAdmitted: "2026-04-15",
      diagnosis: "Gravida 2 Para 1 (1001), PU 34 5/7 wks AOG, Placenta Previa Totalis.",
      bloodTypeABO: "A",
      bloodTypeRh: "+",
      aog: "34 5/7 wks",
      complaint: "Painless vaginal bleeding.",
      diet: "High iron",
      weight: "70kg",
      height: "162cm",
      adpie: ["Risk for hemorrhage.", "Prevent recurrent bleeding.", "Avoid vaginal exams, bed rest, prep for OR.", "No further bleeding."],
      io: ["800", "1000", "1100", "0", "Bleeding controlled."],
    },
  ];

  for (const p of patients) {
    await db.execute({
      sql: `
        INSERT INTO "MaternalPatient" (
          id, admissionNumber, lastName, firstName, age, gender, civilStatus, address, religion,
          dateOfBirth, occupation, contactNumber, dateAdmitted, dateDischarged, attendingPhysician,
          admittingDiagnosis, aog, bloodTypeABO, bloodTypeRh, status, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [
        p.id,
        p.admissionNumber,
        p.lastName,
        p.firstName,
        p.age,
        p.gender,
        p.civilStatus,
        p.address,
        p.religion,
        p.dateOfBirth,
        p.occupation,
        `0917-${p.id.slice(-4)}-0000`,
        p.dateAdmitted,
        p.dateDischarged ?? null,
        p.attendingPhysician,
        p.diagnosis,
        p.aog,
        p.bloodTypeABO,
        p.bloodTypeRh,
        p.status ?? "Active",
      ],
    });

    await db.execute({
      sql: `INSERT INTO "CarePlan" (id, maternalPatientId, diagnosis, planning, intervention, evaluation) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [`cp-${p.id}`, p.id, p.adpie[0], p.adpie[1], p.adpie[2], p.adpie[3]],
    });

    await db.execute({
      sql: `INSERT INTO "IntakeOutputSummary" (id, maternalPatientId, oralIntakeMl, ivIntakeMl, urineOutputMl, stoolCount, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [`io-${p.id}`, p.id, p.io[0], p.io[1], p.io[2], p.io[3], p.io[4]],
    });

    await db.execute({
      sql: `INSERT INTO "NurseNote" (id, date, time, shift, focus, data, action, response, maternalPatientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `nn-${p.id}-1`,
        p.dateAdmitted,
        "07:00",
        "AM",
        "Chief Complaint",
        p.complaint,
        "Initial assessment and physician notification.",
        "Patient monitored continuously.",
        p.id,
      ],
    });
  }

  const vitals = [
    ["vs-1", "mat-ocampo-001", "2026-04-02", "08:00", "130/85", "96", "20", "37.1"],
    ["vs-2", "mat-ocampo-001", "2026-04-02", "12:00", "128/84", "98", "20", "37.2"],
    ["vs-3", "mat-ocampo-001", "2026-04-02", "16:00", "135/88", "100", "22", "37.3"],
    ["vs-4", "mat-ocampo-001", "2026-04-02", "20:00", "132/86", "94", "20", "37.0"],
    ["vs-5", "mat-ocampo-001", "2026-04-03", "00:00", "130/85", "90", "20", "36.9"],
    ["vs-6", "mat-villanueva-002", "2026-04-06", "08:00", "152/98", "100", "20", "37.1"],
    ["vs-7", "mat-villanueva-002", "2026-04-07", "12:00", "138/88", "90", "20", "36.9"],
    ["vs-8", "mat-villanueva-002", "2026-04-09", "08:00", "126/80", "82", "18", "36.8"],
    ["vs-9", "mat-santos-003", "2026-04-10", "08:00", "100/60", "110", "22", "36.9"],
    ["vs-10", "mat-santos-003", "2026-04-10", "12:00", "98/58", "112", "22", "37.0"],
    ["vs-11", "mat-santos-003", "2026-04-10", "16:00", "102/60", "108", "21", "37.0"],
    ["vs-12", "mat-santos-003", "2026-04-10", "20:00", "105/65", "100", "20", "36.8"],
    ["vs-13", "mat-delapena-004", "2026-04-15", "08:00", "105/70", "88", "18", "36.9"],
    ["vs-14", "mat-delapena-004", "2026-04-15", "16:00", "110/70", "92", "18", "37.0"],
  ];

  for (const [id, maternalPatientId, date, time, bloodPressure, pulseRate, respiratoryRate, temperature] of vitals) {
    await db.execute({
      sql: `INSERT INTO "VitalSign" (id, maternalPatientId, date, time, bloodPressure, pulseRate, respiratoryRate, temperature, signature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      args: [id, maternalPatientId, date, time, bloodPressure, pulseRate, respiratoryRate, temperature, "RN"],
    });
  }

  const meds = [
    ["med-1", "mat-ocampo-001", "Regular Insulin (10u SQ before meals)", "2026-04-02", "08:00", "SQ"],
    ["med-2", "mat-ocampo-001", "Lactated Ringer's (1L IV)", "2026-04-02", "08:15", "IV"],
    ["med-3", "mat-ocampo-001", "Cefuroxime (750mg IV q8h)", "2026-04-02", "09:00", "IV"],
    ["med-4", "mat-villanueva-002", "Methyldopa (250mg PO q8h)", "2026-04-06", "08:00", "PO"],
    ["med-5", "mat-villanueva-002", "Mag Sulfate (IV)", "2026-04-06", "09:00", "IV"],
    ["med-6", "mat-villanueva-002", "Lactated Ringer's", "2026-04-06", "09:10", "IV"],
    ["med-7", "mat-villanueva-002", "Cefazolin (1g IV q8h)", "2026-04-06", "10:00", "IV"],
    ["med-8", "mat-santos-003", "Oxytocin (IV)", "2026-04-10", "08:00", "IV"],
    ["med-9", "mat-santos-003", "Methergine (IM)", "2026-04-10", "08:10", "IM"],
    ["med-10", "mat-santos-003", "Tranexamic Acid (IV)", "2026-04-10", "08:20", "IV"],
    ["med-11", "mat-santos-003", "Lactated Ringer's", "2026-04-10", "08:30", "IV"],
    ["med-12", "mat-delapena-004", "Lactated Ringer's", "2026-04-15", "09:00", "IV"],
    ["med-13", "mat-delapena-004", "Iron supplements", "2026-04-15", "09:30", "PO"],
    ["med-14", "mat-delapena-004", "Dexamethasone", "2026-04-15", "10:00", "IV"],
    ["med-15", "mat-delapena-004", "Cefazolin", "2026-04-15", "11:00", "IV"],
  ];

  for (const [id, maternalPatientId, medicationName, dateGiven, timeGiven, route] of meds) {
    await db.execute({
      sql: `INSERT INTO "Medication" (id, maternalPatientId, medicationName, dateGiven, timeGiven, route, givenBy) VALUES (?, ?, ?, ?, ?, ?, ?)` ,
      args: [id, maternalPatientId, medicationName, dateGiven, timeGiven, route, "RN"],
    });
  }

  const orders = [
    ["ord-1", "mat-ocampo-001", "2026-04-02", "Admit to L&D, VS q4h, FHR monitoring, CBG q4h, administer insulin, IV fluids, prep for possible C-section, NPO except sips of water."],
    ["ord-2", "mat-villanueva-002", "2026-04-06", "L&D admit, BP q4h, strict I&O, left lateral bed rest, low-salt diet, monitor preeclampsia signs, prep for delivery."],
    ["ord-3", "mat-santos-003", "2026-04-10", "VS q15-30m, fundal massage q15m, strict I&O, uterotonics, O2 PRN, prep for blood transfusion."],
    ["ord-4", "mat-delapena-004", "2026-04-15", "Strict bed rest, NO vaginal exams, continuous FHR, prep for C-section."],
  ];

  for (const [id, maternalPatientId, date, notes] of orders) {
    await db.execute({
      sql: `INSERT INTO "PhysicianOrder" (id, maternalPatientId, date, notes) VALUES (?, ?, ?, ?)` ,
      args: [id, maternalPatientId, date, notes],
    });
  }

  const diagnostics = [
    ["lab-1", "mat-ocampo-001", "2026-04-02", "12", "10.5k", "180k", null, "CBC; CBG Fasting 160, Random 180"],
    ["lab-2", "mat-villanueva-002", "2026-04-06", "11.5", "9.8k", "170k", "+1", "CBC + Urinalysis"],
    ["lab-3", "mat-santos-003", "2026-04-10", "9.8", null, "160k", null, "Hct decreased"],
    ["lab-4", "mat-delapena-004", "2026-04-15", "11.0", null, null, null, "CBC"],
  ];

  for (const [id, maternalPatientId, datePerformed, hemoglobin, wbcCount, plateletCount, urineProtein, remarks] of diagnostics) {
    await db.execute({
      sql: `INSERT INTO "LabResult" (id, maternalPatientId, datePerformed, hemoglobin, wbcCount, plateletCount, urineProtein, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
      args: [id, maternalPatientId, datePerformed, hemoglobin, wbcCount, plateletCount, urineProtein, remarks],
    });
  }

  const ultrasound = [
    ["utz-1", "mat-ocampo-001", "2026-04-02", "Breech, single live fetus, adequate fluid."],
    ["utz-2", "mat-villanueva-002", "2026-04-06", "Cephalic."],
    ["utz-3", "mat-delapena-004", "2026-04-15", "Placenta previa totalis."],
  ];

  for (const [id, maternalPatientId, datePerformed, impression] of ultrasound) {
    await db.execute({
      sql: `INSERT INTO "UltrasoundResult" (id, maternalPatientId, datePerformed, impression) VALUES (?, ?, ?, ?)` ,
      args: [id, maternalPatientId, datePerformed, impression],
    });
  }

  const ioCharts = [
    ["ioch-1", "mat-ocampo-001", "2026-04-02", "AM", 0, 1200],
    ["ioch-2", "mat-villanueva-002", "2026-04-08", "AM", 0, 1500],
    ["ioch-3", "mat-santos-003", "2026-04-10", "AM", 0, 900],
    ["ioch-4", "mat-delapena-004", "2026-04-15", "AM", 0, 1100],
  ];

  for (const [id, maternalPatientId, date, shift, stoolCount, urineCount] of ioCharts) {
    await db.execute({
      sql: `INSERT INTO "OutputChart" (id, maternalPatientId, date, shift, stoolCount, urineCount) VALUES (?, ?, ?, ?, ?, ?)` ,
      args: [id, maternalPatientId, date, shift, stoolCount, urineCount],
    });
  }

  console.log("Reset complete: 4 maternal patients inserted (SQL-first).\n");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
