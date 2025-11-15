/**
 * API Service
 * Centralizes all backend API calls for the BudgetFlow application
 */

// Point directly to backend on port 3000
// In production, use VITE_API_URL env var
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Debug log
console.log('🌐 API Base URL:', API_BASE_URL)

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
): Promise<T> {
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
      const errorData = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status}`,
      }))
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Transaction API endpoints
export const TransactionAPI = {
  /**
   * Get all transactions
   */
  getAll: async (): Promise<Transaction[]> => {
    return fetchRequest<Transaction[]>('/transactions')
  },

  /**
   * Get a single transaction by ID
   */
  getById: async (id: string): Promise<Transaction> => {
    return fetchRequest<Transaction>(`/transactions/${id}`)
  },

  /**
   * Create a new transaction
   */
  create: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    return fetchRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    })
  },

  /**
   * Update an existing transaction
   */
  update: async (id: string, transaction: Partial<Transaction>): Promise<Transaction> => {
    return fetchRequest<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    })
  },

  /**
   * Delete a transaction
   */
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchRequest<{ success: boolean; message: string }>(`/transactions/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get transactions by category
   */
  getByCategory: async (category: string): Promise<Transaction[]> => {
    return fetchRequest<Transaction[]>(`/transactions?category=${encodeURIComponent(category)}`)
  },

  /**
   * Get transactions by date range
   */
  getByDateRange: async (startDate: string, endDate: string): Promise<Transaction[]> => {
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
  getAll: async (): Promise<Account[]> => {
    return fetchRequest<Account[]>('/accounts')
  },

  /**
   * Get a single account by ID
   */
  getById: async (id: string): Promise<Account> => {
    return fetchRequest<Account>(`/accounts/${id}`)
  },

  /**
   * Create a new account
   */
  create: async (account: Omit<Account, 'id'>): Promise<Account> => {
    return fetchRequest<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    })
  },

  /**
   * Update an existing account
   */
  update: async (id: string, account: Partial<Account>): Promise<Account> => {
    return fetchRequest<Account>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
    })
  },

  /**
   * Delete an account
   */
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchRequest<{ success: boolean; message: string }>(`/accounts/${id}`, {
      method: 'DELETE',
    })
  },
}

// Statistics API endpoints
export const StatsAPI = {
  /**
   * Get balance summary (income, expenses, net)
   */
  getSummary: async (): Promise<{
    totalIncome: number
    totalExpenses: number
    netBalance: number
  }> => {
    return fetchRequest('/stats/summary')
  },

  /**
   * Get spending by category
   */
  getSpendingByCategory: async (): Promise<Array<{ category: string; amount: number }>> => {
    return fetchRequest('/stats/spending-by-category')
  },

  /**
   * Get monthly summary
   */
  getMonthlySummary: async (month?: string): Promise<any> => {
    const query = month ? `?month=${encodeURIComponent(month)}` : ''
    return fetchRequest(`/stats/monthly-summary${query}`)
  },
}

// Health check
export const HealthAPI = {
  /**
   * Check API health status
   */
  check: async (): Promise<{ status: string; timestamp: string }> => {
    return fetchRequest('/health')
  },
}

// Utility functions
export const ApiUtils = {
  /**
   * Check if API response was successful (throws on error, so always true if no exception)
   */
  isSuccess: (response: any): boolean => !!response,

  /**
   * Get error message - since we throw errors, this won't typically be used
   * but keeping for API consistency
   */
  getErrorMessage: (error: any): string => {
    if (error instanceof Error) {
      return error.message
    }
    return typeof error === 'string' ? error : 'Unknown error'
  },

  /**
   * Format error for UI display
   */
  formatError: (error: any): string => {
    if (error instanceof Error) {
      return error.message
    }
    return typeof error === 'string' ? error : 'An error occurred'
  },
}

export default {
  TransactionAPI,
  AccountAPI,
  StatsAPI,
  HealthAPI,
  ApiUtils,
}
