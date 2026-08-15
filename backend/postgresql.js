import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// The DATABASE_URL value is read from backend/.env. Keep credentials out of
// source control and configure a standard PostgreSQL connection string there.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
