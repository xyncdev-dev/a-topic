'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Users, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [kpisData, chart, users] = await Promise.all([
          api.get('/admin/stats/kpis'),
          api.get('/admin/stats/chart'),
          api.get('/admin/stats/top-users')
        ]);
        setKpis(kpisData);
        setChartData(chart as any[]);
        setTopUsers(users as any[]);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-[coin-spin_1s_ease-out_infinite] text-2xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 border border-white/10 bg-[#0A0A0A] min-w-[200px]">
          <div className="flex items-center gap-3 text-[#A1A1AA] mb-2">
            <Users className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-semibold uppercase tracking-wider truncate">Usuarios Totales</h3>
          </div>
          <p className="text-3xl font-bold text-white font-[family-name:var(--font-display)] truncate">
            {kpis?.totalUsers.toLocaleString()}
          </p>
        </div>
        
        <div className="p-5 border border-white/10 bg-[#0A0A0A] min-w-[200px]">
          <div className="flex items-center gap-3 text-[#A1A1AA] mb-2">
            <Coins className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-semibold uppercase tracking-wider truncate">Balance Vivo</h3>
          </div>
          <p className="text-3xl font-bold text-[#E50914] font-[family-name:var(--font-display)] truncate">
            {kpis?.activeCoins.toLocaleString()}
          </p>
        </div>

        <div className="p-5 border border-white/10 bg-[#0A0A0A] min-w-[200px]">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <ArrowUpRight className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-semibold uppercase tracking-wider truncate">Coins Emitidos</h3>
          </div>
          <p className="text-3xl font-bold text-white font-[family-name:var(--font-display)] truncate">
            {kpis?.totalEarned.toLocaleString()}
          </p>
        </div>

        <div className="p-5 border border-white/10 bg-[#0A0A0A] min-w-[200px]">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <ArrowDownRight className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-semibold uppercase tracking-wider truncate">Coins Canjeados</h3>
          </div>
          <p className="text-3xl font-bold text-white font-[family-name:var(--font-display)] truncate">
            {kpis?.totalRedeemed ? Math.abs(kpis.totalRedeemed).toLocaleString() : '0'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 border border-white/10 bg-[#0A0A0A] p-5 overflow-hidden">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 truncate">
            Actividad últimos 30 días
          </h3>
          <div className="h-[300px] w-full min-w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: 0 }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="square" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="earn" name="Emitidos" fill="#10B981" />
                <Bar dataKey="redeem" name="Canjeados" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Users Table */}
        <div className="border border-white/10 bg-[#0A0A0A] p-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 truncate">
            Top Usuarios Fieles
          </h3>
          <div className="space-y-4">
            {topUsers.map((u: any, i: number) => (
              <div key={u.id} className="flex items-center justify-between pb-3 border-b border-white/[0.05] last:border-0 last:pb-0">
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <div className="w-6 h-6 shrink-0 bg-[#222] flex items-center justify-center text-xs font-bold text-[#E50914]">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate" title={u.name || u.email}>
                      {u.name || u.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-[#777] uppercase">{u.tier}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <p className="text-sm font-bold text-emerald-400">+{u.total_earned}</p>
                  <a 
                    href={`/admin/users/${u.id}`} 
                    className="text-[10px] uppercase tracking-wider text-[#A1A1AA] hover:text-white transition-colors"
                  >
                    Ajustar Saldo →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
