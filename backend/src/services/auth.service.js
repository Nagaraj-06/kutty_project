const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const prisma = new PrismaClient();

// Signup service
async function signupUser({ user_name, email, password }) {
  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userRole = await prisma.roles_master.findUnique({
    where: { name: "user" },
  });

  const user = await prisma.users.create({
    data: {
      user_name,
      email,
      password_hash: hashedPassword,
      role_id: userRole.id,
    },
  });

  return { user };
}

// Login service
async function loginUser({ email, password }) {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({ id: user.id, email: user.email });

  return { user, token };
}

module.exports = { signupUser, loginUser };
