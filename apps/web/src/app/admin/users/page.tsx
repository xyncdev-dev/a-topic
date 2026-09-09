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
    <div className="font-mono">
      {/* Users Window */}
      <div className="win-frame">
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>👤</span>
            <span>C:\ADMIN\USER_DIR.DAT // USER_DIRECTORY</span>
          </span>
          <span className="text-[10px]">TOTAL: {total} REGISTROS</span>
        </div>

        <div className="p-4 sm:p-5 bg-[#0a0a0a]">
          {/* Search bar */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="BUSCAR POR EMAIL O NOMBRE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="retro-input w-full text-xs placeholder-[#555]"
            />
          </div>

          <div className="space-y-2.5">
            {users.map((u, i) => (
              <Link key={u.id} href={`/admin/users/${u.id}`} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-3 bg-[#0d0d0d] border border-[#1a0505] group-hover:border-[#ca3a3a] group-hover:bg-[#150505] flex items-center justify-between transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-white group-hover:text-[#ff6b6b] transition-colors truncate">
                      {u.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#A1A1AA]">{u.name || 'Sin nombre'}</span>
                      {u.role === 'admin' ? (
                        <span className="retro-badge bg-[#1a0505] text-[#ff6b6b] border-[#ca3a3a]">
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#666] border border-[#222] px-1.5 py-0.2">
                          CLIENTE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white">
                      {u.currentBalance.toLocaleString('es-ES')}{' '}
                      <span className="text-[10px] text-[#ca3a3a]">COINS</span>
                    </p>
                    <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                      NIVEL {u.tier}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}

            {loading && users.length === 0 && (
              <div className="retro-inset p-8 text-center">
                <span className="text-2xl animate-[coin-spin_0.6s_ease-out] inline-block mb-2 text-[#ca3a3a]">
                  ⚙
                </span>
                <p className="text-white text-xs font-bold">CONSULTANDO BASE DE DATOS...</p>
              </div>
            )}

            {!loading && users.length === 0 && (
              <div className="retro-inset p-8 text-center text-[#A1A1AA] text-xs">
                No se encontraron usuarios coincidentes con la búsqueda.
              </div>
            )}
          </div>

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="btn-retro w-full mt-4 py-2 text-xs"
            >
              {loading ? 'CARGANDO...' : 'CARGAR MÁS REGISTROS [↓]'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
