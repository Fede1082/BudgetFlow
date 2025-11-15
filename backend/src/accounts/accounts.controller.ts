import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import type { CreateAccountDto, UpdateAccountDto } from './accounts.service'

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll() {
    return this.accountsService.findAll()
  }

  @Get('total-balance')
  getTotalBalance() {
    return { totalBalance: this.accountsService.getTotalBalance() }
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const account = this.accountsService.findById(id)
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
    }
    return account
  }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    const updated = this.accountsService.update(id, updateAccountDto)
    if (!updated) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
    }
    return updated
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const deleted = this.accountsService.delete(id)
    if (!deleted) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
    }
    return { success: true, message: 'Account deleted successfully' }
  }
}
