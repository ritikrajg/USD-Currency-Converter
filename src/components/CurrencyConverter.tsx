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
      <div className="flex flex-col justify-center items-center py-16 min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600" aria-label="Loading rates" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse" />
          </div>
        </div>
        <span className="mt-6 text-lg font-medium text-gray-700">Fetching real-time exchange rates...</span>
        <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800">Error Loading Exchange Rates</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-blue-600 font-bold">Smart Converter</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Currency Converter
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Live mid-market rates powered by currency-api.com
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 rounded-full text-sm font-semibold shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Updated {conversionDate ? new Date(conversionDate).toLocaleDateString() : 'today'}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Input Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-5m-6 5v-5m6 5h-6m6 0h3M5 12h.01M12 12h.01M19 12h.01" />
              </svg>
              Amount
            </label>
            <div className="relative">
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
                className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 text-xl font-bold text-gray-900 transition-all ${
                  amountError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="0.00"
              />
              {amount && !amountError && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            {amountError && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {amountError}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Amounts</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(preset);
                    validateAmount(preset);
                  }}
                  className={`px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all transform hover:scale-105 active:scale-95 ${
                    amount === preset
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                From
              </label>
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 disabled:from-gray-50 disabled:to-gray-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-gray-700 transition-all transform hover:scale-105 active:scale-95 shadow-sm border-2 border-gray-200"
                title="Swap currencies"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Swap Currencies
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                To
              </label>
              <CurrencySelect
                currencies={currencyOptions}
                selectedCurrency={targetCurrency}
                onCurrencyChange={setTargetCurrency}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleConvert}
              disabled={!amount || !targetCurrency || !!amountError || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:transform-none shadow-lg shadow-blue-200 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Convert Now
            </button>
            <button
              onClick={handleReset}
              type="button"
              className="px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        {/* Right Column - Results Section */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm uppercase tracking-widest opacity-90 font-semibold">Conversion Result</p>
              </div>
              <div className="mt-6 space-y-3">
                <div>
                  <p className="text-sm opacity-80 mb-1">You convert</p>
                  <p className="text-2xl font-bold">
                    {amount
                      ? `${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${baseCurrency}`
                      : `0.00 ${baseCurrency}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-white opacity-30"></div>
                  <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <div className="flex-1 h-px bg-white opacity-30"></div>
                </div>
                <div>
                  <p className="text-sm opacity-80 mb-1">You receive</p>
                  <p className="text-5xl font-black tracking-tight">
                    {convertedAmount !== null && targetCurrency
                      ? `${convertedAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} ${targetCurrency}`
                      : '—'}
                  </p>
                </div>
              </div>
              {conversionRate && (
                <div className="mt-8 pt-6 border-t border-white/20 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="opacity-80">Exchange Rate</span>
                    <span className="font-bold">1 {baseCurrency} = {conversionRate.toFixed(4)} {targetCurrency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="opacity-80">Reverse Rate</span>
                    <span className="font-bold">1 {targetCurrency} = {(1 / conversionRate).toFixed(4)} {baseCurrency}</span>
                  </div>
                </div>
              )}
              {conversionDate && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs opacity-70 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Rates updated on {new Date(conversionDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">Spotlight Rates</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {highlightRates.length === 0 ? (
                <p className="text-gray-500 text-sm col-span-2 text-center py-4">Select currencies to see popular rates</p>
              ) : (
                highlightRates.map((rate) => (
                  <div
                    key={rate.code}
                    className="rounded-xl bg-white border-2 border-gray-100 px-4 py-4 hover:border-indigo-200 hover:shadow-md transition-all group"
                  >
                    <p className="text-xs uppercase text-gray-500 font-semibold mb-1">1 {baseCurrency}</p>
                    <p className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {rate.value?.toFixed(4)} <span className="text-sm font-semibold text-gray-500">{rate.code}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">Pro Tip</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Swap currencies to instantly fetch a brand-new set of rates, or tap a quick amount to speed up what-if scenarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};