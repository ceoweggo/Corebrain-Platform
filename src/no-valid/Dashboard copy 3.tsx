
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { BarChart2, MessageCircle, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Datos de ejemplo para las gráficas
const messageData = [
  { name: 'Lun', value: 400 },
  { name: 'Mar', value: 300 },
  { name: 'Mié', value: 500 },
  { name: 'Jue', value: 280 },
  { name: 'Vie', value: 590 },
  { name: 'Sáb', value: 350 },
  { name: 'Dom', value: 200 },
];

const usersData = [
  { name: 'Lun', value: 24 },
  { name: 'Mar', value: 13 },
  { name: 'Mié', value: 42 },
  { name: 'Jue', value: 30 },
  { name: 'Vie', value: 55 },
  { name: 'Sáb', value: 12 },
  { name: 'Dom', value: 10 },
];

export const Dashboard = () => {
  return (
    <main className="min-h-screen bg-[#0b1220] text-white px-6 py-10">
      <section className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-4"
        >
          etedata
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl text-gray-300 mb-8"
        >
          From Raw to Result. Instantly.
        </motion.p>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 text-lg rounded-2xl shadow-md">
          Request a Demo
        </Button>
      </section>

      <section className="mt-20 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="bg-[#121a2c] border-none shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Connect Your Data</h3>
            <p className="text-gray-400">Easily link databases, APIs or spreadsheets into a unified pipeline.</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121a2c] border-none shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Generate Reports</h3>
            <p className="text-gray-400">Leverage AI to create automated, insightful and elegant reports.</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121a2c] border-none shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Export with Ease</h3>
            <p className="text-gray-400">Download in multiple formats: PDF, Excel, JSON, and more.</p>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-32 text-center text-sm text-gray-500">
        © 2025 Etedata. All rights reserved.
      </footer>
    </main>
  );
};

export default Dashboard;
