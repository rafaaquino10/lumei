'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  CheckCircle,
  Star,
} from 'lucide-react'

interface Contador {
  id: string
  nome: string
  email: string
  telefone?: string
  whatsapp?: string
  cidade: string
  estado: string
  especialidades: string[]
  bio?: string
  avatarUrl?: string
  website?: string
  verificado: boolean
}

export default function ContadoresPage() {
  const [contadores, setContadores] = useState<Contador[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')

  useEffect(() => {
    // Simula carregamento - em producao seria uma chamada API
    setLoading(true)
    setTimeout(() => {
      // Dados de exemplo
      setContadores([
        {
          id: '1',
          nome: 'Ana Paula Contabilidade',
          email: 'contato@anapaulacontabil.com.br',
          telefone: '(11) 99999-0001',
          whatsapp: '5511999990001',
          cidade: 'Sao Paulo',
          estado: 'SP',
          especialidades: ['MEI', 'Simples Nacional', 'Abertura de Empresa'],
          bio: 'Especialista em MEI e pequenas empresas ha mais de 10 anos.',
          verificado: true,
        },
        {
          id: '2',
          nome: 'Escritorio Silva & Associados',
          email: 'contato@silvacontabil.com.br',
          telefone: '(21) 99999-0002',
          whatsapp: '5521999990002',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
          especialidades: ['MEI', 'Lucro Presumido', 'Folha de Pagamento'],
          bio: 'Atendimento personalizado para empreendedores.',
          verificado: true,
        },
        {
          id: '3',
          nome: 'Contabilidade Digital MG',
          email: 'ola@contabilmg.com.br',
          cidade: 'Belo Horizonte',
          estado: 'MG',
          especialidades: ['MEI', 'Simples Nacional'],
          bio: 'Contabilidade 100% online para MEIs de todo Brasil.',
          website: 'https://contabilmg.com.br',
          verificado: false,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredContadores = contadores.filter(c => {
    const matchSearch = search === '' ||
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.cidade.toLowerCase().includes(search.toLowerCase()) ||
      c.especialidades.some(e => e.toLowerCase().includes(search.toLowerCase()))

    const matchEstado = estado === '' || c.estado === estado

    return matchSearch && matchEstado
  })

  const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'SC', 'GO', 'PE', 'CE']

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Encontre um Contador
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Contadores especializados em MEI e pequenas empresas prontos para te ajudar
        </p>
      </div>

      {/* Filtros */}
      <Card className="p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, cidade ou especialidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm min-w-[150px]"
          >
            <option value="">Todos os estados</option>
            {estados.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Lista de Contadores */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-accent" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-accent rounded w-3/4" />
                  <div className="h-4 bg-accent rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredContadores.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum contador encontrado com os filtros selecionados.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContadores.map((contador, index) => (
            <motion.div
              key={contador.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">
                      {contador.nome.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">
                        {contador.nome}
                      </h3>
                      {contador.verificado && (
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {contador.cidade}, {contador.estado}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {contador.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {contador.bio}
                  </p>
                )}

                {/* Especialidades */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {contador.especialidades.slice(0, 3).map(esp => (
                    <span
                      key={esp}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                    >
                      {esp}
                    </span>
                  ))}
                </div>

                {/* Acoes */}
                <div className="flex gap-2 mt-auto pt-4 border-t">
                  {contador.whatsapp && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(`https://wa.me/${contador.whatsapp}`, '_blank')}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`mailto:${contador.email}`, '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* CTA para contadores */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">
            Voce e contador?
          </h3>
          <p className="text-muted-foreground mb-4">
            Cadastre-se gratuitamente e alcance milhares de MEIs em busca de ajuda profissional.
          </p>
          <Button>
            Cadastrar meu escritorio
          </Button>
        </div>
      </Card>
    </div>
  )
}
