"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";

const TARGET_USD = 112500;

const START = new Date(2025, 6, 2).getTime(); // July 2, 2025
const END = new Date(2026, 6, 2).getTime();   // July 2, 2026

function getProgress(): number {
  const now = Date.now();
  return Math.max(0, Math.min(1, (now - START) / (END - START)));
}

export default function Counter() {
  const [value, setValue] = useState(0);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => setRate(data.rates?.INR ?? null))
      .catch(() => setRate(null));
  }, []);

  useEffect(() => {
    const update = () => {
      const usd = getProgress() * TARGET_USD;
      setValue(currency === "INR" && rate ? usd * rate : usd);
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [currency, rate]);

  return (
    <div className="flex flex-col items-center gap-8">
      <NumberFlow
        value={value}
        format={{
          style: "currency",
          currency,
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }}
        locales={currency === "INR" ? "en-IN" : "en-US"}
        trend={1}
        willChange
        style={{ fontVariantNumeric: "tabular-nums" }}
        className="text-[clamp(2.5rem,10vw,10rem)] font-bold tracking-tight"
      />
      <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 text-sm font-medium">
        <button
          onClick={() => setCurrency("USD")}
          className={`rounded-full px-4 py-1.5 transition-colors ${
            currency === "USD"
              ? "bg-white text-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          USD
        </button>
        <button
          onClick={() => setCurrency("INR")}
          className={`rounded-full px-4 py-1.5 transition-colors ${
            currency === "INR"
              ? "bg-white text-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          INR
        </button>
      </div>
    </div>
  );
}
