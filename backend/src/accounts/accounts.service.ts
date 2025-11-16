import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export interface Account {
  id: string
  name: string
  type: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateAccountDto {
  name: string
  type?: string
  balance?: number
}

export interface UpdateAccountDto {
  name?: string
  type?: string
  balance?: number
}

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return accounts.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      balance: a.balance,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }))
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    })

    if (!account) return null

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = await this.prisma.account.create({
      data: {
        name: createAccountDto.name,
        type: createAccountDto.type || 'checking',
        balance: createAccountDto.balance || 0,
      },
    })

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account | null> {
    try {
      const account = await this.prisma.account.update({
        where: { id },
        data: {
          name: updateAccountDto.name,
          type: updateAccountDto.type,
          balance: updateAccountDto.balance,
        },
      })

      return {
        id: account.id,
        name: account.name,
        type: account.type,
        balance: account.balance,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      }
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.account.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }

  async getTotalBalance(): Promise<number> {
    const result = await this.prisma.account.aggregate({
      _sum: {
        balance: true,
      },
    })

    return result._sum.balance || 0
  }
}
