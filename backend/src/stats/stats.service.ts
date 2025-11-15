import { Injectable } from '@nestjs/common'
import { TransactionsService } from '../transactions/transactions.service'

@Injectable()
export class StatsService {
  constructor(private readonly transactionsService: TransactionsService) {}

  getSummary() {
    return this.transactionsService.getSummary()
  }

  getSpendingByCategory() {
    return this.transactionsService.getSpendingByCategory()
  }

  getMonthlySummary(month?: string) {
    const transactions = this.transactionsService.findAll()

    // If no month specified, use current month
    const targetDate = month ? new Date(month) : new Date()
    const currentYear = targetDate.getFullYear()
    const currentMonth = targetDate.getMonth()

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth
    })

    const income = monthTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = Math.abs(
      monthTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
    )

    return {
      month: targetDate.toISOString().substring(0, 7),
      income,
      expenses,
      balance: income - expenses,
      transactionCount: monthTransactions.length,
    }
  }
}
