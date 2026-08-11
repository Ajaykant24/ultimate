/** @type {import('@prisma/internals').GetPrismaClientConfig} */
const config = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

module.exports = config;
