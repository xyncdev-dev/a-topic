'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '../../../lib/api';
import type { User } from '@a-topic/shared';

export default function AdminUsersPage() {
 const [users, setUsers] = useState<User[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [page, setPage] = useState(1);
 const [total, setTotal] = useState(0);

 const fetchUsers = useCallback(async (p: number, s: string) => {
 try {
 setLoading(true);
 const res = await api.get<{ users: User[]; total: number }>(`/admin/users?page=${p}&limit=20&search=${encodeURIComponent(s)}`);
 setUsers(p === 1 ? res.users : [...users, ...res.users]);
 setTotal(res.total);
 } catch (error) {
 console.error('Failed to fetch users:', error);
 } finally {
 setLoading(false);
 }
 }, [users]); // eslint-disable-line react-hooks/exhaustive-deps

 useEffect(() => {
 setPage(1);
 const timeout = setTimeout(() => {
 fetchUsers(1, search);
 }, 300);
 return () => clearTimeout(timeout);
 }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

 const loadMore = () => {
 const nextPage = page + 1;
 setPage(nextPage);
 fetchUsers(nextPage, search);
 };

 const hasMore = users.length < total;

 return (
 <div className="px-4 pt-6">
 <div className="mb-6">
 <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-white">
 Usuarios Registrados
 </h1>
 <p className="text-sm text-[#A1A1AA] mt-1">
 Gestiona los usuarios y sus balances
 </p>
 </div>

 <div className="mb-4">
 <input
 type="text"
 placeholder="Buscar por email o nombre..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 transition-all"
 />
 </div>

 <div className="space-y-3">
 {users.map((u, i) => (
 <Link key={u.id} href={`/admin/users/${u.id}`}>
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="p-4 flex items-center justify-between hover:bg-white/[0.06] transition-colors cursor-pointer"
 >
 <div>
 <p className="text-sm font-bold text-white">{u.email}</p>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-xs text-[#A1A1AA]">{u.name || 'Sin nombre'}</span>
 {u.role === 'admin' && (
 <span className="text-[10px] px-2 py-0.5 bg-[#E50914]/20 text-[#FCA5A5] border border-[#E50914]/30">
 Admin
 </span>
 )}
 </div>
 </div>
 <div className="text-right">
 <p className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
 {u.currentBalance.toLocaleString('es-ES')} <span className="text-sm text-[#A1A1AA]"></span>
 </p>
 <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
 Nivel {u.tier}
 </p>
 </div>
 </motion.div>
 </Link>
 ))}

 {loading && users.length === 0 && (
 <div className="text-center py-8">
 <span className="text-2xl animate-[coin-spin_0.6s_ease-out] inline-block"></span>
 </div>
 )}

 {!loading && users.length === 0 && (
 <div className="text-center py-8 text-[#A1A1AA] text-sm">
 No se encontraron usuarios.
 </div>
 )}
 </div>

 {hasMore && (
 <button
 onClick={loadMore}
 disabled={loading}
 className="w-full mt-4 py-3 text-sm text-[#E50914] hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50"
 >
 {loading ? 'Cargando...' : 'Cargar más'}
 </button>
 )}
 </div>
 );
}
