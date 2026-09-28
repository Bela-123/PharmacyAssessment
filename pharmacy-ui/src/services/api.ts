import type {
  Medicine,
  CreateMedicine,
  Sale
} from "../models/Medicine";

const API_BASE_URL = "http://localhost:5274/api";

export async function getMedicines(
  search: string = ""
): Promise<Medicine[]> {

  const url = search
    ? `${API_BASE_URL}/Medicines?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/Medicines`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch medicines");
  }

  return response.json();
}

export async function addMedicine(
  medicine: CreateMedicine
): Promise<Medicine> {

  const response = await fetch(
    `${API_BASE_URL}/Medicines`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(medicine)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add medicine");
  }

  return response.json();
}

export async function createSale(
  medicineId: number,
  quantity: number
): Promise<Sale> {

  const response = await fetch(
    `${API_BASE_URL}/Sales`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        medicineId,
        quantity
      })
    }
  );

  if (!response.ok) {

    const error = await response.json();

    throw new Error(
      error.message || "Failed to create sale"
    );
  }

  return response.json();
}