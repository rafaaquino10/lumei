import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'

// GET - Exportar todos os dados do usuário (LGPD)
export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar todos os dados do usuário
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        calculos: {
          select: {
            id: true,
            tipo: true,
            titulo: true,
            inputs: true,
            resultado: true,
            createdAt: true,
          },
        },
        registrosFaturamento: {
          select: {
            mes: true,
            ano: true,
            valor: true,
            notas: true,
            createdAt: true,
          },
        },
        alertas: {
          select: {
            tipo: true,
            ativo: true,
            diasAntecedencia: true,
          },
        },
      },
    })

    if (!userData) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Formatar dados para exportação
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        tipoMEI: userData.tipoMEI,
        cnpj: userData.cnpj,
        ocupacao: userData.ocupacao,
        faturamentoMedio: userData.faturamentoMedio,
        temFuncionario: userData.temFuncionario,
        plano: userData.plano,
        createdAt: userData.createdAt,
      },
      preferences: {
        alertasEmail: userData.alertasEmail,
        alertasWhatsApp: userData.alertasWhatsApp,
        whatsapp: userData.whatsapp,
      },
      calculos: userData.calculos,
      faturamento: userData.registrosFaturamento,
      alertas: userData.alertas,
    }

    // Retornar como download JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="calculamei-dados-${user.id}.json"`,
      },
    })
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
