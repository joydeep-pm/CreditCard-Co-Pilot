export interface Merchant {
  id: string;
  name: string;
  tag: string;
  initials: string;
  color: string;
}

export const MERCHANTS: Merchant[] = [
  { id: '1', name: 'Amazon', tag: 'E-commerce', initials: 'AZ', color: '#E2E8F0' },
  { id: '2', name: 'Flipkart', tag: 'E-commerce', initials: 'FK', color: '#E2E8F0' },
  { id: '3', name: 'Swiggy', tag: 'Food Delivery', initials: 'SW', color: '#E2E8F0' },
  { id: '4', name: 'Zomato', tag: 'Food Delivery', initials: 'ZM', color: '#E2E8F0' },
  { id: '5', name: 'BigBasket', tag: 'Groceries', initials: 'BB', color: '#E2E8F0' },
  { id: '6', name: 'Croma', tag: 'Electronics', initials: 'CR', color: '#E2E8F0' },
  { id: '7', name: 'Myntra', tag: 'Fashion', initials: 'MY', color: '#E2E8F0' },
  { id: '8', name: 'BookMyShow', tag: 'Entertainment', initials: 'BM', color: '#E2E8F0' },
  { id: '9', name: 'Uber', tag: 'Travel', initials: 'UB', color: '#E2E8F0' },
  { id: '10', name: 'MakeMyTrip', tag: 'Travel', initials: 'MM', color: '#E2E8F0' },
  { id: '11', name: 'PhonePe', tag: 'Payments', initials: 'PP', color: '#E2E8F0' },
  { id: '12', name: 'Google Pay', tag: 'Payments', initials: 'GP', color: '#E2E8F0' },
];

export interface VaultCard {
  id: number;
  issuer: string;
  name: string;
  color: string;
  lastFour: string;
  network: string;
}

export const VAULT_CARDS: VaultCard[] = [
  { id: 1, issuer: 'HDFC BANK', name: 'Infinia', color: '#1E293B', lastFour: '4242', network: 'Visa' },
  { id: 2, issuer: 'ICICI BANK', name: 'Emeralde', color: '#0C4A6E', lastFour: '7832', network: 'Visa' },
  { id: 3, issuer: 'Axis BANK', name: 'Magnus', color: '#312E81', lastFour: '5518', network: 'MC' },
  { id: 4, issuer: 'SBI CARD', name: 'Elite', color: '#1E3A5F', lastFour: '9043', network: 'Visa' },
  { id: 5, issuer: 'AMEX', name: 'Platinum', color: '#374151', lastFour: '3677', network: 'Amex' },
  { id: 6, issuer: 'YES BANK', name: 'Marquee', color: '#1E293B', lastFour: '2345', network: 'Visa' },
  { id: 7, issuer: 'Kotak', name: '811 Dream', color: '#1F2937', lastFour: '6205', network: 'Visa' },
  { id: 8, issuer: 'RBL', name: 'ShopRite', color: '#292524', lastFour: '8471', network: 'MC' },
];
