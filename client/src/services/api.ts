/**
 * API Service
 * Centralizes all backend API calls for the BudgetFlow application
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Types
export interface Transaction {
  id: string
  title: string
  amount: number
  date: string
  category?: string
  notes?: string
}

export interface Account {
  id: string
  name: string
  balance: number
  type: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Utility function to handle fetch requests
async function fetchRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: `HTTP ${response.status}`,
      }))
      return {
        success: false,
        error: error.error || `HTTP Error: ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// Transaction API endpoints
export const TransactionAPI = {
  /**
   * Get all transactions
   */
  getAll: async (): Promise<ApiResponse<Transaction[]>> => {
    return fetchRequest<Transaction[]>('/transactions')
  },

  /**
   * Get a single transaction by ID
   */
  getById: async (id: string): Promise<ApiResponse<Transaction>> => {
    return fetchRequest<Transaction>(`/transactions/${id}`)
  },

  /**
   * Create a new transaction
   */
  create: async (transaction: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> => {
    return fetchRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    })
  },

  /**
   * Update an existing transaction
   */
  update: async (id: string, transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    return fetchRequest<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    })
  },

  /**
   * Delete a transaction
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return fetchRequest<void>(`/transactions/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get transactions by category
   */
  getByCategory: async (category: string): Promise<ApiResponse<Transaction[]>> => {
    return fetchRequest<Transaction[]>(`/transactions?category=${encodeURIComponent(category)}`)
  },

  /**
   * Get transactions by date range
   */
  getByDateRange: async (startDate: string, endDate: string): Promise<ApiResponse<Transaction[]>> => {
    return fetchRequest<Transaction[]>(
      `/transactions?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    )
  },
}

// Account API endpoints
export const AccountAPI = {
  /**
   * Get all accounts
   */
  getAll: async (): Promise<ApiResponse<Account[]>> => {
    return fetchRequest<Account[]>('/accounts')
  },

  /**
   * Get a single account by ID
   */
  getById: async (id: string): Promise<ApiResponse<Account>> => {
    return fetchRequest<Account>(`/accounts/${id}`)
  },

  /**
   * Create a new account
   */
  create: async (account: Omit<Account, 'id'>): Promise<ApiResponse<Account>> => {
    return fetchRequest<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    })
  },

  /**
   * Update an existing account
   */
  update: async (id: string, account: Partial<Account>): Promise<ApiResponse<Account>> => {
    return fetchRequest<Account>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
    })
  },

  /**
   * Delete an account
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return fetchRequest<void>(`/accounts/${id}`, {
      method: 'DELETE',
    })
  },
}

// Statistics API endpoints
export const StatsAPI = {
  /**
   * Get balance summary (income, expenses, net)
   */
  getSummary: async (): Promise<ApiResponse<{
    totalIncome: number
    totalExpenses: number
    netBalance: number
  }>> => {
    return fetchRequest('/stats/summary')
  },

  /**
   * Get spending by category
   */
  getSpendingByCategory: async (): Promise<ApiResponse<Array<{ category: string; amount: number }>>> => {
    return fetchRequest('/stats/spending-by-category')
  },

  /**
   * Get monthly summary
   */
  getMonthlySummary: async (month?: string): Promise<ApiResponse<any>> => {
    const query = month ? `?month=${encodeURIComponent(month)}` : ''
    return fetchRequest(`/stats/monthly-summary${query}`)
  },
}

// Health check
export const HealthAPI = {
  /**
   * Check API health status
   */
  check: async (): Promise<ApiResponse<{ status: string }>> => {
    return fetchRequest('/health')
  },
}

// Utility functions
export const ApiUtils = {
  /**
   * Check if API response was successful
   */
  isSuccess: (response: ApiResponse): boolean => response.success,

  /**
   * Get error message from response
   */
  getErrorMessage: (response: ApiResponse): string => response.error || 'Unknown error',

  /**
   * Format error for UI display
   */
  formatError: (response: ApiResponse): string => {
    if (!response.success) {
      return response.error || response.message || 'An error occurred'
    }
    return ''
  },
}

export default {
  TransactionAPI,
  AccountAPI,
  StatsAPI,
  HealthAPI,
  ApiUtils,
}
