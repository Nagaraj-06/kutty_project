require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const createMasterRoles = require("./seed/master_role");
const createMasterSkills = require("./seed/master_skills");

const prisma = new PrismaClient();

async function main() {
  await createMasterRoles(prisma);
  await createMasterSkills(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });