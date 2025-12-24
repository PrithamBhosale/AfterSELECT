// Sample data for SQL practice
export const sampleTables = {
  customers: [
    { id: 1, first_name: 'John', country: 'USA', score: 500 },
    { id: 2, first_name: 'Maria', country: 'Germany', score: 750 },
    { id: 3, first_name: 'Ahmed', country: 'France', score: 300 },
    { id: 4, first_name: 'Yuki', country: 'Japan', score: 890 },
    { id: 5, first_name: 'Carlos', country: 'USA', score: 150 },
  ],
  orders: [
    { order_id: 101, customer_id: 1, sales: 250.00, order_date: '2024-01-15' },
    { order_id: 102, customer_id: 2, sales: 450.50, order_date: '2024-02-20' },
    { order_id: 103, customer_id: 1, sales: 125.00, order_date: '2024-03-10' },
    { order_id: 104, customer_id: 4, sales: 890.00, order_date: '2024-04-05' },
    { order_id: 105, customer_id: 3, sales: 67.50, order_date: '2024-05-12' },
  ],
  products: [
    { product_id: 1, product_name: 'Laptop', category: 'Electronics', price: 999.99 },
    { product_id: 2, product_name: 'Headphones', category: 'Electronics', price: 149.99 },
    { product_id: 3, product_name: 'Coffee Maker', category: 'Appliances', price: 79.50 },
    { product_id: 4, product_name: 'Desk Chair', category: 'Furniture', price: 299.00 },
    { product_id: 5, product_name: 'Monitor', category: 'Electronics', price: 349.99 },
  ],
  employees: [
    { employee_id: 1, first_name: 'Sarah', last_name: 'Johnson', department: 'Sales', salary: 65000 },
    { employee_id: 2, first_name: 'Mike', last_name: 'Chen', department: 'Engineering', salary: 85000 },
    { employee_id: 3, first_name: 'Lisa', last_name: 'Williams', department: 'Marketing', salary: 55000 },
    { employee_id: 4, first_name: 'David', last_name: 'Brown', department: 'Sales', salary: 72000 },
    { employee_id: 5, first_name: 'Emma', last_name: 'Davis', department: 'Engineering', salary: 92000 },
  ],
  persons: [
    // Empty by default - used for DDL/DML practice
    // Columns: id, person_name, birth_date, phone, email
  ],
};

export type TableName = keyof typeof sampleTables;

