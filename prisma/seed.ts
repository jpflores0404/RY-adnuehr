import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.newbornRecord.deleteMany({});
  await prisma.maternalPatient.deleteMany({});

  await prisma.maternalPatient.create({
    data: {
      admissionNumber: "ADM-2026-001",
      lastName: "Ocampo",
      firstName: "Jennifer Mae",
      age: 35,
      gender: "Female",
      civilStatus: "Married",
      religion: "Roman Catholic",
      occupation: "Vendor",
      address: "Iriga City",
      dateOfBirth: new Date("1990-08-15"),
      contactNumber: "09170000001",
      attendingPhysician: "Dr. Maria Teresa Reyes",
      dateAdmitted: new Date("2026-04-02"),
      admittingDiagnosis: "Gravida 5 Para 4 (4004), PU 35 4/7 wks AOG, Breech Presentation, In Labor, Pregestational DM.",
      aog: "35 4/7 weeks",
      preExistingIllness: "Pregestational DM",
      bloodTypeABO: "B",
      bloodTypeRh: "+",
      vitalSigns: {
        create: [
          { date: "2026-04-02", time: "08:00", bloodPressure: "130/85", pulseRate: "96", respiratoryRate: "20", temperature: "37.1", signature: "RN" },
          { date: "2026-04-02", time: "12:00", bloodPressure: "128/84", pulseRate: "98", respiratoryRate: "20", temperature: "37.2", signature: "RN" },
          { date: "2026-04-02", time: "16:00", bloodPressure: "135/88", pulseRate: "100", respiratoryRate: "22", temperature: "37.3", signature: "RN" },
          { date: "2026-04-02", time: "20:00", bloodPressure: "132/86", pulseRate: "94", respiratoryRate: "20", temperature: "37.0", signature: "RN" },
          { date: "2026-04-03", time: "00:00", bloodPressure: "130/85", pulseRate: "90", respiratoryRate: "20", temperature: "36.9", signature: "RN" },
        ],
      },
      medications: {
        create: [
          { medicationName: "Regular Insulin (10u before meals)", dateGiven: "2026-04-02", timeGiven: "08:00", route: "SQ", givenBy: "RN" },
          { medicationName: "Lactated Ringer's 1L", dateGiven: "2026-04-02", timeGiven: "08:15", route: "IV", givenBy: "RN" },
          { medicationName: "Cefuroxime 750mg q8h", dateGiven: "2026-04-02", timeGiven: "09:00", route: "IV", givenBy: "RN" },
        ],
      },
      physicianOrders: {
        create: [
          { date: "2026-04-02", notes: "Admit to L&D. VS q4h. FHR monitoring. CBG q4h. Administer insulin and IV fluids. Prepare for possible C-section. NPO except sips of water." },
        ],
      },
      nurseNotes: {
        create: [
          { date: "2026-04-02", time: "07:00", shift: "AM", focus: "Active labor", data: "CBG 180 mg/dL, ongoing contractions.", action: "Monitored labor and CBG; insulin given per order.", response: "CBG improved to 150 mg/dL." },
          { date: "2026-04-02", time: "15:00", shift: "PM", focus: "Breech presentation", data: "Contractions increasing.", action: "Prepared patient for possible C-section.", response: "Patient informed and consent prep completed." },
          { date: "2026-04-02", time: "23:00", shift: "NOC", focus: "Pre-op care", data: "For operative delivery prep.", action: "Maintained NPO and pre-op checklist.", response: "Patient ready for OR transfer." },
        ],
      },
      labResults: {
        create: [
          { datePerformed: "2026-04-02", hemoglobin: "12", wbcCount: "10.5k", plateletCount: "180k", remarks: "CBC" },
          { datePerformed: "2026-04-02", remarks: "CBG Fasting 160, Random 180" },
        ],
      },
      ultrasoundResults: {
        create: [{ datePerformed: "2026-04-02", impression: "Breech presentation, single live fetus, adequate amniotic fluid." }],
      },
      outputCharts: {
        create: [{ date: "2026-04-02", shift: "AM", stoolCount: 0, urineCount: 1200 }],
      },
    },
  });

  await prisma.maternalPatient.create({
    data: {
      admissionNumber: "ADM-2026-002",
      lastName: "Villanueva",
      firstName: "Angela Mae",
      age: 34,
      gender: "Female",
      civilStatus: "Married",
      religion: "Roman Catholic",
      occupation: "Storekeeper",
      address: "Naga City",
      dateOfBirth: new Date("1992-03-22"),
      contactNumber: "09170000002",
      attendingPhysician: "Dr. Carla Dominique Ramos",
      dateAdmitted: new Date("2026-04-06"),
      dateDischarged: new Date("2026-04-09"),
      status: "Discharged",
      admittingDiagnosis: "Gravida 4 Para 3 (3003), PU 37 1/7 wks AOG, Cephalic, Gestational HTN, In Labor.",
      aog: "37 1/7 weeks",
      bloodTypeABO: "A",
      bloodTypeRh: "+",
      vitalSigns: {
        create: [
          { date: "2026-04-06", time: "08:00", bloodPressure: "152/98", pulseRate: "100", respiratoryRate: "20", temperature: "37.1", signature: "RN" },
          { date: "2026-04-07", time: "08:00", bloodPressure: "140/90", pulseRate: "92", respiratoryRate: "20", temperature: "36.9", signature: "RN" },
          { date: "2026-04-09", time: "08:00", bloodPressure: "126/80", pulseRate: "82", respiratoryRate: "18", temperature: "36.8", signature: "RN" },
        ],
      },
      medications: {
        create: [
          { medicationName: "Methyldopa 250mg q8h", dateGiven: "2026-04-06", timeGiven: "08:00", route: "PO", givenBy: "RN" },
          { medicationName: "Magnesium Sulfate", dateGiven: "2026-04-06", timeGiven: "09:00", route: "IV", givenBy: "RN" },
          { medicationName: "Lactated Ringer's", dateGiven: "2026-04-06", timeGiven: "09:15", route: "IV", givenBy: "RN" },
          { medicationName: "Cefazolin 1g q8h", dateGiven: "2026-04-06", timeGiven: "10:00", route: "IV", givenBy: "RN" },
        ],
      },
      physicianOrders: {
        create: [{ date: "2026-04-06", notes: "L&D admit, BP q4h, strict I&O, left lateral bed rest, low-salt diet, monitor preeclampsia signs, prep for delivery." }],
      },
      nurseNotes: {
        create: [
          { date: "2026-04-06", time: "09:00", shift: "AM", focus: "Hypertension with headache", data: "BP 150/95 with severe headache.", action: "Administered antihypertensives and close monitoring.", response: "BP decreased and headache relieved." },
          { date: "2026-04-07", time: "14:00", shift: "PM", focus: "Labor progress", data: "Contractions regular; BP improving.", action: "Continued BP checks and labor support.", response: "Stable intrapartum status." },
          { date: "2026-04-09", time: "08:00", shift: "AM", focus: "Postpartum discharge prep", data: "Delivered healthy infant; BP 130/82.", action: "Postpartum care and discharge teaching.", response: "Prepared for discharge in stable condition." },
        ],
      },
      labResults: {
        create: [
          { datePerformed: "2026-04-06", hemoglobin: "11.5", wbcCount: "9.8k", plateletCount: "170k", remarks: "CBC" },
          { datePerformed: "2026-04-06", urineProtein: "+1", remarks: "Urinalysis" },
        ],
      },
      ultrasoundResults: {
        create: [{ datePerformed: "2026-04-06", impression: "Cephalic presentation." }],
      },
      outputCharts: {
        create: [{ date: "2026-04-08", shift: "AM", stoolCount: 0, urineCount: 1500 }],
      },
    },
  });

  await prisma.maternalPatient.create({
    data: {
      admissionNumber: "ADM-2026-003",
      lastName: "Santos",
      firstName: "Maria Luz",
      age: 32,
      gender: "Female",
      civilStatus: "Married",
      occupation: "Housewife",
      address: "Ligao City",
      dateOfBirth: new Date("1993-07-10"),
      contactNumber: "09170000003",
      attendingPhysician: "Dr. Evelyn Cruz",
      dateAdmitted: new Date("2026-04-10"),
      admittingDiagnosis: "Gravida 3 Para 3 (3003), PU 38 2/7 wks AOG, Cephalic, Postpartum Hemorrhage secondary to uterine atony.",
      aog: "38 2/7 weeks",
      bloodTypeABO: "O",
      bloodTypeRh: "+",
      vitalSigns: {
        create: [
          { date: "2026-04-10", time: "08:00", bloodPressure: "100/60", pulseRate: "110", respiratoryRate: "22", temperature: "36.9", signature: "RN" },
          { date: "2026-04-10", time: "12:00", bloodPressure: "98/58", pulseRate: "112", respiratoryRate: "22", temperature: "37.0", signature: "RN" },
          { date: "2026-04-10", time: "16:00", bloodPressure: "102/60", pulseRate: "108", respiratoryRate: "21", temperature: "37.0", signature: "RN" },
          { date: "2026-04-10", time: "20:00", bloodPressure: "105/65", pulseRate: "100", respiratoryRate: "20", temperature: "36.8", signature: "RN" },
        ],
      },
      medications: {
        create: [
          { medicationName: "Oxytocin", dateGiven: "2026-04-10", timeGiven: "08:00", route: "IV", givenBy: "RN" },
          { medicationName: "Methergine", dateGiven: "2026-04-10", timeGiven: "08:10", route: "IM", givenBy: "RN" },
          { medicationName: "Tranexamic Acid", dateGiven: "2026-04-10", timeGiven: "08:20", route: "IV", givenBy: "RN" },
          { medicationName: "Lactated Ringer's", dateGiven: "2026-04-10", timeGiven: "08:30", route: "IV", givenBy: "RN" },
        ],
      },
      physicianOrders: {
        create: [{ date: "2026-04-10", notes: "VS q15-30min, fundal massage q15min, strict I&O, uterotonics, oxygen PRN, prep for blood transfusion." }],
      },
      nurseNotes: {
        create: [{ date: "2026-04-10", time: "08:30", shift: "AM", focus: "Postpartum hemorrhage", data: "Heavy bleeding, boggy uterus.", action: "Fundal massage and uterotonic meds initiated.", response: "Bleeding reduced; uterus became firm." }],
      },
      labResults: {
        create: [{ datePerformed: "2026-04-10", hemoglobin: "9.8", plateletCount: "160k", remarks: "Hct decreased." }],
      },
    },
  });

  await prisma.maternalPatient.create({
    data: {
      admissionNumber: "ADM-2026-004",
      lastName: "dela Peña",
      firstName: "Christine Joy",
      age: 29,
      gender: "Female",
      civilStatus: "Married",
      occupation: "Office Staff",
      address: "Naga City",
      dateOfBirth: new Date("1997-02-14"),
      contactNumber: "09170000004",
      attendingPhysician: "Dr. Ramon Villaflor",
      dateAdmitted: new Date("2026-04-15"),
      admittingDiagnosis: "Gravida 2 Para 1 (1001), PU 34 5/7 wks AOG, Placenta Previa Totalis.",
      aog: "34 5/7 weeks",
      bloodTypeABO: "A",
      bloodTypeRh: "+",
      vitalSigns: {
        create: [
          { date: "2026-04-15", time: "08:00", bloodPressure: "105/70", pulseRate: "88", respiratoryRate: "18", temperature: "36.9", signature: "RN" },
          { date: "2026-04-15", time: "16:00", bloodPressure: "110/70", pulseRate: "92", respiratoryRate: "18", temperature: "37.0", signature: "RN" },
        ],
      },
      medications: {
        create: [
          { medicationName: "Lactated Ringer's", dateGiven: "2026-04-15", timeGiven: "09:00", route: "IV", givenBy: "RN" },
          { medicationName: "Iron Supplement", dateGiven: "2026-04-15", timeGiven: "09:30", route: "PO", givenBy: "RN" },
          { medicationName: "Dexamethasone", dateGiven: "2026-04-15", timeGiven: "10:00", route: "IV", givenBy: "RN" },
          { medicationName: "Cefazolin", dateGiven: "2026-04-15", timeGiven: "11:00", route: "IV", givenBy: "RN" },
        ],
      },
      physicianOrders: {
        create: [{ date: "2026-04-15", notes: "Strict bed rest, no vaginal exams, continuous FHR monitoring, prep for C-section." }],
      },
      nurseNotes: {
        create: [{ date: "2026-04-15", time: "09:00", shift: "AM", focus: "Placenta previa bleeding", data: "Painless bright red vaginal bleeding; UTZ confirmed previa.", action: "Maintained bed rest and continuous FHR monitoring.", response: "Bleeding controlled and fetal status stable." }],
      },
      labResults: {
        create: [{ datePerformed: "2026-04-15", hemoglobin: "11.0", remarks: "CBC" }],
      },
      ultrasoundResults: {
        create: [{ datePerformed: "2026-04-15", impression: "Placenta previa totalis." }],
      },
    },
  });

  console.log("Seeded 4 maternal patients.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
