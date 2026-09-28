import { useState } from "react";
import type { CreateMedicine } from "../models/Medicine";
import { addMedicine } from "../services/api";

interface MedicineFormProps {
  onMedicineAdded: () => void;
}

export default function MedicineForm({
  onMedicineAdded
}: MedicineFormProps) {

  const [form, setForm] =
    useState<CreateMedicine>({
      fullName: "",
      notes: "",
      expiryDate: "",
      quantity: 0,
      price: 0,
      brand: ""
    });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {

    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "quantity" ||
        name === "price"
          ? Number(value)
          : value
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    try {

      await addMedicine(form);

      setForm({
        fullName: "",
        notes: "",
        expiryDate: "",
        quantity: 0,
        price: 0,
        brand: ""
      });

      onMedicineAdded();

      alert("Medicine added successfully.");

    } catch (error) {

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add medicine."
      );
    }
  };

  return (
    <form
      className="medicine-form"
      onSubmit={handleSubmit}
    >

      <h2>Add Medicine</h2>

      <input
        name="fullName"
        placeholder="Medicine name"
        value={form.fullName}
        onChange={handleChange}
        required
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />

      <input
        type="date"
        name="expiryDate"
        value={form.expiryDate}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        min="0"
        value={form.quantity}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        min="0"
        step="0.01"
        value={form.price}
        onChange={handleChange}
        required
      />

      <input
        name="brand"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Add Medicine
      </button>

    </form>
  );
}