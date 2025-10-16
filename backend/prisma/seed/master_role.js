async function createMasterRoles(prisma) {
  console.log("Seeding roles...");

  const data = [
    {
      name: "admin",
      is_active: true,
    },
    {
      name: "user",
      is_active: true,
    },
  ];

  await prisma.roles_master.createMany({
    data,
    skipDuplicates: true,
  });
}

module.exports = createMasterRoles;