async function createMasterSkills(prisma) {
  console.log("Seeding skills...");

  const data = [
    // Tech
    { name: "Networking", is_active: true },
    { name: "Python", is_active: true },
    { name: "SQL", is_active: true },

    // Design
    { name: "Photoshop Design", is_active: true },
    { name: "UI/UX Design", is_active: true },
    { name: "Figma", is_active: true },
    { name: "Graphic Design", is_active: true },

    // Business / Soft skills
    { name: "Communication", is_active: true },
    { name: "Public Speaking", is_active: true },
    { name: "Leadership", is_active: true },
    { name: "Time Management", is_active: true },

    // Other
    { name: "Content Writing", is_active: true },
    { name: "Digital Marketing", is_active: true },
    { name: "Video Editing", is_active: true },
    { name: "Excel", is_active: true },
  ];

  await prisma.skills_master.createMany({
    data,
    skipDuplicates: true,
  });
}

module.exports = createMasterSkills;
