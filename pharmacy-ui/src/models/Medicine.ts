export interface Medicine {
  id: number;
  fullName: string;
  notes: string;
  expiryDate: string;
  quantity: number;
  price: number;
  brand: string;
}

export interface CreateMedicine {
  fullName: string;
  notes: string;
  expiryDate: string;
  quantity: number;
  price: number;
  brand: string;
}

export interface Sale {
  id: number;
  medicineId: number;
  quantitySold: number;
  saleDate: string;
}