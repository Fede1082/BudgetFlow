import { Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { CreateTransactionDto, UpdateTransactionDto } from './dto/create-transaction.dto'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class TransactionsService {
  private transactions: Transaction[] = [
    {
      id: 't1',
      title: 'Salary',
      amount: 3000,
      date: '2025-11-01',
      category: 'Income',
      notes: 'Monthly salary',
      createdAt: new Date('2025-11-01'),
      updatedAt: new Date('2025-11-01'),
    },
    {
      id: 't2',
      title: 'Groceries',
      amount: -120.5,
      date: '2025-11-05',
      category: 'Food',
      notes: 'Weekly groceries',
      createdAt: new Date('2025-11-05'),
      updatedAt: new Date('2025-11-05'),
    },
    {
      id: 't3',
      title: 'Rent',
      amount: -800,
      date: '2025-11-03',
      category: 'Housing',
      notes: 'Monthly rent',
      createdAt: new Date('2025-11-03'),
      updatedAt: new Date('2025-11-03'),
    },
  ]

  findAll(): Transaction[] {
    return this.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  findById(id: string): Transaction | undefined {
    return this.transactions.find((t) => t.id === id)
  }

  findByCategory(category: string): Transaction[] {
    return this.transactions.filter((t) => t.category?.toLowerCase() === category.toLowerCase())
  }

  findByDateRange(startDate: string, endDate: string): Transaction[] {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return this.transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate >= start && tDate <= end
    })
  }

  create(createTransactionDto: CreateTransactionDto): Transaction {
    const transaction: Transaction = {
      id: uuidv4(),
      ...createTransactionDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.transactions.unshift(transaction)
    return transaction
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto): Transaction | undefined {
    const index = this.transactions.findIndex((t) => t.id === id)
    if (index === -1) return undefined

    this.transactions[index] = {
      ...this.transactions[index],
      ...updateTransactionDto,
      updatedAt: new Date(),
    }
    return this.transactions[index]
  }

  delete(id: string): boolean {
    const index = this.transactions.findIndex((t) => t.id === id)
    if (index === -1) return false

    this.transactions.splice(index, 1)
    return true
  }

  getSummary() {
    const totalIncome = this.transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = Math.abs(
      this.transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
    )

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    }
  }

  getSpendingByCategory() {
    const spending: Record<string, number> = {}

    this.transactions
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        const category = t.category || 'Other'
        spending[category] = (spending[category] || 0) + Math.abs(t.amount)
      })

    return Object.entries(spending).map(([category, amount]) => ({
      category,
      amount,
    }))
  }
}
