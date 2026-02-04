import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Calcula MEI - Calculadoras Financeiras para MEI'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00D084',
          backgroundImage: 'linear-gradient(135deg, #00D084 0%, #00B873 100%)',
        }}
      >
        {/* Logo e Nome */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'white',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 24,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00D084"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: 'white',
              textShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            Calcula MEI
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: 'white',
            opacity: 0.95,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Calculadoras financeiras feitas para MEI crescer
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 48,
          }}
        >
          {['Margem de Lucro', 'Precificacao', 'DAS', 'Faturamento'].map((feature) => (
            <div
              key={feature}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '12px 24px',
                borderRadius: 50,
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            backgroundColor: 'white',
            padding: '12px 28px',
            borderRadius: 50,
            color: '#00D084',
            fontSize: 22,
            fontWeight: 700,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          100% Gratuito
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
