import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    // For now, allow anonymous saves (will add auth later)
    const body = await request.json()
    const { tipo, inputs, resultado, titulo, descricao } = body
    
    // If user is logged in, save to their account
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      })
      
      if (user) {
        const calculo = await prisma.calculo.create({
          data: {
            userId: user.id,
            tipo,
            inputs,
            resultado,
            titulo,
            descricao,
          },
        })
        
        return NextResponse.json({ success: true, calculo })
      }
    }
    
    // If not logged in, return success but don't save
    // (Will prompt user to sign up)
    return NextResponse.json({ 
      success: false, 
      message: 'Faça login para salvar seus cálculos',
    })
    
  } catch (error) {
    console.error('Error saving calculation:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar cálculo' },
      { status: 500 }
    )
  }
}
