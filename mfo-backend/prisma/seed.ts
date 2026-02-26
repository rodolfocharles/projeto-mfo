import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  // Limpa o banco
  await prisma.projectionResult.deleteMany()
  await prisma.allocationSnapshot.deleteMany()
  await prisma.simulation.deleteMany()
  await prisma.movement.deleteMany()
  await prisma.insurance.deleteMany()
  await prisma.allocation.deleteMany()
  await prisma.snapshot.deleteMany()
  await prisma.client.deleteMany()

  console.log('Banco limpo')

  // Cliente
  const client = await prisma.client.create({
    data: {
      name: 'Rodolfo Charles',
      email: 'rosdolfo@mfo.com',
      password: 'temp_password_hash',
      birthDate: new Date('1980-03-15'),
      lifeStatus: 'NORMAL',
    },
  })

  console.log('Cliente criado:', client.id)

  // Alocações
  const aloc1 = await prisma.allocation.create({
    data: {
      clientId: client.id,
      name: 'Tesouro Direto',
      type: 'FINANCIAL',
      value: 150000,
      startDate: new Date('2024-01-01'),
      contribution: 2000,
      rate: 0.06,
      isTaxable: true,
    },
  })

  const aloc2 = await prisma.allocation.create({
    data: {
      clientId: client.id,
      name: 'Acoes',
      type: 'FINANCIAL',
      value: 80000,
      startDate: new Date('2024-01-01'),
      contribution: 1000,
      rate: 0.10,
      isTaxable: true,
    },
  })

  const aloc3 = await prisma.allocation.create({
    data: {
      clientId: client.id,
      name: 'Apartamento',
      type: 'IMMOBILIZED',
      value: 850000,
      startDate: new Date('2020-06-01'),
      contribution: 0,
      rate: 0.03,
      isTaxable: false,
      isFinanced: true,
      downPayment: 170000,
      installments: 240,
      interestRate: 0.089,
    },
  })

  console.log('Alocacoes criadas')

  // Snapshot
  const snapshot = await prisma.snapshot.create({
    data: {
      clientId: client.id,
      date: new Date('2024-12-31'),
      name: 'Fechamento 2024',
      financialTotal: 230000,
      immobilizedTotal: 850000,
      totalValue: 1080000,
    },
  })

  await prisma.allocationSnapshot.create({
    data: {
      snapshotId: snapshot.id,
      allocationId: aloc1.id,
      valueAtSnapshot: 150000,
    },
  })

  await prisma.allocationSnapshot.create({
    data: {
      snapshotId: snapshot.id,
      allocationId: aloc2.id,
      valueAtSnapshot: 80000,
    },
  })

  await prisma.allocationSnapshot.create({
    data: {
      snapshotId: snapshot.id,
      allocationId: aloc3.id,
      valueAtSnapshot: 850000,
    },
  })

  console.log('Snapshot criado')

  // Movimentacoes
  await prisma.movement.create({
    data: {
      clientId: client.id,
      name: 'Salario',
      type: 'INCOME',
      value: 25000,
      startDate: new Date('2025-01-01'),
      frequency: 'MONTHLY',
      isRecurrent: true,
      isIndexed: true,
      indexationRate: 0.04,
    },
  })

  await prisma.movement.create({
    data: {
      clientId: client.id,
      name: 'Despesas Fixas',
      type: 'EXPENSE',
      value: 12000,
      startDate: new Date('2025-01-01'),
      frequency: 'MONTHLY',
      isRecurrent: true,
      isIndexed: true,
      indexationRate: 0.04,
    },
  })

  await prisma.movement.create({
    data: {
      clientId: client.id,
      name: 'Aporte Mensal',
      type: 'INVESTMENT',
      value: 3500,
      startDate: new Date('2025-01-01'),
      frequency: 'MONTHLY',
      isRecurrent: true,
      isIndexed: false,
    },
  })

  console.log('Movimentacoes criadas')

  // Seguros
  await prisma.insurance.create({
    data: {
      clientId: client.id,
      name: 'Seguro de Vida',
      type: 'LIFE',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2045-01-01'),
      durationMonths: 240,
      monthlyPremium: 350,
      insuredAmount: 1000000,
      coverage: 1000000,
      premium: 350,
      isActive: true,
    },
  })

  await prisma.insurance.create({
    data: {
      clientId: client.id,
      name: 'Seguro de Invalidez',
      type: 'DISABILITY',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2045-01-01'),
      durationMonths: 240,
      monthlyPremium: 200,
      insuredAmount: 500000,
      coverage: 500000,
      premium: 200,
      isActive: true,
    },
  })

  console.log('Seguros criados')

  // Simulacoes
  await prisma.simulation.create({
    data: {
      clientId: client.id,
      name: 'Plano Original',
      version: 1,
      scenario: 'MODERATE',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2065-01-01'),
      retirementAge: 65,
      realRate: 0.05,
      inflation: 0.04,
      lifeStatus: 'NORMAL',
      isActive: true,
    },
  })

  await prisma.simulation.create({
    data: {
      clientId: client.id,
      name: 'Aposentar mais cedo',
      version: 1,
      scenario: 'CONSERVATIVE',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2062-01-01'),
      retirementAge: 62,
      realRate: 0.04,
      inflation: 0.04,
      lifeStatus: 'NORMAL',
      isActive: true,
    },
  })

  await prisma.simulation.create({
    data: {
      clientId: client.id,
      name: 'Plano Original',
      version: 2,
      scenario: 'AGGRESSIVE',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2065-01-01'),
      retirementAge: 65,
      realRate: 0.07,
      inflation: 0.035,
      lifeStatus: 'NORMAL',
      isActive: true,
    },
  })

  console.log('Simulacoes criadas')
  console.log('Seed concluido!')
  console.log('CLIENT_ID:', client.id)
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
