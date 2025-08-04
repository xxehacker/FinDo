export const getSampleTransactions = (userId) => [
  {
    id: '1',
    type: 'income',
    amount: 3500,
    category: 'Salary',
    bankAccount: 'Primary Checking',
    description: 'Monthly Salary',
    date: '2024-12-01',
    userId
  },
  {
    id: '2',
    type: 'expense',
    amount: 85,
    category: 'Food & Dining',
    bankAccount: 'Primary Checking',
    description: 'Grocery Shopping',
    date: '2024-12-10',
    userId
  },
  {
    id: '3',
    type: 'expense',
    amount: 45,
    category: 'Transportation',
    bankAccount: 'Digital Wallet',
    description: 'Gas Station',
    date: '2024-12-12',
    userId
  },
  {
    id: '4',
    type: 'income',
    amount: 500,
    category: 'Freelance',
    bankAccount: 'Primary Checking',
    description: 'Web Design Project',
    date: '2024-12-15',
    userId
  },
  {
    id: '5',
    type: 'expense',
    amount: 120,
    category: 'Utilities',
    bankAccount: 'Primary Checking',
    description: 'Electric Bill',
    date: '2024-12-18',
    userId
  },
  {
    id: '6',
    type: 'expense',
    amount: 75,
    category: 'Entertainment',
    bankAccount: 'Primary Checking',
    description: 'Movie Theater',
    date: '2024-12-20',
    userId
  }
];

export const getSampleTasks = (userId) => [
  {
    id: '1',
    title: 'Complete Q4 Budget Review',
    description: 'Review and analyze Q4 expenses and prepare budget for next quarter',
    priority: 'high',
    status: 'inProgress',
    progress: 65,
    dueDate: '2024-12-30',
    subtasks: [
      { id: '1', title: 'Gather expense reports', completed: true },
      { id: '2', title: 'Analyze spending patterns', completed: true },
      { id: '3', title: 'Create budget proposal', completed: false },
      { id: '4', title: 'Present to stakeholders', completed: false }
    ],
    userId,
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Buy Office Equipment',
    description: 'Purchase new office chair and upgrade SSD',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    dueDate: '2024-12-25',
    subtasks: [
      { id: '1', title: 'Research ergonomic chairs', completed: false },
      { id: '2', title: 'Compare SSD prices', completed: false },
      { id: '3', title: 'Make purchases', completed: false }
    ],
    productId: '1',
    userId,
    createdAt: '2024-12-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Weekly Grocery Planning',
    description: 'Plan and purchase groceries for the week',
    priority: 'low',
    status: 'completed',
    progress: 100,
    dueDate: '2024-12-22',
    subtasks: [
      { id: '1', title: 'Make shopping list', completed: true },
      { id: '2', title: 'Go to grocery store', completed: true },
      { id: '3', title: 'Organize groceries', completed: true }
    ],
    productId: '2',
    userId,
    createdAt: '2024-12-15T09:00:00Z'
  },
  {
    id: '4',
    title: 'Setup Home Office',
    description: 'Organize and optimize home office workspace',
    priority: 'medium',
    status: 'inProgress',
    progress: 30,
    dueDate: '2024-12-28',
    subtasks: [
      { id: '1', title: 'Clean desk area', completed: true },
      { id: '2', title: 'Install laptop stand', completed: false },
      { id: '3', title: 'Organize cables', completed: false },
      { id: '4', title: 'Set up lighting', completed: false }
    ],
    productId: '4',
    userId,
    createdAt: '2024-12-18T09:00:00Z'
  }
];