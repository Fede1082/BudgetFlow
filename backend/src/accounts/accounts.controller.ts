import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import type { CreateAccountDto, UpdateAccountDto } from './accounts.service'

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll() {
    return this.accountsService.findAll()
  }

  @Get('total-balance')
  async getTotalBalance() {
    const totalBalance = await this.accountsService.getTotalBalance()
    return { totalBalance }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const account = await this.accountsService.findById(id)
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
    }
    return account
  }

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    const updated = await this.accountsService.update(id, updateAccountDto)
    if (!updated) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
    }
    return updated
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.accountsService.delete(id)
    if (!deleted) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
    }
    return { success: true, message: 'Account deleted successfully' }
  }
}
