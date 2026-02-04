import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: '6px',
        }}
      >
        {/* Calculator icon simplified */}
        <div
          style={{
            width: '20px',
            height: '24px',
            background: 'white',
            borderRadius: '3px',
            display: 'flex',
            flexDirection: 'column',
            padding: '2px',
            gap: '2px',
          }}
        >
          {/* Screen */}
          <div
            style={{
              height: '6px',
              background: 'rgba(0, 208, 132, 0.25)',
              borderRadius: '2px',
            }}
          />
          {/* Buttons grid */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
            }}
          >
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                style={{
                  display: 'flex',
                  gap: '1px',
                  flex: 1,
                }}
              >
                <div style={{ flex: 1, background: '#E5E5E5', borderRadius: '1px' }} />
                <div style={{ flex: 1, background: '#E5E5E5', borderRadius: '1px' }} />
                <div style={{ flex: 1, background: '#00D084', borderRadius: '1px' }} />
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
