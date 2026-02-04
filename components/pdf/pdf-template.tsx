import { Text, View, StyleSheet, Svg, Path, G } from '@react-pdf/renderer'

// Cores da marca
const colors = {
  primary: '#00D084',
  primaryDark: '#00B571',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceAlt: '#F0FDF4',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  premium: '#8B5CF6',
}

// Tipo de dados do usuario para os PDFs
export interface PDFUserData {
  nome?: string
  nomeEmpresa?: string
  cnpj?: string
  tipoMEI?: string
  isPremium?: boolean
}

// Estilos base reutilizaveis
export const baseStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: colors.background,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  docType: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  docDate: {
    fontSize: 9,
    color: colors.textMuted,
  },
  // User identification section
  userSection: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userSectionPremium: {
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.premium,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.premium,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#166534',
  },
  userGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  userCol: {
    flex: 1,
  },
  userLabel: {
    fontSize: 8,
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  userValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  // Title section
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 1.4,
  },
  // Cards / Sections
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHighlight: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cardDanger: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  // Labels and values
  label: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  valueHighlight: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  valueSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  // Grid
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  col2: {
    flex: 1,
  },
  col3: {
    width: '31%',
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  // Text styles
  paragraph: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  strong: {
    fontWeight: 'bold',
    color: colors.text,
  },
  // Status badges
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSuccessText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#166534',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeWarningText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#92400E',
  },
  badgeDanger: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeDangerText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 8,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: 8,
    color: colors.primary,
    fontWeight: 'bold',
  },
  // Info box
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
  },
  infoBoxText: {
    fontSize: 9,
    color: '#1E40AF',
    lineHeight: 1.4,
  },
  // Tips
  tipsSection: {
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  tipBullet: {
    fontSize: 10,
    color: colors.primary,
  },
  tipText: {
    fontSize: 9,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 1.4,
  },
})

// Logo SVG component
export function LogoIcon() {
  return (
    <Svg width="28" height="28" viewBox="0 0 32 32">
      <G>
        {/* Background */}
        <Path
          d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V26C32 29.3137 29.3137 32 26 32H6C2.68629 32 0 29.3137 0 26V6Z"
          fill="#00D084"
        />
        {/* Calculator icon */}
        <Path
          d="M9 8H23C23.5523 8 24 8.44772 24 9V23C24 23.5523 23.5523 24 23 24H9C8.44772 24 8 23.5523 8 23V9C8 8.44772 8.44772 8 9 8Z"
          fill="white"
          fillOpacity="0.2"
        />
        <Path
          d="M10 10H22V14H10V10Z"
          fill="white"
        />
        <Path
          d="M10 16H13V19H10V16ZM14.5 16H17.5V19H14.5V16ZM19 16H22V22H19V16ZM10 20H13V22H10V20ZM14.5 20H17.5V22H14.5V20Z"
          fill="white"
        />
      </G>
    </Svg>
  )
}

// Icone de verificado para Premium
function VerifiedIcon() {
  return (
    <Svg width="10" height="10" viewBox="0 0 24 24">
      <Path
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="#166534"
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  )
}

// Header component
interface PDFHeaderProps {
  documentType: string
  date?: string
}

export function PDFHeader({ documentType, date }: PDFHeaderProps) {
  const formattedDate = date || new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <View style={baseStyles.header}>
      <View style={baseStyles.logo}>
        <LogoIcon />
        <Text style={baseStyles.logoText}>Calcula MEI</Text>
      </View>
      <View style={baseStyles.headerRight}>
        <Text style={baseStyles.docType}>{documentType}</Text>
        <Text style={baseStyles.docDate}>{formattedDate}</Text>
      </View>
    </View>
  )
}

// Componente de identificacao do usuario/empresa
interface PDFUserIdentificationProps {
  userData?: PDFUserData
}

export function PDFUserIdentification({ userData }: PDFUserIdentificationProps) {
  // Se nao tem dados do usuario, nao renderiza nada
  if (!userData || (!userData.nome && !userData.nomeEmpresa && !userData.cnpj)) {
    return null
  }

  const isPremium = userData.isPremium

  return (
    <View style={isPremium ? baseStyles.userSectionPremium : baseStyles.userSection}>
      <View style={baseStyles.userHeader}>
        <Text style={baseStyles.userTitle}>Dados do Empreendedor</Text>
        {isPremium ? (
          <View style={baseStyles.verifiedBadge}>
            <VerifiedIcon />
            <Text style={baseStyles.verifiedBadgeText}>Documento Verificado</Text>
          </View>
        ) : null}
      </View>

      <View style={baseStyles.userGrid}>
        {(userData.nomeEmpresa || userData.nome) && (
          <View style={baseStyles.userCol}>
            <Text style={baseStyles.userLabel}>
              {userData.nomeEmpresa ? 'Razao Social' : 'Nome'}
            </Text>
            <Text style={baseStyles.userValue}>
              {userData.nomeEmpresa || userData.nome}
            </Text>
          </View>
        )}

        {userData.cnpj && (
          <View style={baseStyles.userCol}>
            <Text style={baseStyles.userLabel}>CNPJ</Text>
            <Text style={baseStyles.userValue}>{userData.cnpj}</Text>
          </View>
        )}

        {userData.tipoMEI && (
          <View style={baseStyles.userCol}>
            <Text style={baseStyles.userLabel}>Tipo MEI</Text>
            <Text style={baseStyles.userValue}>{userData.tipoMEI}</Text>
          </View>
        )}
      </View>

      {isPremium && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 7, color: colors.textMuted }}>
            Este documento foi gerado por um usuario Premium do Calcula MEI e pode ser utilizado como comprovante.
          </Text>
        </View>
      )}
    </View>
  )
}

// Footer component
export function PDFFooter() {
  return (
    <View style={baseStyles.footer}>
      <View style={baseStyles.footerContent}>
        <View style={baseStyles.footerLeft}>
          <Text style={baseStyles.footerText}>Gerado por</Text>
          <Text style={baseStyles.footerLink}>calculamei.com.br</Text>
        </View>
        <Text style={baseStyles.footerText}>
          Controle seu MEI em 1 minuto/mes
        </Text>
      </View>
    </View>
  )
}

// Formatted currency helper
export function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Formatted percentage helper
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
