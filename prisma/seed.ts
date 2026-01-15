import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      password: 'password123', // TODO: Hash in production!
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: 'password123', // TODO: Hash in production!
    },
  });

  console.log('✅ Created users:', { user1: user1.email, user2: user2.email });

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      color: '#3B82F6',
      userId: user1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App',
      description: 'Develop new mobile application',
      color: '#10B981',
      userId: user1.id,
    },
  });

  console.log('✅ Created projects:', { project1: project1.name, project2: project2.name });

  // Create sample tags
  const tag1 = await prisma.tag.upsert({
    where: { name: 'urgent' },
    update: {},
    create: {
      name: 'urgent',
      color: '#EF4444',
    },
  });

  const tag2 = await prisma.tag.upsert({
    where: { name: 'frontend' },
    update: {},
    create: {
      name: 'frontend',
      color: '#8B5CF6',
    },
  });

  const tag3 = await prisma.tag.upsert({
    where: { name: 'backend' },
    update: {},
    create: {
      name: 'backend',
      color: '#F59E0B',
    },
  });

  console.log('✅ Created tags:', { tag1: tag1.name, tag2: tag2.name, tag3: tag3.name });

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design new homepage',
      description: 'Create mockups for the new homepage layout',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      userId: user1.id,
      projectId: project1.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      tags: {
        connect: [{ id: tag2.id }, { id: tag1.id }],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Set up database schema',
      description: 'Design and implement PostgreSQL database schema',
      status: 'DONE',
      priority: 'HIGH',
      userId: user1.id,
      projectId: project2.id,
      completedAt: new Date(),
      tags: {
        connect: [{ id: tag3.id }],
      },
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Write API documentation',
      description: 'Document all API endpoints and their usage',
      status: 'TODO',
      priority: 'MEDIUM',
      userId: user2.id,
      projectId: project2.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      tags: {
        connect: [{ id: tag3.id }],
      },
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Implement authentication',
      description: 'Add user login and registration functionality',
      status: 'TODO',
      priority: 'URGENT',
      userId: user1.id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      tags: {
        connect: [{ id: tag1.id }, { id: tag3.id }],
      },
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Update color scheme',
      description: 'Refresh the color palette across the application',
      status: 'CANCELLED',
      priority: 'LOW',
      userId: user2.id,
      projectId: project1.id,
      tags: {
        connect: [{ id: tag2.id }],
      },
    },
  });

  console.log('✅ Created tasks:', {
    task1: task1.title,
    task2: task2.title,
    task3: task3.title,
    task4: task4.title,
    task5: task5.title,
  });

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Users: 2`);
  console.log(`   Projects: 2`);
  console.log(`   Tags: 3`);
  console.log(`   Tasks: 5`);
  console.log('\n💡 You can now run "npm run db:studio" to view the data in Prisma Studio');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
