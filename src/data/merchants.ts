import { ImageSourcePropType } from 'react-native';

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
  image: ImageSourcePropType;
}

export const VAULT_CARDS: VaultCard[] = [
  { id: 1, issuer: 'ICICI BANK', name: 'Emeralde Private', color: '#0C4A6E', lastFour: '7832', network: 'MC', image: require('../../assets/cards/icici_emeralde.png') },
  { id: 2, issuer: 'ICICI BANK', name: 'Sapphire', color: '#1E3A5F', lastFour: '3747', network: 'Amex', image: require('../../assets/cards/icici_sapphire.png') },
  { id: 3, issuer: 'Axis BANK', name: 'Flipkart', color: '#1E293B', lastFour: '4400', network: 'Visa', image: require('../../assets/cards/flipkart_axis.png') },
  { id: 4, issuer: 'Axis BANK', name: 'Atlas', color: '#1E293B', lastFour: '5518', network: 'Visa', image: require('../../assets/cards/axis_atlas.png') },
  { id: 5, issuer: 'HSBC', name: 'World', color: '#4C1D95', lastFour: '9043', network: 'MC', image: require('../../assets/cards/hsbc_world.png') },
  { id: 6, issuer: 'SBI CARD', name: 'Cashback', color: '#5B21B6', lastFour: '3677', network: 'Visa', image: require('../../assets/cards/sbi_cashback.png') },
];
