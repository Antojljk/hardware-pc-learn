import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Test équivalent à l'invocation qui échouait en production
  const user = await prisma.user.findFirst({
    where: { email: { contains: '' } },
    select: { id: true, email: true, username: true, plan: true, xp: true, streak: true },
  });
  console.log('prisma.user.findFirst() -> OK');
  console.log('User trouvé (1er de la base) :', JSON.stringify(user, null, 2));

  // Test de comptage simple pour confirmer la pleine lecture
  const count = await prisma.user.count();
  console.log('prisma.user.count() ->', count);

  // Test spécifique sur le champ plan (lecture colonne)
  const plans = await prisma.user.groupBy({
    by: ['plan'],
    _count: { _all: true },
  });
  console.log('Répartition par plan :', JSON.stringify(plans, null, 2));
}

main()
  .then(() => {
    console.log('\nTEST PRISMA: OK');
  })
  .catch((e) => {
    console.error('\nTEST PRISMA: ECHEC');
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
