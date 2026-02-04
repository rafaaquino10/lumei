import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #00D084 0%, #00B86E 100%)',
        }}
      >
        {/* Calculator icon */}
        <div
          style={{
            width: '280px',
            height: '340px',
            background: 'white',
            borderRadius: '40px',
            display: 'flex',
            flexDirection: 'column',
            padding: '28px',
            gap: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          {/* Screen */}
          <div
            style={{
              height: '80px',
              background: 'rgba(0, 208, 132, 0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '24px',
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#00B86E',
            }}
          >
            R$
          </div>
          {/* Buttons grid */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                style={{
                  display: 'flex',
                  gap: '12px',
                  flex: 1,
                }}
              >
                <div style={{ flex: 1, background: '#E8E8E8', borderRadius: '12px' }} />
                <div style={{ flex: 1, background: '#E8E8E8', borderRadius: '12px' }} />
                <div style={{ flex: 1, background: '#00D084', borderRadius: '12px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  )
}
