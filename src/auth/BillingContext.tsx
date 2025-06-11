import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BillingState, 
  SubscriptionType, 
  ProductType, 
  IndustryVertical,
  ConsumptionMetric,
  AIModel,
  BillingHistory,
  UsageLog
} from '@/types/billing';
import {
  createSubscription,
  updateSubscription,
  cancelSubscription,
  createUsageRecord,
  getSubscriptionDetails,
  getBillingHistory,
  getUsageRecords
} from '@/services/stripe';
import { useAuth } from '@/lib/sso/AuthContext';

interface BillingContextType {
  billingState: BillingState;
  setBillingState: (state: BillingState) => void;
  calculateTotalBill: () => number;
  billingHistory: BillingHistory[];
  usageLogs: UsageLog[];
  isLoading: boolean;
  error: string | null;
  createOrUpdateSubscription: () => Promise<void>;
  cancelCurrentSubscription: () => Promise<void>;
  recordUsage: (metric: ConsumptionMetric, quantity: number) => Promise<void>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, apiToken } = useAuth();
  const [billingState, setBillingState] = useState<BillingState>({
    subscriptionType: SubscriptionType.FREE,
    selectedProducts: [],
    selectedVerticals: [],
    consumption: {},
    addOns: {},
    plan: '',
    price: 0,
    interval: 'month'
  });

  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!user || !apiToken?.token) return;

      try {
        setIsLoading(true);
        // Get billing history
        const history = await getBillingHistory(apiToken.token);
        setBillingHistory(history);

        // If there's an active subscription, get its details
        if (history.length > 0 && history[0].subscriptionId) {
          const subscription = await getSubscriptionDetails(apiToken.token, history[0].subscriptionId);
          setSubscriptionId(subscription.id);
          // Update billing state from subscription
          setBillingState(prev => ({
            ...prev,
            subscriptionType: subscription.metadata.subscriptionType as SubscriptionType,
            selectedProducts: subscription.metadata.selectedProducts?.split(',') as ProductType[] || [],
            selectedVerticals: subscription.metadata.selectedVerticals?.split(',') as IndustryVertical[] || [],
            addOns: JSON.parse(subscription.metadata.addOns || '{}')
          }));
          // Fetch usage logs
          const usage = await getUsageRecords(apiToken.token, subscription.id);
          setUsageLogs(usage);
        }
      } catch (err) {
        setError('Error loading billing data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBillingData();
  }, [user, apiToken]);

  const createOrUpdateSubscription = async () => {
    if (!apiToken?.token) return;
    try {
      if (subscriptionId) {
        // Update existing subscription
        const subscription = await updateSubscription(apiToken.token, subscriptionId, billingState);
        setSubscriptionId(subscription.id);
      } else {
        // Create new subscription
        const subscription = await createSubscription(apiToken.token, billingState);
        setSubscriptionId(subscription.id);
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
      throw error;
    }
  };

  const cancelCurrentSubscription = async () => {
    if (!subscriptionId || !apiToken?.token) return;
    try {
      await cancelSubscription(apiToken.token, subscriptionId);
      setSubscriptionId(null);
      setBillingState(prev => ({
        ...prev,
        subscriptionType: SubscriptionType.FREE,
        selectedProducts: [],
        selectedVerticals: [],
        addOns: {}
      }));
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  };

  const recordUsage = async (metric: ConsumptionMetric, quantity: number) => {
    if (!subscriptionId || !apiToken?.token) return;
    try {
      await createUsageRecord(apiToken.token, subscriptionId, quantity, Date.now());
      // Update local usage logs
      setUsageLogs(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          product: ProductType.COREBRAIN,
          metric,
          usage: quantity,
          cost: calculateConsumptionCost(metric, { usage: quantity })
        }
      ]);
    } catch (error) {
      console.error('Error recording usage:', error);
      throw error;
    }
  };

  const calculateTotalBill = () => {
    // Base subscription price
    let total = getSubscriptionPrice(billingState.subscriptionType);

    // Add product costs
    billingState.selectedProducts.forEach(product => {
      total += getProductPrice(product, billingState.subscriptionType);
    });

    // Add vertical costs
    billingState.selectedVerticals.forEach(vertical => {
      total += getVerticalPrice(vertical, billingState.subscriptionType);
    });

    // Add consumption costs
    Object.entries(billingState.consumption).forEach(([metric, data]) => {
      total += calculateConsumptionCost(metric as ConsumptionMetric, data);
    });

    // Add add-on costs
    if (billingState.addOns.additionalUsers) {
      total += billingState.addOns.additionalUsers * getAdditionalUserPrice(billingState.subscriptionType);
    }
    if (billingState.addOns.customModels) {
      total += getCustomModelPrice(billingState.subscriptionType);
    }
    if (billingState.addOns.priorityGPT) {
      total += getPriorityGPTPrice(billingState.subscriptionType);
    }
    if (billingState.addOns.dedicatedInfrastructure) {
      total += getDedicatedInfrastructurePrice();
    }
    if (billingState.addOns.support24_7) {
      total += getSupport24_7Price();
    }

    return total;
  };

  // Helper functions for price calculations
  const getSubscriptionPrice = (type: SubscriptionType): number => {
    const prices = {
      [SubscriptionType.FREE]: 0,
      [SubscriptionType.BASIC]: 19.99,
      [SubscriptionType.PRO]: 49.99,
      [SubscriptionType.ENTERPRISE]: 199.99
    };
    return prices[type];
  };

  const getProductPrice = (product: ProductType, subscriptionType: SubscriptionType): number => {
    const prices = {
      [ProductType.COREBRAIN]: 0,
      [ProductType.DATAVAULT]: 19.99,
      [ProductType.INSIGHTENGINE]: 39.99,
      [ProductType.CHATCONNECT]: 29.99
    };
    return prices[product];
  };

  const getVerticalPrice = (vertical: IndustryVertical, subscriptionType: SubscriptionType): number => {
    const prices = {
      [IndustryVertical.HOSPITALITY]: 49.99,
      [IndustryVertical.AGRICULTURE]: 59.99
    };
    return prices[vertical];
  };

  const calculateConsumptionCost = (metric: ConsumptionMetric, data: any): number => {
    // TODO: Implement detailed consumption cost calculation
    return 0;
  };

  const getAdditionalUserPrice = (subscriptionType: SubscriptionType): number => {
    return subscriptionType === SubscriptionType.PRO ? 14.99 : 12.99;
  };

  const getCustomModelPrice = (subscriptionType: SubscriptionType): number => {
    return subscriptionType === SubscriptionType.PRO ? 199.99 : 149.99;
  };

  const getPriorityGPTPrice = (subscriptionType: SubscriptionType): number => {
    return subscriptionType === SubscriptionType.PRO ? 99.99 : 49.99;
  };

  const getDedicatedInfrastructurePrice = (): number => 499.99;
  const getSupport24_7Price = (): number => 299.99;

  return (
    <BillingContext.Provider value={{
      billingState,
      setBillingState,
      calculateTotalBill,
      billingHistory,
      usageLogs,
      isLoading,
      error,
      createOrUpdateSubscription,
      cancelCurrentSubscription,
      recordUsage
    }}>
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}; 