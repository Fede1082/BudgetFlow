import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Transaction {
  id: string
  title: string
  amount: number
  date: string
  category?: string
  notes?: string
}

export const useTransactionsStore = defineStore('transactions', () => {
  // sample data to get started
  const transactions = ref<Transaction[]>([
    { id: 't1', title: 'Salary', amount: 3000, date: '2025-11-01', category: 'Income', notes: '' },
    { id: 't2', title: 'Groceries', amount: -120.5, date: '2025-11-05', category: 'Food', notes: '' },
    { id: 't3', title: 'Rent', amount: -800, date: '2025-11-03', category: 'Housing', notes: '' },
  ])

  function save(tx: Partial<Transaction> & { id?: string }) {
    if (tx.id) {
      const idx = transactions.value.findIndex(t => t.id === tx.id)
      if (idx >= 0) transactions.value[idx] = { ...(transactions.value[idx] as Transaction), ...(tx as Transaction) }
      return
    }
    // simple id generation
    const id = `t${Date.now()}`
    transactions.value.unshift({ ...(tx as Transaction), id })
  }

  function remove(txOrId: Transaction | { id: string } | string) {
    const id = typeof txOrId === 'string' ? txOrId : (txOrId as any).id
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  function clear() {
    transactions.value = []
  }

  function getById(id: string) {
    return transactions.value.find(t => t.id === id)
  }

  return { transactions, save, remove, clear, getById }
})
