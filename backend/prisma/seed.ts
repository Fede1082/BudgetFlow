import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a default account
  const account = await prisma.account.create({
    data: {
      name: 'Main Account',
      balance: 0,
      type: 'checking',
    },
  });

  console.log(`✅ Created account: ${account.id}`);

  // Create sample transactions
  const transaction1 = await prisma.transaction.create({
    data: {
      title: 'Salary',
      amount: 3000,
      type: 'income',
      category: 'salary',
      date: new Date('2025-11-01'),
      accountId: account.id,
    },
  });

  const transaction2 = await prisma.transaction.create({
    data: {
      title: 'Groceries',
      amount: 120.5,
      type: 'expense',
      category: 'food',
      date: new Date('2025-11-05'),
      accountId: account.id,
    },
  });

  const transaction3 = await prisma.transaction.create({
    data: {
      title: 'Rent',
      amount: 800,
      type: 'expense',
      category: 'housing',
      date: new Date('2025-11-01'),
      accountId: account.id,
    },
  });

  console.log(`✅ Created transactions: ${transaction1.id}, ${transaction2.id}, ${transaction3.id}`);
  console.log('🌱 Seeding complete!');
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
