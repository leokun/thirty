interface SparklineProps {
  data: readonly { date: string; value: number }[];
  height?: number;
  color?: string;
}

export function Sparkline({ data, height = 40, color = 'var(--color-primary)' }: SparklineProps) {
  if (data.length < 2) return null;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const w = 100;
  const h = height;
  const pad = 2;

  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (d.value - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });

  const polylinePoints = points.join(' ');

  // Area fill path
  const firstX = pad;
  const lastX = pad + (w - pad * 2);
  const bottom = h - pad;
  const areaPoints = `${firstX},${bottom} ${polylinePoints} ${lastX},${bottom}`;
  const gradientId = 'sparkline-gradient';

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
