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
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* KPIs in Retro Win-Frames */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="win-frame">
          <div className="win-titlebar">
            <span className="flex items-center gap-1.5 truncate">
              <Users className="w-3.5 h-3.5" />
              <span>SYS_USERS.DAT</span>
            </span>
            <span className="text-[10px]">TOTAL</span>
          </div>
          <div className="p-4 bg-[#0a0a0a]">
            <p className="text-3xl font-black text-white tracking-wider">
              {kpis?.totalUsers.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-1">
              USUARIOS REGISTRADOS
            </p>
          </div>
        </div>
        
        <div className="win-frame">
          <div className="win-titlebar">
            <span className="flex items-center gap-1.5 truncate">
              <Coins className="w-3.5 h-3.5" />
              <span>CIRCULATION.SYS</span>
            </span>
            <span className="text-[10px]">LIVE</span>
          </div>
          <div className="p-4 bg-[#0a0a0a]">
            <p className="text-3xl font-black text-[#ca3a3a] tracking-wider">
              {kpis?.activeCoins.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-1">
              COINS EN CIRCULACIÓN
            </p>
          </div>
        </div>

        <div className="win-frame">
          <div className="win-titlebar">
            <span className="flex items-center gap-1.5 truncate">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>MINTED.LOG</span>
            </span>
            <span className="text-[10px] text-emerald-400">INFLOW</span>
          </div>
          <div className="p-4 bg-[#0a0a0a]">
            <p className="text-3xl font-black text-emerald-400 tracking-wider">
              +{kpis?.totalEarned.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-1">
              TOTAL EMITIDO
            </p>
          </div>
        </div>

        <div className="win-frame">
          <div className="win-titlebar">
            <span className="flex items-center gap-1.5 truncate">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>BURNED.LOG</span>
            </span>
            <span className="text-[10px] text-[#ff6b6b]">OUTFLOW</span>
          </div>
          <div className="p-4 bg-[#0a0a0a]">
            <p className="text-3xl font-black text-[#ff6b6b] tracking-wider">
              -{kpis?.totalRedeemed ? Math.abs(kpis.totalRedeemed).toLocaleString() : '0'}
            </p>
            <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-1">
              TOTAL CANJEADO
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Window */}
        <div className="lg:col-span-2 win-frame">
          <div className="win-titlebar">
            <span className="flex items-center gap-2 truncate">
              <span>📈</span>
              <span>C:\TELEMETRY\ACTIVITY_30D.PLT</span>
            </span>
            <span className="text-[10px]">30 DAYS WINDOW</span>
          </div>

          <div className="p-4 bg-[#0a0a0a]">
            <div className="h-[300px] w-full min-w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#222" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '2px solid #ca3a3a', borderRadius: 0, fontFamily: 'monospace' }}
                    itemStyle={{ color: '#fff', fontSize: '11px' }}
                  />
                  <Legend iconType="square" wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Bar dataKey="earn" name="Emitidos" fill="#10B981" />
                  <Bar dataKey="redeem" name="Canjeados" fill="#ca3a3a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Users Window */}
        <div className="win-frame">
          <div className="win-titlebar">
            <span className="flex items-center gap-2 truncate">
              <span>⭐</span>
              <span>C:\DIR\TOP_HOLDERS.LST</span>
            </span>
            <span className="text-[10px]">LEADERBOARD</span>
          </div>

          <div className="p-4 bg-[#0a0a0a] space-y-3">
            {topUsers.map((u: any, i: number) => (
              <div key={u.id} className="p-2.5 bg-[#0d0d0d] border border-[#1a0505] flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                  <div className="w-5 h-5 shrink-0 bg-[#1a0505] border border-[#ca3a3a] flex items-center justify-center text-[10px] font-bold text-[#ff6b6b]">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white font-bold truncate" title={u.name || u.email}>
                      {u.name || u.email.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-[#A1A1AA] uppercase">NIVEL {u.tier}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end">
                  <p className="text-xs font-bold text-emerald-400">+{u.total_earned} COINS</p>
                  <a 
                    href={`/admin/users/${u.id}`} 
                    className="text-[10px] uppercase tracking-wider text-[#ca3a3a] hover:text-white hover:underline transition-colors mt-0.5"
                  >
                    AJUSTAR →
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
