/**
 * Bank Icons Mapper
 * Maps bank names to Font Awesome icons and colors
 */

export interface BankIconConfig {
  icon: string // Font Awesome icon class
  color: string // Tailwind color class
  bgColor: string // Tailwind background color
}

// Map of bank names to their icon configuration
const bankIconMap: Record<string, BankIconConfig> = {
  // Italian Banks
  fineco: { icon: 'fas fa-building-columns', color: 'text-orange-600', bgColor: 'from-orange-500 to-orange-600' },
  intesa: { icon: 'fas fa-landmark', color: 'text-blue-600', bgColor: 'from-blue-500 to-blue-600' },
  unicredit: { icon: 'fas fa-handshake', color: 'text-red-600', bgColor: 'from-red-500 to-red-600' },
  ubi: { icon: 'fas fa-university', color: 'text-indigo-600', bgColor: 'from-indigo-500 to-indigo-600' },
  bpm: { icon: 'fas fa-chart-pie', color: 'text-cyan-600', bgColor: 'from-cyan-500 to-cyan-600' },
  banco: { icon: 'fas fa-vault', color: 'text-green-600', bgColor: 'from-green-500 to-green-600' },
  credem: { icon: 'fas fa-coins', color: 'text-amber-600', bgColor: 'from-amber-500 to-amber-600' },
  mediolanum: { icon: 'fas fa-briefcase', color: 'text-purple-600', bgColor: 'from-purple-500 to-purple-600' },
  ing: { icon: 'fas fa-zap', color: 'text-yellow-600', bgColor: 'from-yellow-500 to-yellow-600' },
  
  // International Banks
  amazon: { icon: 'fab fa-amazon', color: 'text-orange-600', bgColor: 'from-orange-500 to-orange-600' },
  apple: { icon: 'fab fa-apple', color: 'text-gray-800', bgColor: 'from-gray-700 to-gray-800' },
  google: { icon: 'fab fa-google', color: 'text-blue-600', bgColor: 'from-blue-500 to-blue-600' },
  paypal: { icon: 'fab fa-paypal', color: 'text-blue-700', bgColor: 'from-blue-600 to-blue-700' },
  stripe: { icon: 'fab fa-stripe', color: 'text-purple-600', bgColor: 'from-purple-500 to-purple-600' },
  wise: { icon: 'fas fa-arrow-right-arrow-left', color: 'text-teal-600', bgColor: 'from-teal-500 to-teal-600' },
  n26: { icon: 'fas fa-credit-card', color: 'text-slate-900', bgColor: 'from-slate-800 to-slate-900' },
  revolut: { icon: 'fas fa-mobile', color: 'text-blue-800', bgColor: 'from-blue-700 to-blue-800' },
  
  // Generic Account Types
  main: { icon: 'fas fa-wallet', color: 'text-blue-600', bgColor: 'from-blue-500 to-blue-600' },
  checking: { icon: 'fas fa-credit-card', color: 'text-slate-600', bgColor: 'from-slate-500 to-slate-600' },
  savings: { icon: 'fas fa-piggy-bank', color: 'text-green-600', bgColor: 'from-green-500 to-green-600' },
  credit: { icon: 'fas fa-credit-card', color: 'text-red-600', bgColor: 'from-red-500 to-red-600' },
  credit_card: { icon: 'fas fa-credit-card', color: 'text-red-600', bgColor: 'from-red-500 to-red-600' },
  investment: { icon: 'fas fa-chart-line', color: 'text-emerald-600', bgColor: 'from-emerald-500 to-emerald-600' },
  crypto: { icon: 'fas fa-bitcoin', color: 'text-yellow-600', bgColor: 'from-yellow-500 to-yellow-600' },
  wallet: { icon: 'fas fa-wallet', color: 'text-blue-600', bgColor: 'from-blue-500 to-blue-600' },
  other: { icon: 'fas fa-university', color: 'text-gray-600', bgColor: 'from-gray-500 to-gray-600' },
}

/**
 * Get bank icon configuration based on account name
 * Performs fuzzy matching on account name against known banks
 */
export function getBankIcon(accountName: string): BankIconConfig {
  const nameLower = accountName.toLowerCase().trim()

  // Exact match first
  if (bankIconMap[nameLower]) {
    return bankIconMap[nameLower]
  }

  // Fuzzy match - check if account name contains any known bank name
  for (const [bankName, config] of Object.entries(bankIconMap)) {
    const firstWord = nameLower.split(' ')[0] || ''
    if (nameLower.includes(bankName) || bankName.includes(firstWord)) {
      return config
    }
  }

  // Default icon for unknown banks
  return {
    icon: 'fas fa-university',
    color: 'text-gray-600',
    bgColor: 'from-gray-500 to-gray-600',
  }
}

/**
 * Get all available bank icons
 */
export function getAllBankIcons(): Record<string, BankIconConfig> {
  return bankIconMap
}

export default {
  getBankIcon,
  getAllBankIcons,
}
