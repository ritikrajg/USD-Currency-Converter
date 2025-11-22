import React from 'react';
import { CurrencyOption } from '../types/currency';

interface CurrencySelectProps {
  currencies: CurrencyOption[];
  selectedCurrency: string;
  onCurrencyChange: (currencyCode: string) => void;
  disabled?: boolean;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  currencies,
  selectedCurrency,
  onCurrencyChange,
  disabled = false,
}) => {
  return (
    <div className="relative">
      <select
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900 font-medium transition-all hover:border-gray-300 appearance-none cursor-pointer"
      >
        <option value="">Select a currency</option>
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};