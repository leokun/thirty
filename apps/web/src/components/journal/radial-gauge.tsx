import type { ReactNode } from 'react';

interface RadialGaugeProps {
  value: number;
  max: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
  label?: string;
}

export function RadialGauge({
  value,
  max,
  color,
  size = 120,
  strokeWidth = 8,
  children,
  label,
}: RadialGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, value / max));
  const offset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
        role="img"
        aria-label={label ?? `${value} sur ${max}`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={strokeWidth}
          />
          {/* Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
          />
        </svg>
        {children && (
          <div className="absolute inset-0 flex items-center justify-center">{children}</div>
        )}
      </div>
    </div>
  );
}
