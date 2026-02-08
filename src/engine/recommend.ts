import { ImageSourcePropType } from 'react-native';

export type Channel = 'online' | 'offline' | 'upi' | 'portal';

export type RecommendationInput = {
  channel: Channel;
  merchantQuery: string;
  amount: number;
};

export type RecommendationOutput = {
  bestForLabel: string;
  issuer: string;
  cardName: string;
  yieldPct: number;
  rewardType: string;
  route: string;
  estSavings: number;
  ringUsed: number;
  logicChips: [string, string, string];
  terms: string;
  image?: ImageSourcePropType;
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const CARDS: Array<Omit<RecommendationOutput, 'bestForLabel' | 'estSavings'>> = [
  {
    issuer: 'ICICI',
    cardName: 'Emeralde Private',
    yieldPct: 3.3,
    rewardType: 'Reward Points',
    route: 'SmartBuy → Amazon Pay',
    ringUsed: 0.85,
    logicChips: ['10x on SmartBuy', 'Amazon portal active', 'Max cap ₹7k/mo'],
    terms:
      'Reward points credited within 30 days of statement generation. Minimum transaction value ₹150. Subject to merchant category code validation.',
    image: require('../../assets/cards/icici_emeralde.png'),
  },
  {
    issuer: 'ICICI',
    cardName: 'Sapphire',
    yieldPct: 2.5,
    rewardType: 'Cashback',
    route: 'Direct Swipe → ICICI Net',
    ringUsed: 0.62,
    logicChips: ['2x on dining', 'Weekend boost active', 'No cap this cycle'],
    terms:
      'Cashback credited to statement within 2 billing cycles. Excludes wallet loads and fuel transactions.',
    image: require('../../assets/cards/icici_sapphire.png'),
  },
  {
    issuer: 'Axis',
    cardName: 'Atlas',
    yieldPct: 4.1,
    rewardType: 'Edge Miles',
    route: 'Edge Rewards → Transfer',
    ringUsed: 0.91,
    logicChips: ['5x on travel', 'Milestone unlocked', 'Transfer bonus 30%'],
    terms:
      'Miles transferred within 48 hours. Partner availability subject to change. Minimum 2000 miles per transfer.',
    image: require('../../assets/cards/axis_atlas.png'),
  },
  {
    issuer: 'SBI',
    cardName: 'Cashback',
    yieldPct: 1.8,
    rewardType: 'Cashback',
    route: 'SBI Rewardz Portal',
    ringUsed: 0.45,
    logicChips: ['5% on online', 'Grocery 5x active', 'Monthly cap ₹5k'],
    terms:
      'Cashback credited to statement within 2 billing cycles. Minimum 500 points. Some merchant exclusions apply.',
    image: require('../../assets/cards/sbi_cashback.png'),
  },
  {
    issuer: 'HSBC',
    cardName: 'World',
    yieldPct: 5.0,
    rewardType: 'Reward Points',
    route: 'HSBC Rewards → Direct',
    ringUsed: 0.78,
    logicChips: ['5x on intl spend', 'Milestone bonus active', 'Annual fee offset'],
    terms:
      'Reward points have no expiry. Transfer ratios vary by partner. Statement credits processed in 5-7 days.',
    image: require('../../assets/cards/hsbc_world.png'),
  },
];

export function recommend(input: RecommendationInput): RecommendationOutput {
  const key = input.channel + ':' + input.merchantQuery.toLowerCase();
  const idx = hash(key) % CARDS.length;
  const card = CARDS[idx];
  return {
    ...card,
    bestForLabel: input.merchantQuery || 'General',
    estSavings: Math.round((input.amount * card.yieldPct) / 100),
  };
}
