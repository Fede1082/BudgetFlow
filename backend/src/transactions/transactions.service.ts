import { Injectable } from '@nestjs/common'
import { CreateTransactionDto, UpdateTransactionDto } from './dto/create-transaction.dto'
import { Transaction } from './entities/transaction.entity'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      include: { account: true },
    })
    
    return transactions.map((t) => ({
      id: t.id,
      title: t.title,
      amount: t.type === 'income' ? t.amount : -t.amount,
      date: t.date.toISOString().split('T')[0],
      category: t.category,
      notes: t.notes ?? undefined,
      type: t.type,
      accountId: t.accountId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }))
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    })

    if (!transaction) return null

    return {
      id: transaction.id,
      title: transaction.title,
      amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
      date: transaction.date.toISOString().split('T')[0],
      category: transaction.category,
      notes: transaction.notes ?? undefined,
      type: transaction.type,
      accountId: transaction.accountId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }
  }

  async findByCategory(category: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { category: { equals: category, mode: 'insensitive' } },
      orderBy: { date: 'desc' },
      include: { account: true },
    })

    return transactions.map((t) => ({
      id: t.id,
      title: t.title,
      amount: t.type === 'income' ? t.amount : -t.amount,
      date: t.date.toISOString().split('T')[0],
      category: t.category,
      notes: t.notes ?? undefined,
      type: t.type,
      accountId: t.accountId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }))
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const transactions = await this.prisma.transaction.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'desc' },
      include: { account: true },
    })

    return transactions.map((t) => ({
      id: t.id,
      title: t.title,
      amount: t.type === 'income' ? t.amount : -t.amount,
      date: t.date.toISOString().split('T')[0],
      category: t.category,
      notes: t.notes ?? undefined,
      type: t.type,
      accountId: t.accountId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }))
  }

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const accountId = createTransactionDto.accountId || (await this.getDefaultAccountId())

    const transaction = await this.prisma.transaction.create({
      data: {
        title: createTransactionDto.title,
        amount: Math.abs(createTransactionDto.amount),
        type: createTransactionDto.amount > 0 ? 'income' : 'expense',
        category: createTransactionDto.category || 'other',
        notes: createTransactionDto.notes,
        date: new Date(createTransactionDto.date),
        accountId,
      },
      include: { account: true },
    })

    return {
      id: transaction.id,
      title: transaction.title,
      amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
      date: transaction.date.toISOString().split('T')[0],
      category: transaction.category,
      notes: transaction.notes ?? undefined,
      type: transaction.type,
      accountId: transaction.accountId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        title: updateTransactionDto.title,
        amount: updateTransactionDto.amount ? Math.abs(updateTransactionDto.amount) : undefined,
        type: updateTransactionDto.amount ? (updateTransactionDto.amount > 0 ? 'income' : 'expense') : undefined,
        category: updateTransactionDto.category,
        notes: updateTransactionDto.notes,
        date: updateTransactionDto.date ? new Date(updateTransactionDto.date) : undefined,
      },
      include: { account: true },
    })

    return {
      id: transaction.id,
      title: transaction.title,
      amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
      date: transaction.date.toISOString().split('T')[0],
      category: transaction.category,
      notes: transaction.notes ?? undefined,
      type: transaction.type,
      accountId: transaction.accountId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.transaction.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }

  async getSummary() {
    const transactions = await this.prisma.transaction.findMany()

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    }
  }

  async getSpendingByCategory() {
    const transactions = await this.prisma.transaction.findMany({
      where: { type: 'expense' },
    })

    const spending: Record<string, number> = {}

    transactions.forEach((t) => {
      const category = t.category || 'Other'
      spending[category] = (spending[category] || 0) + t.amount
    })

    return Object.entries(spending).map(([category, amount]) => ({
      category,
      amount,
    }))
  }

  private async getDefaultAccountId(): Promise<string> {
    const account = await this.prisma.account.findFirst()
    if (!account) {
      const newAccount = await this.prisma.account.create({
        data: { name: 'Default Account', balance: 0, type: 'checking' },
      })
      return newAccount.id
    }
    return account.id
  }
}
