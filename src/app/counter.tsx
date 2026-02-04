"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";

const TARGET = 112500;

function getYearProgress(): number {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year + 1, 0, 1).getTime();
  return (now.getTime() - start) / (end - start);
}

export default function Counter() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(getYearProgress() * TARGET);

    const interval = setInterval(() => {
      setValue(getYearProgress() * TARGET);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <NumberFlow
      value={value}
      format={{
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }}
      trend={1}
      willChange
      className="text-[clamp(2.5rem,10vw,10rem)] font-bold tracking-tight"
    />
  );
}
