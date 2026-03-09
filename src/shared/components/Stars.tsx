interface StarsProps {
  count: number;
  total?: number;
}

export function Stars({ count, total = 5 }: StarsProps) {
  return (
    <span>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{ color: i < count ? '#f97316' : '#374151', fontSize: '0.9em' }}>
          ★
        </span>
      ))}
    </span>
  );
}
