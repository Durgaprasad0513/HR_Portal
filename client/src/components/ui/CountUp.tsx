import React, { useEffect, useState } from 'react';

function Digit({ targetValue, delay }: { targetValue: number; delay: number }) {
  const [value, setValue] = useState(0);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) {
      setValue(targetValue + 10);
      return;
    }
    // Force a full revolution by adding 10 so it always scrolls, even if target is 0
    const t = setTimeout(() => setValue(targetValue + 10), 50 + delay);
    return () => clearTimeout(t);
  }, [targetValue, delay, reduceMotion]);

  // Array of two full 0-9 cycles
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <span 
      aria-hidden="true"
      className="inline-flex flex-col overflow-hidden"
      style={{ height: '1.2em', verticalAlign: 'text-bottom' }}
    >
      <span
        className="flex flex-col transition-transform ease-in-out"
        style={{
          transform: `translateY(-${(value / numbers.length) * 100}%)`,
          transitionDuration: reduceMotion ? '0ms' : '2500ms',
        }}
      >
        {numbers.map((n, i) => (
          <span key={i} className="h-[1.2em] flex items-center justify-center leading-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export function CountUp({ end, prefix = '', suffix = '' }: { end: number; prefix?: string; suffix?: string }) {
  const endStr = end.toString();
  const digits = endStr.split('');

  return (
    <span className="inline-flex items-center">
      <span className="sr-only">{`${prefix}${end}${suffix}`}</span>
      <span className="inline-flex items-center" aria-hidden="true">
        {prefix && <span className="mr-1">{prefix}</span>}
        {digits.map((char, i) => {
          const isNumber = !isNaN(parseInt(char, 10));

          if (isNumber) {
            // Stagger the animation slightly for each digit (right to left)
            const delay = (digits.length - 1 - i) * 150;
            return <Digit key={i} targetValue={parseInt(char, 10)} delay={delay} />;
          }

          // For commas or dots
          return (
            <span key={i} className="inline-flex items-center justify-center leading-none" style={{ height: '1.2em' }}>
              {char}
            </span>
          );
        })}
        {suffix && <span className="ml-1">{suffix}</span>}
      </span>
    </span>
  );
}
