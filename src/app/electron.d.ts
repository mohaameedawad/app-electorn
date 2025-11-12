export {};

declare global {
  interface Window {
    electronAPI: {
      // العملاء
      getCustomers: () => Promise<any[]>;
      addCustomer: (customer: any) => Promise<any>;
      updateCustomer: (id: number, customer: any) => Promise<any>;
      deleteCustomer: (id: number) => Promise<any>;

      // الموردين
      getSuppliers: () => Promise<any[]>;
      addSupplier: (supplier: any) => Promise<any>;
      updateSupplier: (id: number, supplier: any) => Promise<any>;
      deleteSupplier: (id: number) => Promise<any>;

      // المنتجات
      getProducts: () => Promise<any[]>;
      addProduct: (product: any) => Promise<any>;
      updateProduct: (id: number, product: any) => Promise<any>;
      deleteProduct: (id: number) => Promise<any>;

      // المبيعات
      getSales: () => Promise<any[]>;
      addSale: (sale: any) => Promise<any>;
      updateSale: (id: number, sale: any) => Promise<any>;
      deleteSale: (id: number) => Promise<any>;
    };
  }
}
