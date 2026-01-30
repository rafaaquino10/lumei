import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth/password'

const prisma = new PrismaClient()

// Demo account credentials
const DEMO_EMAIL = 'demo@calculamei.com.br'
const DEMO_PASSWORD = 'Demo@123'

async function main() {
  console.log('Starting seed...')

  // Hash the demo password
  const passwordHash = await hashPassword(DEMO_PASSWORD)

  // Create or update demo user
  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      passwordHash,
      name: 'Usuário Demo',
      tipoMEI: 'SERVICOS',
      ocupacao: 'Designer Gráfico',
      temFuncionario: false,
      faturamentoMedio: 4500,
    },
    create: {
      email: DEMO_EMAIL,
      passwordHash,
      name: 'Usuário Demo',
      tipoMEI: 'SERVICOS',
      ocupacao: 'Designer Gráfico',
      temFuncionario: false,
      faturamentoMedio: 4500,
    },
  })

  console.log(`Demo user created/updated: ${demoUser.email}`)

  // Delete existing calculations for demo user
  await prisma.calculo.deleteMany({
    where: { userId: demoUser.id },
  })

  // =====================================================
  // FIXTURE 1: Iniciante (Beginner - Low revenue)
  // =====================================================
  await prisma.calculo.create({
    data: {
      userId: demoUser.id,
      tipo: 'MARGEM_LUCRO',
      titulo: 'Análise - Logo para startup',
      inputs: {
        custoTotal: 150,
        precoVenda: 350,
      },
      resultado: {
        lucro: 200,
        margemBruta: 57.14,
        margemLiquida: 52.5,
        markup: 133.33,
      },
      formulaVersion: '2026-01-27',
    },
  })

  await prisma.calculo.create({
    data: {
      userId: demoUser.id,
      tipo: 'PRECO_HORA',
      titulo: 'Meu valor/hora como designer',
      inputs: {
        horasTrabalhadasMes: 120,
        custosMensais: 800,
        lucroDesejado: 30,
      },
      resultado: {
        custoPorHora: 6.67,
        precoHoraMinimo: 8.67,
        precoHoraFinal: 11.27,
      },
      formulaVersion: '2026-01-27',
    },
  })

  await prisma.calculo.create({
    data: {
      userId: demoUser.id,
      tipo: 'FATURAMENTO',
      titulo: 'Projeção primeiro semestre',
      inputs: {
        faturamentoMensal: 2500,
        mesesRestantes: 6,
        faturamentoAcumulado: 15000,
      },
      resultado: {
        faturamentoProjetado: 30000,
        percentualUsado: 37.04,
        status: 'TRANQUILO',
        margemRestante: 51000,
        alertas: [],
      },
      formulaVersion: '2026-01-27',
    },
  })

  // =====================================================
  // FIXTURE 2: Próximo do limite (Close to MEI limit)
  // =====================================================
  await prisma.calculo.create({
    data: {
      userId: demoUser.id,
      tipo: 'MARGEM_LUCRO',
      titulo: 'Projeto grande - Identidade visual',
      inputs: {
        custoTotal: 1200,
        precoVenda: 4500,
      },
      resultado: {
        lucro: 3300,
        margemBruta: 73.33,
        margemLiquida: 68.5,
        markup: 275,
      },
      formulaVersion: '2026-01-27',
    },
  })

  await prisma.calculo.create({
    data: {
      userId: demoUser.id,
      tipo: 'FATURAMENTO',
      titulo: 'Atenção! Próximo do teto',
      inputs: {
        faturamentoMensal: 7200,
        mesesRestantes: 2,
        faturamentoAcumulado: 68000,
      },
      resultado: {
        faturamentoProjetado: 82400,
        percentualUsado: 101.73,
        status: 'ATENCAO',
        margemRestante: -1400,
        alertas: [
          'Você está próximo de ultrapassar o limite do MEI!',
          'Considere reduzir faturamento ou planejar transição para ME.',
        ],
      },
      formulaVersion: '2026-01-27',
    },
  })

  await prisma.calculo.create({
    data: {
      userId: demoUser.id,
      tipo: 'FLUXO_CAIXA',
      titulo: 'Fluxo de caixa outubro',
      inputs: {
        saldoInicial: 3500,
        entradas: [
          { descricao: 'Cliente A - Logo', valor: 2800 },
          { descricao: 'Cliente B - Social', valor: 1500 },
          { descricao: 'Cliente C - Site', valor: 3200 },
        ],
        saidas: [
          { descricao: 'Aluguel coworking', valor: 450, categoria: 'FIXO' },
          { descricao: 'Adobe Creative', valor: 120, categoria: 'FIXO' },
          { descricao: 'Internet', valor: 150, categoria: 'FIXO' },
          { descricao: 'DAS', valor: 75.40, categoria: 'IMPOSTOS' },
          { descricao: 'Impressão material', valor: 280, categoria: 'VARIAVEL' },
        ],
      },
      resultado: {
        totalEntradas: 7500,
        totalSaidas: 1075.40,
        saldo: 9924.60,
        percentualDespesas: 14.34,
      },
      formulaVersion: '2026-01-27',
    },
  })

  // =====================================================
  // FIXTURE 3: Desenquadrado (Over the limit)
  // =====================================================
  await prisma.calculo.create({
    data: {
      userId: demoUser.id,
      tipo: 'FATURAMENTO',
      titulo: 'URGENTE: Limite ultrapassado!',
      inputs: {
        faturamentoMensal: 9500,
        mesesRestantes: 1,
        faturamentoAcumulado: 85000,
      },
      resultado: {
        faturamentoProjetado: 94500,
        percentualUsado: 116.67,
        status: 'DESENQUADRADO',
        margemRestante: -13500,
        alertas: [
          'Você ULTRAPASSOU o limite de R$ 81.000/ano do MEI!',
          'Ação necessária: Solicitar desenquadramento na Receita Federal.',
          'Você será tributado como Simples Nacional retroativamente.',
          'Consulte um contador para regularizar sua situação.',
        ],
      },
      formulaVersion: '2026-01-27',
    },
  })

  await prisma.calculo.create({
    data: {
      userId: demoUser.id,
      tipo: 'PRECIFICACAO',
      titulo: 'Ajuste de preços - novo cenário',
      inputs: {
        custoUnitario: 45,
        margemDesejada: 60,
        despesasFixasRateadas: 15,
        impostos: 12, // Já considerando tributos maiores fora do MEI
      },
      resultado: {
        precoVenda: 180,
        lucroUnitario: 108,
        markup: 300,
        pontoEquilibrio: 28,
      },
      formulaVersion: '2026-01-27',
    },
  })

  await prisma.calculo.create({
    data: {
      userId: demoUser.id,
      tipo: 'CALENDARIO_DAS',
      titulo: 'Calendário DAS 2026',
      inputs: {
        tipoMEI: 'SERVICOS',
      },
      resultado: {
        valorMensal: 75.40,
        valorAnual: 904.80,
        composicao: {
          inss: 70.40,
          iss: 5.00,
          icms: 0,
        },
        proximoVencimento: '2026-02-20',
        diasAteVencimento: 21,
      },
      formulaVersion: '2026-01-27',
    },
  })

  console.log('Seed completed successfully!')
  console.log('')
  console.log('========================================')
  console.log('Demo Account Credentials:')
  console.log(`Email: ${DEMO_EMAIL}`)
  console.log(`Password: ${DEMO_PASSWORD}`)
  console.log('========================================')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
