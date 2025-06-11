export enum SubscriptionType {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export enum ProductType {
  COREBRAIN = 'corebrain',
  DATAVAULT = 'datavault',
  INSIGHTENGINE = 'insightengine',
  CHATCONNECT = 'chatconnect'
}

export enum IndustryVertical {
  HOSPITALITY = 'hospitality',
  AGRICULTURE = 'agriculture'
}

export enum ConsumptionMetric {
  API_CALLS = 'api_calls',
  TOKEN_USAGE = 'token_usage',
  STORAGE = 'storage',
  USER_QUERIES = 'user_queries'
}

export enum AIModel {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_4_TURBO = 'gpt-4-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_32K = 'gpt-4-32k'
}

export interface SubscriptionFeatures {
  name: string;
  price: number;
  features: string[];
  limits: {
    projects: number;
    apiCalls: number;
    storage: number; // MB
    tokens: number; // Tokens/mes
    userQueries: number; // Consultas/mes
  };
  upgradableLimits?: boolean;
}

export interface ProductFeatures {
  name: string;
  description: string;
  basePrice: number;
  availability: {
    [key in SubscriptionType]: {
      included: boolean;
      limits?: {
        [key in ConsumptionMetric]?: number;
      };
    };
  };
  consumptionMetrics: {
    [key in ConsumptionMetric]?: {
      baseAllowance: number;
      pricingTiers: {
        range: [number, number | null];
        price: number;
      }[];
    };
  };
}

export interface ConsumptionData {
  metric: ConsumptionMetric;
  usage: number;
  model?: AIModel;
}

export interface BillingState {
  plan: string;
  price: number;
  interval: 'month' | 'year';
  paymentMethodId?: string;
  couponCode?: string;
  metadata?: Record<string, any>;

  // Añadidos para BillingContext
  subscriptionType: SubscriptionType;
  selectedProducts: ProductType[];
  selectedVerticals: IndustryVertical[];
  consumption: { [key in ConsumptionMetric]?: ConsumptionData };
  addOns: {
    additionalUsers?: number;
    customModels?: boolean;
    priorityGPT?: boolean;
    dedicatedInfrastructure?: boolean;
    support24_7?: boolean;
  };
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  plan: {
    id: string;
    amount: number;
    interval: string;
    product: string;
  };
  customer: string;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        unit_amount: number;
        currency: string;
      };
      quantity: number;
    }>;
  };
}

export interface BillingHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  description: string;
  type: string;
}

export interface UsageRecord {
  id: string;
  quantity: number;
  timestamp: number;
  subscriptionItemId: string;
}

export interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'failed';
  items: {
    type: 'subscription' | 'consumption' | 'addon';
    description: string;
    amount: number;
  }[];
}

export interface UsageLog {
  id: string;
  timestamp: string;
  product: ProductType;
  metric: ConsumptionMetric;
  usage: number;
  cost: number;
  details?: Record<string, any>;
} 