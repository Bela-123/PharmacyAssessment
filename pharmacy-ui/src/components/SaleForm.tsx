import { useState } from "react";
import type { Medicine } from "../models/Medicine";
import { createSale } from "../services/api";

interface SaleFormProps {
  medicines: Medicine[];
  onSaleCompleted: () => void;
}

export default function SaleForm({
  medicines,
  onSaleCompleted
}: SaleFormProps) {

  const [medicineId, setMedicineId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedMedicine = medicines.find(
    medicine => medicine.id === medicineId
  );

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (medicineId === "") {
      setError("Please select a medicine.");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (selectedMedicine &&
        quantity > selectedMedicine.quantity) {

      setError(
        `Insufficient stock. Available quantity: ${selectedMedicine.quantity}`
      );

      return;
    }

    try {

      await createSale(
        medicineId,
        quantity
      );

      setSuccess(
        "Sale recorded successfully."
      );

      setMedicineId("");
      setQuantity(1);

      // Reload medicine list so the
      // updated stock is displayed.
      onSaleCompleted();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Failed to record sale."
      );
    }
  };

  return (
    <form
      className="sale-form"
      onSubmit={handleSubmit}
    >

      <h2>Record Sale</h2>

      <label>
        Medicine
      </label>

      <select
        value={medicineId}
        onChange={(event) =>
          setMedicineId(
            event.target.value === ""
              ? ""
              : Number(event.target.value)
          )
        }
        required
      >

        <option value="">
          Select medicine
        </option>

        {medicines.map(medicine => (

          <option
            key={medicine.id}
            value={medicine.id}
          >
            {medicine.fullName} -
            Stock: {medicine.quantity}
          </option>

        ))}

      </select>

      <label>
        Quantity
      </label>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(event) =>
          setQuantity(Number(event.target.value))
        }
        required
      />

      {selectedMedicine && (
        <p className="stock-info">
          Available stock:{" "}
          <strong>
            {selectedMedicine.quantity}
          </strong>
        </p>
      )}

      {error && (
        <p className="sale-error">
          {error}
        </p>
      )}

      {success && (
        <p className="sale-success">
          {success}
        </p>
      )}

      <button type="submit">
        Record Sale
      </button>

    </form>
  );
}