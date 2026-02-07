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
    issuer: 'HDFC',
    cardName: 'Infinia',
    yieldPct: 3.3,
    rewardType: 'Reward Points',
    route: 'SmartBuy → Amazon Pay',
    ringUsed: 0.85,
    logicChips: ['10x on SmartBuy', 'Amazon portal active', 'Max cap ₹7k/mo'],
    terms:
      'Reward points credited within 30 days of statement generation. Minimum transaction value ₹150. Subject to merchant category code validation.',
  },
  {
    issuer: 'ICICI',
    cardName: 'Emeralde',
    yieldPct: 2.5,
    rewardType: 'Cashback',
    route: 'Direct Swipe → ICICI Net',
    ringUsed: 0.62,
    logicChips: ['2x on dining', 'Weekend boost active', 'No cap this cycle'],
    terms:
      'Cashback credited to statement within 2 billing cycles. Excludes wallet loads and fuel transactions.',
  },
  {
    issuer: 'Axis',
    cardName: 'Magnus',
    yieldPct: 4.1,
    rewardType: 'Edge Miles',
    route: 'Edge Rewards → Transfer',
    ringUsed: 0.91,
    logicChips: ['5x on travel', 'Milestone unlocked', 'Transfer bonus 30%'],
    terms:
      'Miles transferred within 48 hours. Partner availability subject to change. Minimum 2000 miles per transfer.',
  },
  {
    issuer: 'SBI',
    cardName: 'Elite',
    yieldPct: 1.8,
    rewardType: 'Reward Points',
    route: 'SBI Rewardz Portal',
    ringUsed: 0.45,
    logicChips: ['10x on movies', 'Grocery 5x active', 'Monthly cap ₹5k'],
    terms:
      'Points valid for 24 months from earn date. Redemption minimum 500 points. Some merchant exclusions apply.',
  },
  {
    issuer: 'Amex',
    cardName: 'Platinum',
    yieldPct: 5.0,
    rewardType: 'Membership Rewards',
    route: 'Amex Offers → Direct',
    ringUsed: 0.78,
    logicChips: ['5x on intl spend', 'Amex offer stacked', 'Annual fee offset'],
    terms:
      'Membership Rewards points have no expiry. Transfer ratios vary by airline partner. Statement credits processed in 5-7 days.',
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
