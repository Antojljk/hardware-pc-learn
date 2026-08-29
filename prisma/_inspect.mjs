import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Vérification que la base est bien la base de production Supabase
  const url = process.env.DATABASE_URL || '';
  console.log('DATABASE_URL host:', url.replace(/:[^:@/]+@/, ':***@').split('@')[1] || url);

  // 1. Liste des colonnes de la table "User" via information_schema
  const cols = await prisma.$queryRawUnsafe(
    `SELECT column_name, data_type, udt_name, column_default, is_nullable
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'User'
     ORDER BY ordinal_position;`
  );
  console.log('\n--- Colonnes de la table User ---');
  console.log(JSON.stringify(cols, null, 2));

  // 2. Présence du type enum "Plan"
  const enums = await prisma.$queryRawUnsafe(
    `SELECT t.typname, e.enumlabel
     FROM pg_type t
     JOIN pg_enum e ON t.oid = e.enumtypid
     WHERE t.typname = 'Plan'
     ORDER BY e.enumsortorder;`
  );
  console.log('\n--- Enum Plan ---');
  console.log(JSON.stringify(enums, null, 2));

  // 3. Nombre d'utilisateurs existants (pour confirmer qu'on n'a rien perdu)
  const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS n FROM "User";`);
  console.log('\n--- Nombre d utilisateurs ---');
  console.log(JSON.stringify(count, null, 2));
}

main()
  .catch((e) => {
    console.error('ERR:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
