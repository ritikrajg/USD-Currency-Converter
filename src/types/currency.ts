export interface RawCurrencyApiResponse {
  date: string;
  [base: string]: Record<string, number> | string;
}

export interface CurrencyRates {
  date: string;
  base: string;
  rates: Record<string, number>;
}

export interface CurrencyOption {
  code: string;
  name: string;
  rate: number;
}