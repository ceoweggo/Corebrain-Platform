import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { TokenManager } from '@/components/TokenManager';
import { AppearanceSettings } from '@/components/products/corebrain/AppearanceSettings';
import { Account } from '@/components/Account';
import { Billing } from '@/components/Billing';
import { CodeGenerator } from '@/components/products/corebrain/CodeGenerator';
import { SubscriptionTester } from '@/components/SubscriptionTester';

const Index = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tokens" element={<TokenManager />} />
        <Route path="/appearance" element={<AppearanceSettings />} />
        <Route path="/account" element={<Account />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/code-generator" element={<CodeGenerator />} />
        <Route path="/subscription-tester" element={<SubscriptionTester />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default Index;