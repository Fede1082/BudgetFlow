export class CreateTransactionDto {
  title: string
  amount: number
  date: string
  category?: string
  notes?: string
}

export class UpdateTransactionDto {
  title?: string
  amount?: number
  date?: string
  category?: string
  notes?: string
}
