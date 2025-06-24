// Minimal API library for testing
export interface Product {
  id: string;
  name: string;
  current_price: number;
}

export const utils = {
  formatPrice(price: number): string {
    return `$${price}`;
  }
}; 