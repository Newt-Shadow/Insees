import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'INSEES - NIT Silchar';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          backgroundColor: '#050505', // Deep Black
          backgroundImage: 'radial-gradient(circle at 50% 50%, #103020 0%, #000000 80%)', // Emerald Glow
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* --- CIRCUITRY BACKGROUND GRID --- */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(52, 211, 153, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(52, 211, 153, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.4,
          }}
        />

        {/* --- YELLOW BRICK ROAD (Circuit Trace) --- */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: '4px',
            height: '50%',
            background: 'linear-gradient(to top, #f59e0b, transparent)', // Amber (Yellow Brick)
            transform: 'translateX(-50%)',
            boxShadow: '0 0 20px #f59e0b',
          }}
        />

        {/* --- ORNAMENTAL CORNERS (Sci-Fi HUD) --- */}
        {/* Top Left */}
        <div style={{ position: 'absolute', top: 40, left: 40, width: 20, height: 20, borderTop: '4px solid #34d399', borderLeft: '4px solid #34d399' }} />
        {/* Bottom Right */}
        <div style={{ position: 'absolute', bottom: 40, right: 40, width: 20, height: 20, borderBottom: '4px solid #34d399', borderRight: '4px solid #34d399' }} />

        {/* --- MAIN CONTENT --- */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '40px',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '20px',
            boxShadow: '0 0 60px rgba(52, 211, 153, 0.2)',
          }}
        >
          {/* Chip Icon / Logo Placeholder */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              border: '4px solid #34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              boxShadow: '0 0 30px #34d399',
              background: '#000',
              color: '#34d399',
              fontSize: 40,
              fontWeight: 900,
            }}
          >
            ⚡
          </div>

          <div
            style={{
              color: '#fff',
              fontSize: 100,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textShadow: '0 0 40px rgba(52, 211, 153, 0.6)',
              marginBottom: 10,
              display: 'flex',
            }}
          >
            INSEES
          </div>

          <div
            style={{
              color: '#a1a1aa',
              fontSize: 28,
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ color: '#f59e0b' }}>{"//"} NIT SILCHAR</span>
            <span style={{ color: '#34d399', marginLeft: 10, marginRight: 10 }}>•</span>
            <span style={{ color: '#f59e0b' }}>{"//"}</span>
          </div>
        </div>

        {/* --- BOTTOM DECORATION --- */}
        <div style={{ position: 'absolute', bottom: 30, color: '#34d399', fontSize: 16, fontFamily: 'monospace', opacity: 0.8 }}>
          SYSTEM_STATUS: <span style={{ color: '#fff' }}>ONLINE</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}