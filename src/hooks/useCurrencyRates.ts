import { useState, useEffect, useMemo } from 'react';
import { CurrencyRates, CurrencyOption, RawCurrencyApiResponse } from '../types/currency';

const currencyDisplayNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'currency' })
    : null;

const getDisplayName = (code: string) => {
  if (!currencyDisplayNames) return code;
  try {
    return currencyDisplayNames.of(code) ?? code;
  } catch {
    return code;
  }
};

export const useCurrencyRates = (baseCurrency: string) => {
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = baseCurrency.toLowerCase();
        const response = await fetch(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch currency rates');
        }

        const data: RawCurrencyApiResponse = await response.json();
        const rawRates = data[base];

        if (!rawRates || typeof rawRates === 'string') {
          throw new Error(`Currency data missing for base ${baseCurrency.toUpperCase()}`);
        }

        const normalizedRates = Object.entries(rawRates).reduce<Record<string, number>>(
          (acc, [code, rate]) => {
            acc[code.toUpperCase()] = rate;
            return acc;
          },
          {}
        );

        setRates({
          date: data.date as string,
          base: baseCurrency.toUpperCase(),
          rates: normalizedRates,
        });
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRates();

    return () => {
      controller.abort();
    };
  }, [baseCurrency]);

  const currencyOptions = useMemo((): CurrencyOption[] => {
    if (!rates?.rates) return [];

    return Object.entries(rates.rates)
      .map(([code, rate]) => ({
        code,
        name: getDisplayName(code),
        rate,
      }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [rates]);

  const getRateForCurrency = (currencyCode: string) => {
    if (!rates?.rates) return null;
    return rates.rates[currencyCode.toUpperCase()] ?? null;
  };

  return {
    rates,
    loading,
    error,
    currencyOptions,
    getRateForCurrency,
  };
};