import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Avena Terminal — Spain Property Investment Scanner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0d0d14',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Blue A logo mark */}
        <div style={{
          fontSize: 120,
          fontWeight: 800,
          color: '#3b82f6',
          letterSpacing: '0.05em',
          marginBottom: '8px',
          textShadow: '0 0 40px rgba(59,130,246,0.4)',
        }}>A</div>

        {/* AVENA TERMINAL */}
        <div style={{
          fontSize: 52,
          fontWeight: 700,
          color: '#c9a84c',
          letterSpacing: '0.2em',
          marginBottom: '12px',
        }}>AVENA TERMINAL</div>

        {/* Subtitle */}
        <div style={{
          fontSize: 22,
          color: '#9ca3af',
          letterSpacing: '0.08em',
          marginBottom: '32px',
        }}>Spain&apos;s first PropTech / FinTech terminal</div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '40px' }}>
          {[
            { value: '1,881', label: 'Properties' },
            { value: '19%', label: 'Avg Discount' },
            { value: '6.2%', label: 'Avg Yield' },
          ].map(({ value, label }) => (
            <div key={label} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '12px',
              padding: '14px 32px',
            }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: '#3b82f6' }}>{value}</span>
              <span style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{ fontSize: 16, color: '#c9a84c', letterSpacing: '0.1em' }}>
          avenaterminal.com
        </div>
      </div>
    ),
    { ...size }
  );
}
