async function createMasterSkills(prisma) {
  console.log("Seeding skills...");
  const data = [
    {
      name: "Networking",
      is_active: true,
    },
    {
      name: "Python",
      is_active: true,
    },
  ];

  await prisma.skills_master.createMany({
    data,
    skipDuplicates: true,
  });
}

module.exports = createMasterSkills;
