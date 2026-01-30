export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  readTime: number;
  content: string;
  image: string;
}

export const posts: BlogPost[] = [
  {
    slug: "como-calcular-margem-de-lucro-mei",
    title: "Como Calcular Margem de Lucro para MEI",
    description:
      "Aprenda a calcular corretamente a margem de lucro do seu MEI e tome decisões financeiras mais inteligentes para seu negócio.",
    date: "2026-01-15",
    author: "Lumei",
    category: "Finanças",
    readTime: 5,
    image: "/blog/margem-lucro.jpg",
    content: `
      <h2>Por que a margem de lucro é importante?</h2>
      <p>A margem de lucro é um dos indicadores mais importantes para a saúde financeira do seu MEI. Ela mostra qual percentual do seu faturamento se transforma em lucro real após pagar todos os custos.</p>

      <h3>Tipos de Margem</h3>
      <p>Existem três tipos principais de margem que você deve conhecer:</p>

      <h4>1. Margem Bruta</h4>
      <p>É calculada subtraindo o custo do produto/serviço do preço de venda, dividido pelo preço de venda.</p>
      <p><strong>Fórmula:</strong> ((Receita - Custo Direto) / Receita) × 100</p>

      <h4>2. Margem Operacional</h4>
      <p>Leva em consideração também os custos operacionais (aluguel, água, luz, etc.).</p>
      <p><strong>Fórmula:</strong> ((Receita - Custos Totais) / Receita) × 100</p>

      <h4>3. Margem Líquida</h4>
      <p>É o lucro que sobra após descontar impostos e todas as despesas.</p>
      <p><strong>Fórmula:</strong> ((Receita - Despesas - Impostos) / Receita) × 100</p>

      <h3>Exemplo Prático</h3>
      <p>Imagine um MEI prestador de serviços que fatura R$ 5.000 em um mês:</p>
      <ul>
        <li>Custos diretos: R$ 1.500</li>
        <li>Custos operacionais: R$ 1.000</li>
        <li>Impostos: R$ 750</li>
      </ul>
      <p>Lucro Líquido = R$ 5.000 - R$ 1.500 - R$ 1.000 - R$ 750 = R$ 1.750</p>
      <p>Margem Líquida = (R$ 1.750 / R$ 5.000) × 100 = 35%</p>

      <h3>Dicas para Aumentar sua Margem</h3>
      <ul>
        <li><strong>Reduza custos:</strong> Negocie melhores preços com fornecedores</li>
        <li><strong>Aumente preços:</strong> Análise o mercado e ajuste seu precificação</li>
        <li><strong>Melhore eficiência:</strong> Reduza desperdícios e retrabalho</li>
        <li><strong>Automatize:</strong> Use ferramentas para reduzir tempo gasto</li>
      </ul>

      <h3>Qual é uma boa margem?</h3>
      <p>A margem ideal varia bastante por setor, mas em geral:</p>
      <ul>
        <li>Menos de 20%: Margem baixa, requer revisão</li>
        <li>20% a 40%: Margem saudável</li>
        <li>Acima de 40%: Margem excelente</li>
      </ul>

      <p>Use a Calculadora de Margem de Lucro do Lumei para acompanhar sua margem mensalmente e identificar oportunidades de melhoria!</p>
    `,
  },
  {
    slug: "calendario-das-2026",
    title: "Calendário DAS 2026: Datas Importantes para MEI",
    description:
      "Confira o calendário completo de vencimentos do DAS 2026 e não perca nenhuma data importante para seu MEI.",
    date: "2026-01-10",
    author: "Lumei",
    category: "Impostos",
    readTime: 4,
    image: "/blog/calendario-das.jpg",
    content: `
      <h2>O que é DAS?</h2>
      <p>O DAS (Documento de Arrecadação do Simples Nacional) é a guia de pagamento de impostos e contribuições para MEIs. É obrigatório pagar mensalmente, e o valor varia de acordo com seu faturamento.</p>

      <h3>Calendário DAS 2026</h3>
      <p>Aqui estão as datas de vencimento do DAS para 2026. O pagamento deve ser realizado até o dia 20 de cada mês:</p>

      <ul>
        <li><strong>Janeiro:</strong> Vencimento dia 20/01</li>
        <li><strong>Fevereiro:</strong> Vencimento dia 20/02</li>
        <li><strong>Março:</strong> Vencimento dia 20/03</li>
        <li><strong>Abril:</strong> Vencimento dia 20/04</li>
        <li><strong>Maio:</strong> Vencimento dia 20/05</li>
        <li><strong>Junho:</strong> Vencimento dia 20/06</li>
        <li><strong>Julho:</strong> Vencimento dia 20/07</li>
        <li><strong>Agosto:</strong> Vencimento dia 20/08</li>
        <li><strong>Setembro:</strong> Vencimento dia 20/09</li>
        <li><strong>Outubro:</strong> Vencimento dia 20/10</li>
        <li><strong>Novembro:</strong> Vencimento dia 20/11</li>
        <li><strong>Dezembro:</strong> Vencimento dia 20/12</li>
      </ul>

      <h3>Como Gerar o DAS?</h3>
      <p>O DAS é gerado automaticamente no Portal do Empreendedor. Você pode acessá-lo em qualquer dia do mês anterior, mas o pagamento deve ser realizado até o dia 20.</p>

      <h3>Valor Mínimo do DAS 2026</h3>
      <p>O salário mínimo em 2026 é de R$ 1.518,00. O DAS tem valor mínimo, que é calculado com base nesse valor.</p>

      <h3>Dicas Importantes</h3>
      <ul>
        <li><strong>Marque as datas:</strong> Use calendário ou alarme para não perder os prazos</li>
        <li><strong>Pague adiantado:</strong> Se tiver dúvidas, pague alguns dias antes do vencimento</li>
        <li><strong>Guarde comprovantes:</strong> Todos os DAS pagos são dedutíveis do imposto de renda</li>
        <li><strong>Acompanhe alterações:</strong> O governo pode liberar novas informações durante o ano</li>
      </ul>

      <h3>Consequências do Atraso</h3>
      <p>Se você não pagar o DAS na data correta:</p>
      <ul>
        <li>Multa de 0,33% ao dia</li>
        <li>Juros de mora</li>
        <li>Risco de cancelamento de inscrição</li>
        <li>Problemas ao tentar obter crédito</li>
      </ul>

      <p>Use a Calculadora de DAS do Lumei para acompanhar seus pagamentos e se organizar financeiramente!</p>
    `,
  },
  {
    slug: "como-calcular-preco-por-hora-freelancer-mei",
    title: "Como Calcular Seu Preço por Hora como Freelancer MEI",
    description:
      "Descubra como calcular o preço ideal por hora para sua prestação de serviço como freelancer MEI e aumentar seus ganhos.",
    date: "2026-01-05",
    author: "Lumei",
    category: "Precificação",
    readTime: 6,
    image: "/blog/preco-hora.jpg",
    content: `
      <h2>Por que definir um preço por hora é essencial?</h2>
      <p>Muitos freelancers MEI cobram preços muito baixos simplesmente porque não sabem calcular corretamente quanto devem ganhar por hora. Isso afeta sua rentabilidade e qualidade de vida.</p>

      <h3>Método 1: Baseado no Custo de Vida</h3>
      <p>Este é o método mais simples e recomendado para iniciantes:</p>

      <h4>Passo 1: Calcule suas despesas mensais</h4>
      <p>Some todas as suas despesas pessoais e profissionais:</p>
      <ul>
        <li>Aluguel/Moradia</li>
        <li>Alimentação</li>
        <li>Transporte</li>
        <li>Internet/Telefone</li>
        <li>Ferramentas e software</li>
        <li>Educação/Cursos</li>
        <li>Fundo de emergência (10% das despesas)</li>
      </ul>

      <h4>Passo 2: Defina uma meta de lucro</h4>
      <p>Seu salário líquido ideal por mês. Exemplo: R$ 3.000 a R$ 5.000</p>

      <h4>Passo 3: Calcule a renda necessária</h4>
      <p><strong>Fórmula:</strong> (Despesas + Meta de Lucro) / (1 - Taxa de Impostos)</p>
      <p>Para MEI com alíquota de 8% a 16%:</p>
      <p><strong>Exemplo:</strong> (R$ 2.500 + R$ 4.000) / (1 - 0.11) = R$ 7.303 (renda bruta necessária)</p>

      <h4>Passo 4: Calcule horas faturáveis por mês</h4>
      <p>Nem todas as horas são faturáveis. Deduza:</p>
      <ul>
        <li>Horas para administrativo (20%)</li>
        <li>Horas para marketing (10%)</li>
        <li>Feriados e férias (10%)</li>
        <li>Horas improdutivas (5%)</li>
      </ul>
      <p><strong>Cálculo:</strong> 160 horas × (1 - 0,45) = 88 horas faturáveis por mês</p>

      <h4>Passo 5: Divida para obter o preço por hora</h4>
      <p><strong>Preço/hora = R$ 7.303 / 88 = R$ 83 por hora</strong></p>

      <h3>Método 2: Baseado na Experiência</h3>
      <p>Pesquise qual é o valor médio cobrado por profissionais com sua experiência:</p>
      <ul>
        <li><strong>Junior:</strong> R$ 30 a R$ 50 por hora</li>
        <li><strong>Pleno:</strong> R$ 50 a R$ 100 por hora</li>
        <li><strong>Sênior:</strong> R$ 100 a R$ 200+ por hora</li>
      </ul>

      <h3>Método 3: Baseado no Projeto</h3>
      <p>Para projetos com escopo definido, use:</p>
      <p><strong>Preço = (Dias × 8 horas × Valor/hora) + Margem de Segurança (20%)</strong></p>

      <h3>Dicas Práticas</h3>
      <ul>
        <li><strong>Não revele suas horas:</strong> Fature por projeto quando possível</li>
        <li><strong>Aumente gradualmente:</strong> Aumente 10% a cada 6 meses conforme ganha experiência</li>
        <li><strong>Oferça pacotes:</strong> Desconto para projetos longos aumenta sua receita</li>
        <li><strong>Especialização:</strong> Desenvolva expertise em nichos bem remunerados</li>
        <li><strong>Eficiência:</strong> Trabalhe mais rápido para aumentar lucro com o mesmo preço</li>
      </ul>

      <h3>Erros Comuns a Evitar</h3>
      <ul>
        <li>❌ Cobrar baseado no que os concorrentes cobram sem análise própria</li>
        <li>❌ Esquecer de incluir tempo de administrativo nos cálculos</li>
        <li>❌ Não considerar períodos de ociosidade</li>
        <li>❌ Aceitar preços muito baixos no início (fica difícil aumentar depois)</li>
      </ul>

      <h3>Exemplo Completo</h3>
      <p>João é desenvolvedor MEI:</p>
      <ul>
        <li>Despesas mensais: R$ 3.200</li>
        <li>Meta de lucro: R$ 5.000</li>
        <li>Renda necessária: R$ 9.405 (com 11% de impostos MEI)</li>
        <li>Horas faturáveis: 85 horas/mês</li>
        <li>Preço por hora: R$ 110,65</li>
      </ul>

      <p>Use a Calculadora de Preço por Hora do Lumei para automatizar esses cálculos e encontrar seu preço ideal!</p>
    `,
  },
];

export function getPosts(): BlogPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getCategories(): string[] {
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}
