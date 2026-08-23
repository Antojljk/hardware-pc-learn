export type PriceSource = 'ldlc' | 'topachat' | 'coolpc';

export type PriceResult = {
  name: string;
  price: number;
  currency: 'EUR';
  source: PriceSource;
  url: string;
  updatedAt: string;
};

export interface PriceProvider {
  source: PriceSource;
  search(query: string): Promise<PriceResult | null>;
}
