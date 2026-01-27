-- CreateEnum
CREATE TYPE "TipoMEI" AS ENUM ('COMERCIO', 'SERVICOS', 'MISTO', 'CAMINHONEIRO');

-- CreateEnum
CREATE TYPE "Plano" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "TipoCalculo" AS ENUM ('MARGEM_LUCRO', 'PRECO_HORA', 'PRECIFICACAO', 'FATURAMENTO', 'FLUXO_CAIXA', 'CALENDARIO_DAS');

-- CreateEnum
CREATE TYPE "TipoAlerta" AS ENUM ('DAS_VENCIMENTO', 'FATURAMENTO_LIMITE', 'ANUAL_DECLARACAO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "tipoMEI" "TipoMEI",
    "cnpj" TEXT,
    "temFuncionario" BOOLEAN NOT NULL DEFAULT false,
    "faturamentoMedio" DOUBLE PRECISION,
    "ocupacao" TEXT,
    "plano" "Plano" NOT NULL DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" TIMESTAMP(3),
    "alertasEmail" BOOLEAN NOT NULL DEFAULT true,
    "alertasWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "whatsapp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calculo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipo" "TipoCalculo" NOT NULL,
    "inputs" JSONB NOT NULL,
    "resultado" JSONB NOT NULL,
    "titulo" TEXT,
    "descricao" TEXT,
    "formulaVersion" TEXT DEFAULT '2026-01-27',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipo" "TipoAlerta" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "diasAntecedencia" INTEGER NOT NULL DEFAULT 7,
    "ultimoEnvio" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Calculo_userId_createdAt_idx" ON "Calculo"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Calculo_tipo_idx" ON "Calculo"("tipo");

-- CreateIndex
CREATE INDEX "Alerta_userId_ativo_idx" ON "Alerta"("userId", "ativo");

-- AddForeignKey
ALTER TABLE "Calculo" ADD CONSTRAINT "Calculo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
