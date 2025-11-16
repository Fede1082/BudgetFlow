export class Transaction {
  id: string
  title: string
  amount: number
  date: string
  category?: string
  notes?: string | null
  type?: string // 'income' or 'expense'
  accountId?: string
  createdAt?: Date
  updatedAt?: Date
}
