export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    icon: '📱',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Fashion',
    icon: '👕',
    color: '#EC4899',
  },
  {
    id: '3',
    name: 'Home & Living',
    icon: '🏠',
    color: '#8B5CF6',
  },
  {
    id: '4',
    name: 'Beauty',
    icon: '💄',
    color: '#F59E0B',
  },
  {
    id: '5',
    name: 'Sports',
    icon: '⚽',
    color: '#10B981',
  },
  {
    id: '6',
    name: 'Books',
    icon: '📚',
    color: '#6366F1',
  },
  {
    id: '7',
    name: 'Toys',
    icon: '🎮',
    color: '#F97316',
  },
  {
    id: '8',
    name: 'Groceries',
    icon: '🛒',
    color: '#14B8A6',
  },
];
