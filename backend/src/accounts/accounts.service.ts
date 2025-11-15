import { Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit'
  balance: number
  currency: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateAccountDto {
  name: string
  type: 'checking' | 'savings' | 'credit'
  balance?: number
  currency?: string
}

export interface UpdateAccountDto {
  name?: string
  type?: 'checking' | 'savings' | 'credit'
  balance?: number
}

@Injectable()
export class AccountsService {
  private accounts: Account[] = [
    {
      id: 'acc1',
      name: 'Main Account',
      type: 'checking',
      balance: 2500.5,
      currency: 'EUR',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: 'acc2',
      name: 'Savings Account',
      type: 'savings',
      balance: 10000,
      currency: 'EUR',
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
    },
  ]

  findAll(): Account[] {
    return this.accounts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  findById(id: string): Account | undefined {
    return this.accounts.find((a) => a.id === id)
  }

  create(createAccountDto: CreateAccountDto): Account {
    const account: Account = {
      id: uuidv4(),
      ...createAccountDto,
      balance: createAccountDto.balance || 0,
      currency: createAccountDto.currency || 'EUR',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.accounts.unshift(account)
    return account
  }

  update(id: string, updateAccountDto: UpdateAccountDto): Account | undefined {
    const index = this.accounts.findIndex((a) => a.id === id)
    if (index === -1) return undefined

    this.accounts[index] = {
      ...this.accounts[index],
      ...updateAccountDto,
      updatedAt: new Date(),
    }
    return this.accounts[index]
  }

  delete(id: string): boolean {
    const index = this.accounts.findIndex((a) => a.id === id)
    if (index === -1) return false

    this.accounts.splice(index, 1)
    return true
  }

  getTotalBalance(): number {
    return this.accounts.reduce((sum, account) => sum + account.balance, 0)
  }
}
