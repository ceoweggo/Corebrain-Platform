import { BillingState } from '@/types/billing';
import { API_ENDPOINT } from '../utils/constants';

export const createSubscription = async (token: string, billingState: BillingState) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/v1/stripe/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(billingState),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error creating subscription: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const updateSubscription = async (token: string, subscriptionId: string, billingState: BillingState) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/v1/stripe/subscription/${subscriptionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(billingState),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error updating subscription: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (token: string, subscriptionId: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/v1/stripe/subscription/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error canceling subscription: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const createUsageRecord = async (
  token: string,
  subscriptionItemId: string,
  quantity: number,
  timestamp: number
) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/v1/stripe/usage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        subscriptionItemId,
        quantity,
        timestamp,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error creating usage record: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating usage record:', error);
    throw error;
  }
};

export const getSubscriptionDetails = async (token: string, subscriptionId: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/v1/stripe/subscription/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching subscription details: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
};

export const getBillingHistory = async (token: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/v1/stripe/billing-history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching billing history: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching billing history:', error);
    throw error;
  }
};

export const getUsageRecords = async (token: string, subscriptionId: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/v1/stripe/usage/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching usage records: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching usage records:', error);
    throw error;
  }
}; 