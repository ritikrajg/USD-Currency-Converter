import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCurrencyRates } from '../hooks/useCurrencyRates';
import { CurrencySelect } from './CurrencySelect';

const HIGHLIGHTED_CURRENCIES = ['EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'] as const;
const QUICK_AMOUNTS = ['50', '100', '250', '500'];

export const CurrencyConverter: React.FC = () => {
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('INR');
  const [amount, setAmount] = useState<string>('100');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [conversionDate, setConversionDate] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');

  const { rates, loading, error, currencyOptions, getRateForCurrency } = useCurrencyRates(baseCurrency);

  const baseCurrencyOptions = useMemo(() => {
    if (!currencyOptions.length) {
      return [{ code: baseCurrency, name: baseCurrency, rate: 1 }];
    }

    const hasBase = currencyOptions.some((option) => option.code === baseCurrency);
    return hasBase ? currencyOptions : [{ code: baseCurrency, name: baseCurrency, rate: 1 }, ...currencyOptions];
  }, [currencyOptions, baseCurrency]);

  const validateAmount = (value: string) => {
    if (!value) {
      setAmountError('');
      return false;
    }

    const numericValue = parseFloat(value);
    if (Number.isNaN(numericValue) || numericValue <= 0) {
      setAmountError('Enter an amount greater than 0');
      return false;
    }

    setAmountError('');
    return true;
  };

  const handleConvert = useCallback(() => {
    if (!rates || !targetCurrency || !amount) {
      setConvertedAmount(null);
      setConversionRate(null);
      return;
    }

    if (!validateAmount(amount)) {
      setConvertedAmount(null);
      setConversionRate(null);
      return;
    }

    const numericAmount = parseFloat(amount);
    const normalizedTarget = targetCurrency.toUpperCase();

    if (normalizedTarget === baseCurrency.toUpperCase()) {
      setConvertedAmount(numericAmount);
      setConversionRate(1);
      setConversionDate(rates.date);
      return;
    }

    const rate = getRateForCurrency(normalizedTarget);
    if (!rate) {
      setConvertedAmount(null);
      setConversionRate(null);
      return;
    }

    setConvertedAmount(numericAmount * rate);
    setConversionRate(rate);
    setConversionDate(rates.date);
  }, [amount, baseCurrency, getRateForCurrency, rates, targetCurrency]);

  useEffect(() => {
    if (amount && targetCurrency && rates) {
      handleConvert();
    }
  }, [amount, targetCurrency, rates, handleConvert]);

  const handleReset = () => {
    setAmount('100');
    setTargetCurrency('INR');
    setConvertedAmount(null);
    setConversionRate(null);
    setConversionDate('');
    setAmountError('');
  };

  const handleSwap = () => {
    if (!targetCurrency) return;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  const highlightRates = useMemo(() => {
    if (!rates?.rates) return [];
    return HIGHLIGHTED_CURRENCIES.filter((code) => code !== baseCurrency)
      .map((code) => ({
        code,
        value: rates.rates[code],
      }))
      .filter((item) => item.value);
  }, [rates, baseCurrency]);

  if (loading && !rates) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" aria-label="Loading rates" />
        <span className="ml-3 text-lg">Fetching real-time exchange rates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-500 font-semibold">Smart Converter</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Global Currency Calculator</h1>
          <p className="text-sm text-gray-500 mt-1">Live mid-market rates powered by currency-api.com</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Updated {conversionDate ? new Date(conversionDate).toLocaleDateString() : 'today'}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-2">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                validateAmount(e.target.value);
              }}
              min="0"
              step="0.01"
              inputMode="decimal"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold text-gray-900"
            />
            {amountError && <p className="text-sm text-red-500 mt-1">{amountError}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(preset);
                  validateAmount(preset);
                }}
                className={`px-4 py-2 rounded-full border ${
                  amount === preset ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600'
                } text-sm font-medium transition`}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">From</label>
              <CurrencySelect
                currencies={baseCurrencyOptions}
                selectedCurrency={baseCurrency}
                onCurrencyChange={setBaseCurrency}
                disabled={loading}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                disabled={!targetCurrency || loading}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 rounded-full text-sm font-semibold transition"
              >
                ⇅ Swap
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">To</label>
              <CurrencySelect
                currencies={currencyOptions}
                selectedCurrency={targetCurrency}
                onCurrencyChange={setTargetCurrency}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConvert}
              disabled={!amount || !targetCurrency || !!amountError || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition"
            >
              Convert now
            </button>
            <button
              onClick={handleReset}
              type="button"
              className="px-5 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-widest opacity-80">Conversion result</p>
            <div className="mt-4">
              <p className="text-xl font-medium">
                {amount
                  ? `${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${baseCurrency}`
                  : `0 ${baseCurrency}`}
              </p>
              <p className="text-4xl font-black mt-2">
                {convertedAmount !== null && targetCurrency
                  ? `${convertedAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} ${targetCurrency}`
                  : '—'}
              </p>
            </div>
            {conversionRate && (
              <div className="mt-6 space-y-1 text-sm font-medium">
                <p>
                  1 {baseCurrency} = {conversionRate.toFixed(4)} {targetCurrency}
                </p>
                <p>
                  1 {targetCurrency} = {(1 / conversionRate).toFixed(4)} {baseCurrency}
                </p>
              </div>
            )}
            {conversionDate && (
              <p className="text-xs text-white/80 mt-4">
                Rates refreshed on {new Date(conversionDate).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Spotlight rates</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {highlightRates.length === 0 && <p className="text-gray-500 text-sm">Add a target currency to see insights.</p>}
              {highlightRates.map((rate) => (
                <div key={rate.code} className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs uppercase text-gray-500">1 {baseCurrency}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {rate.value?.toFixed(4)} <span className="text-sm font-medium text-gray-500">{rate.code}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-blue-200 p-4 text-sm text-gray-500">
            <p className="font-semibold text-gray-700">Pro tip</p>
            <p>
              Swap currencies to instantly fetch a brand-new set of rates, or tap a quick amount to speed up what-if scenarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};