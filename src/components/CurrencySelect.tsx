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
    <select
      value={selectedCurrency}
      onChange={(e) => onCurrencyChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">Select a currency</option>
      {currencies.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.code} - {currency.name}
        </option>
      ))}
    </select>
  );
};