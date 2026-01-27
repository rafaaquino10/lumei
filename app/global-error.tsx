'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>
              Erro Crítico
            </h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>
              Algo deu muito errado. Por favor, recarregue a página.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: '#00D084',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Recarregar Página
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
