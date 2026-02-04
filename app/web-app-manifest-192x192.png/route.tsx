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
            width: '110px',
            height: '130px',
            background: 'white',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          {/* Screen */}
          <div
            style={{
              height: '32px',
              background: 'rgba(0, 208, 132, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '10px',
              fontSize: '16px',
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
              gap: '5px',
            }}
          >
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                style={{
                  display: 'flex',
                  gap: '5px',
                  flex: 1,
                }}
              >
                <div style={{ flex: 1, background: '#E8E8E8', borderRadius: '5px' }} />
                <div style={{ flex: 1, background: '#E8E8E8', borderRadius: '5px' }} />
                <div style={{ flex: 1, background: '#00D084', borderRadius: '5px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  )
}
