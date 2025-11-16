export class CreateTransactionDto {
  title: string
  amount: number
  date: string
  category?: string
  notes?: string
  accountId?: string // Optional, will use default account if not provided
}

export class UpdateTransactionDto {
  title?: string
  amount?: number
  date?: string
  category?: string
  notes?: string
  accountId?: string
}
