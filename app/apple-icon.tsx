import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: '36px',
        }}
      >
        {/* Calculator icon */}
        <div
          style={{
            width: '100px',
            height: '120px',
            background: 'white',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {/* Screen */}
          <div
            style={{
              height: '28px',
              background: 'rgba(0, 208, 132, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '8px',
              fontSize: '14px',
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
              gap: '4px',
            }}
          >
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                style={{
                  display: 'flex',
                  gap: '4px',
                  flex: 1,
                }}
              >
                <div style={{ flex: 1, background: '#E8E8E8', borderRadius: '4px' }} />
                <div style={{ flex: 1, background: '#E8E8E8', borderRadius: '4px' }} />
                <div style={{ flex: 1, background: '#00D084', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
