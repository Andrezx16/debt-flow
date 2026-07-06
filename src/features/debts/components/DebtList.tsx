'use client'

import { useState, useMemo } from 'react'
import type { Debt } from '@/types'
import { DebtCard } from './DebtCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { DeleteDebtDialog } from './DeleteDebtDialog'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ArrowUpDown } from 'lucide-react'

interface DebtListProps {
  initialDebts: Debt[]
}

type FilterType = 'all' | 'active' | 'completed'
type SortType = 'newest' | 'oldest' | 'largest' | 'smallest' | 'progress'

export function DebtList({ initialDebts }: DebtListProps) {
  const [debts] = useState<Debt[]>(initialDebts)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('newest')
  
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null)

  const filteredAndSortedDebts = useMemo(() => {
    let result = [...debts]

    // Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.debtor_name.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q)
      )
    }

    // Filter
    if (filter !== 'all') {
      result = result.filter((d) => d.status === filter)
    }

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'largest':
          return b.total_amount - a.total_amount
        case 'smallest':
          return a.total_amount - b.total_amount
        case 'progress':
          return b.percentage - a.percentage
        default:
          return 0
      }
    })

    return result
  }, [debts, search, filter, sort])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Controls */}
      <div
        className="clay-card-sm"
        style={{
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flex: '1 1 300px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Buscar deudas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="clay-input"
            style={{ paddingLeft: '2.75rem', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="clay-input"
              style={{ paddingLeft: '2.25rem', appearance: 'none', cursor: 'pointer', paddingRight: '2rem' }}
            >
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="completed">Completadas</option>
            </select>
          </div>
          <div style={{ position: 'relative' }}>
            <ArrowUpDown size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="clay-input"
              style={{ paddingLeft: '2.25rem', appearance: 'none', cursor: 'pointer', paddingRight: '2rem' }}
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="largest">Mayor monto</option>
              <option value="smallest">Menor monto</option>
              <option value="progress">Mayor progreso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSortedDebts.length > 0 ? (
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedDebts.map((debt) => (
              <DebtCard key={debt.id} debt={debt} onDeleteClick={setDebtToDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          variant={search || filter !== 'all' ? 'search' : 'debts'}
          title={search ? 'No se encontraron resultados' : 'Sin deudas'}
        />
      )}

      <DeleteDebtDialog
        debt={debtToDelete}
        open={!!debtToDelete}
        onClose={() => setDebtToDelete(null)}
      />
    </div>
  )
}
