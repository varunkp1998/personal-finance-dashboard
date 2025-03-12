export const getFinancialSummary = async () => {
    // Fetch from API later. For now, using dummy data.
    return {
      totalIncome: 50000,
      totalExpenses: 30000,
      investmentsValue: 20000,
      netWorth: 40000,
      transactions: [
        { month: 'Oct', income: 8000, expenses: 5000 },
        { month: 'Nov', income: 7500, expenses: 6000 },
        { month: 'Dec', income: 9000, expenses: 4000 },
        { month: 'Jan', income: 9500, expenses: 7000 },
        { month: 'Feb', income: 10000, expenses: 6500 },
        { month: 'Mar', income: 10500, expenses: 6200 }
      ],
      expensesByCategory: [
        { category: 'Rent', value: 10000 },
        { category: 'Food', value: 5000 },
        { category: 'Utilities', value: 4000 },
        { category: 'Travel', value: 3000 },
        { category: 'Others', value: 8000 }
      ]
    };
  };
  