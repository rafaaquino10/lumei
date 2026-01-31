'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { calcularDAS, DASResultado } from '@/lib/calculos'
import { Calendar, ExternalLink, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth/context'
import { trackCalculatorUsed, trackCalculatorCompleted } from '@/lib/analytics'
import Link from 'next/link'

type TipoMEI = 'COMERCIO' | 'SERVICOS' | 'MISTO' | 'CAMINHONEIRO'

const MESES_COMPLETO = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export default function DASPage() {
  const { user } = useAuth()
  const [tipoMEI, setTipoMEI] = useState<TipoMEI>('COMERCIO')
  const anoAtual = new Date().getFullYear()

  useEffect(() => {
    trackCalculatorUsed('calendario_das')
  }, [])

  // Try to get tipo from user's profile
  useEffect(() => {
    const fetchUserTipo = async () => {
      if (user) {
        try {
          const response = await fetch('/api/user/me')
          const data = await response.json()
          if (data.tipoMEI) {
            setTipoMEI(data.tipoMEI)
          }
        } catch (error) {
          console.error('Error fetching user tipo:', error)
        }
      }
    }
    fetchUserTipo()
  }, [user])

  const resultado: DASResultado = useMemo(() => calcularDAS({ tipoMEI }), [tipoMEI])

  useEffect(() => {
    trackCalculatorCompleted('calendario_das')
  }, [tipoMEI])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-mei-600">
          Home
        </Link>
        {' / '}
        <span className="text-gray-900">Calendário DAS</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Calendário DAS {resultado.anoReferencia}
        </h1>
        <p className="text-lg text-gray-600">
          Nunca mais atrase o pagamento do DAS. Veja todos os vencimentos do ano.
        </p>
      </div>

      {(resultado.anoReferencia !== anoAtual || resultado.fonteValores !== 'default') && (
        <Card className="p-6 mb-8 bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 mb-1">
                Valores de referência
              </p>
              <p className="text-sm text-yellow-800">
                Ano solicitado: {resultado.anoSolicitado}. Ano aplicado:{' '}
                {resultado.anoReferencia}. Fonte: {resultado.fonteValores}.
              </p>
              <p className="text-sm text-yellow-800">
                Salário mínimo considerado: R$ {resultado.salarioMinimo.toFixed(2)}.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tipo MEI Selector */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Selecione seu Tipo de MEI</h2>
        <RadioGroup
          value={tipoMEI}
          onValueChange={(value) => setTipoMEI(value as TipoMEI)}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="COMERCIO" id="comercio" />
              <Label htmlFor="comercio" className="flex-1 cursor-pointer">
                <div className="font-semibold">Comércio/Indústria</div>
                <div className="text-sm text-gray-600">
                  R$ {resultado.composicao.inss.toFixed(2)} (INSS) + R${' '}
                  {resultado.composicao.icms?.toFixed(2)} (ICMS)
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="SERVICOS" id="servicos" />
              <Label htmlFor="servicos" className="flex-1 cursor-pointer">
                <div className="font-semibold">Serviços</div>
                <div className="text-sm text-gray-600">
                  R$ {resultado.composicao.inss.toFixed(2)} (INSS) + R${' '}
                  {resultado.composicao.iss?.toFixed(2)} (ISS)
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="MISTO" id="misto" />
              <Label htmlFor="misto" className="flex-1 cursor-pointer">
                <div className="font-semibold">Misto</div>
                <div className="text-sm text-gray-600">
                  R$ {resultado.composicao.inss.toFixed(2)} (INSS) + R${' '}
                  {resultado.composicao.icms?.toFixed(2)} (ICMS) + R${' '}
                  {resultado.composicao.iss?.toFixed(2)} (ISS)
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="CAMINHONEIRO" id="caminhoneiro" />
              <Label htmlFor="caminhoneiro" className="flex-1 cursor-pointer">
                <div className="font-semibold">Caminhoneiro</div>
                <div className="text-sm text-gray-600">
                  R$ {resultado.composicao.inss.toFixed(2)} (INSS 12%) + R${' '}
                  {resultado.composicao.icms?.toFixed(2)} (ICMS)
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </Card>

      {/* Summary Card */}
      <Card className="p-8 mb-8 bg-mei-50">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 mb-2">Valor Mensal</p>
            <p className="text-3xl font-bold text-mei-600 font-mono">
              R$ {resultado.valorMensal.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-2">Total Anual</p>
            <p className="text-3xl font-bold font-mono">
              R$ {resultado.valorAnual.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-2">Próximo Vencimento</p>
            <p className="text-lg font-bold">
              {resultado.proximoVencimento.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
              })}
            </p>
            <p className="text-sm text-gray-600">
              em {resultado.diasAteVencimento} dias
            </p>
          </div>
        </div>
      </Card>

      {/* Alert for upcoming payment */}
      {resultado.diasAteVencimento <= 7 && (
        <Card className="p-6 mb-8 bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-2">
                ⚠️ DAS vence em {resultado.diasAteVencimento} dias!
              </h3>
              <p className="text-gray-700 mb-3">
                Valor: R$ {resultado.valorMensal.toFixed(2)} | Vencimento:{' '}
                {resultado.proximoVencimento.toLocaleDateString('pt-BR')}
              </p>
              <a
                href="https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  Gerar DAS no Portal
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </Card>
      )}

      {/* Calendar */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          Calendário Anual {resultado.anoReferencia}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resultado.calendarioAnual.map((item, index) => {
            const isProximo = item.status === 'PROXIMO'
            const isVencido = item.status === 'VENCIDO'

            return (
              <motion.div
                key={item.mes}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`p-6 ${
                    isProximo
                      ? 'border-2 border-yellow-500 bg-yellow-50'
                      : isVencido
                      ? 'border border-red-300 bg-red-50 opacity-60'
                      : 'border border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-lg">{item.mesNome}</p>
                      <p className="text-sm text-gray-600">
                        Referente a {MESES_COMPLETO[index]}
                      </p>
                    </div>
                    {isProximo && (
                      <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                        Próximo
                      </span>
                    )}
                    {isVencido && (
                      <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded">
                        Vencido
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Vencimento:{' '}
                      {item.vencimento.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-lg font-bold font-mono">
                    R$ {item.valor.toFixed(2)}
                  </p>

                  {isProximo && (
                    <a
                      href="https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block"
                    >
                      <Button size="sm" className="w-full" variant="outline">
                        Gerar DAS
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </a>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CTA Premium */}
      <Card className="p-4 bg-gradient-to-r from-mei-50 to-mei-100 border-mei-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Quer receber alertas automáticos?
            </h3>
            <p className="text-gray-700">
              Com Calcula MEI Premium você recebe alertas 5, 3 e 1 dia antes do
              vencimento por email e WhatsApp. Nunca mais atrase!
            </p>
          </div>
          <Link href="/premium">
            <Button size="lg" className="whitespace-nowrap">
              Ver Premium →
            </Button>
          </Link>
        </div>
      </Card>

      {/* Explanation */}
      <div className="mt-12 bg-gray-50 rounded-mei-lg p-8">
        <h3 className="text-2xl font-bold mb-4">Sobre o DAS</h3>
        <div className="prose max-w-none text-gray-600 space-y-4">
          <p>
            O DAS (Documento de Arrecadação do Simples Nacional) é o boleto que o
            MEI paga mensalmente. Ele inclui:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>INSS:</strong> Garante sua aposentadoria, auxílio-doença,
              salário-maternidade
            </li>
            <li>
              <strong>ICMS:</strong> Imposto estadual (só para comércio/indústria)
            </li>
            <li>
              <strong>ISS:</strong> Imposto municipal (só para serviços)
            </li>
          </ul>
          <p>
            <strong>Vencimento:</strong> Todo dia 20 do mês seguinte (ex: DAS de
            janeiro vence em 20/02)
          </p>
          <p>
            <strong>Importante:</strong> Mesmo que você não tenha faturado no mês,
            o DAS é obrigatório. Atrasar gera multa e juros.
          </p>
          <p className="text-sm mt-4">
            ⚠️ <strong>Atenção:</strong> Valores são referência de{' '}
            {resultado.anoReferencia}. Sempre confirme no{' '}
            <a
              href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mei-600 hover:underline"
            >
              Portal do Empreendedor
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
