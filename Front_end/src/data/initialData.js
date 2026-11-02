export const initialTransactions = [
  { id: 'TXN-78451', date: '2026-11-02', customer: 'Walk-in customer', item: 'Red Label Whisky', qty: 1, amount: 1850, method: 'UPI', status: 'Completed' },
  { id: 'TXN-78450', date: '2026-11-02', customer: 'Amit Sharma', item: 'Kingfisher Premium', qty: 6, amount: 900, method: 'Cash', status: 'Completed' },
  { id: 'TXN-78449', date: '2026-11-02', customer: 'Walk-in customer', item: 'Sula Cabernet Shiraz', qty: 1, amount: 1250, method: 'Credit Card', status: 'Completed' },
  { id: 'TXN-78448', date: '2026-11-01', customer: 'Rahul Patil', item: 'Blenders Pride', qty: 2, amount: 2100, method: 'UPI', status: 'Completed' },
  { id: 'TXN-78447', date: '2026-11-01', customer: 'Walk-in customer', item: 'Tuborg Strong', qty: 4, amount: 640, method: 'Cash', status: 'Failed' },
  { id: 'TXN-78446', date: '2026-11-01', customer: 'Neha Joshi', item: 'Jacob’s Creek Shiraz', qty: 1, amount: 1850, method: 'Credit Card', status: 'Completed' },
  { id: 'TXN-78445', date: '2026-10-31', customer: 'Walk-in customer', item: 'Old Monk XXX', qty: 1, amount: 720, method: 'Cash', status: 'Completed' },
  { id: 'TXN-78444', date: '2026-10-31', customer: 'Sagar Kulkarni', item: 'Carlsberg Elephant', qty: 3, amount: 510, method: 'UPI', status: 'Completed' },
  { id: 'TXN-78443', date: '2026-10-30', customer: 'Walk-in customer', item: 'Absolut Vodka', qty: 1, amount: 2400, method: 'Credit Card', status: 'Completed' },
  { id: 'TXN-78442', date: '2026-10-30', customer: 'Pranav Desai', item: 'Sula Chenin Blanc', qty: 1, amount: 950, method: 'UPI', status: 'Failed' }
]

export const initialInventory = [
  { id: 'SKU-1001', name: 'Red Label Whisky', category: 'Whisky', size: '750 ml', stock: 24, price: 1850, reorder: 8 },
  { id: 'SKU-1002', name: 'Blenders Pride', category: 'Whisky', size: '750 ml', stock: 18, price: 1050, reorder: 8 },
  { id: 'SKU-1003', name: 'Old Monk XXX', category: 'Rum', size: '750 ml', stock: 7, price: 720, reorder: 10 },
  { id: 'SKU-1004', name: 'Absolut Vodka', category: 'Vodka', size: '750 ml', stock: 12, price: 2400, reorder: 5 },
  { id: 'SKU-1005', name: 'Sula Cabernet Shiraz', category: 'Wine', size: '750 ml', stock: 5, price: 1250, reorder: 6 },
  { id: 'SKU-1006', name: 'Kingfisher Premium', category: 'Beer', size: '650 ml', stock: 96, price: 150, reorder: 24 },
  { id: 'SKU-1007', name: 'Tuborg Strong', category: 'Beer', size: '650 ml', stock: 14, price: 160, reorder: 24 },
  { id: 'SKU-1008', name: 'Jacob’s Creek Shiraz', category: 'Wine', size: '750 ml', stock: 9, price: 1850, reorder: 4 }
]
