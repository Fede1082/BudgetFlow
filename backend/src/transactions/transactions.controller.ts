import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, Query } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto, UpdateTransactionDto } from './dto/create-transaction.dto'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (category) {
      return this.transactionsService.findByCategory(category)
    }
    if (startDate && endDate) {
      return this.transactionsService.findByDateRange(startDate, endDate)
    }
    return this.transactionsService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const transaction = this.transactionsService.findById(id)
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND)
    }
    return transaction
  }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    const updated = this.transactionsService.update(id, updateTransactionDto)
    if (!updated) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND)
    }
    return updated
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const deleted = this.transactionsService.delete(id)
    if (!deleted) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND)
    }
    return { success: true, message: 'Transaction deleted successfully' }
  }
}

