import type { Medicine } from "../models/Medicine";

interface MedicineGridProps {
  medicines: Medicine[];
}

function isExpiringWithin30Days(
  expiryDate: string
): boolean {

  const today = new Date();
  const expiry = new Date(expiryDate);

  const difference =
    expiry.getTime() - today.getTime();

  const days =
    difference / (1000 * 60 * 60 * 24);

  return days >= 0 && days < 30;
}

function getRowClass(
  medicine: Medicine
): string {

  if (
    isExpiringWithin30Days(
      medicine.expiryDate
    )
  ) {
    return "expiry-row";
  }

  if (medicine.quantity < 10) {
    return "low-stock-row";
  }

  return "";
}

export default function MedicineGrid({
  medicines
}: MedicineGridProps) {

  return (
    <table className="medicine-table">

      <thead>
        <tr>
          <th>Medicine Name</th>
          <th>Expiry Date</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Brand</th>
        </tr>
      </thead>

      <tbody>

        {medicines.map((medicine) => (

          <tr
            key={medicine.id}
            className={getRowClass(medicine)}
          >

            <td>{medicine.fullName}</td>

            <td>
              {new Date(
                medicine.expiryDate
              ).toLocaleDateString()}
            </td>

            <td>{medicine.quantity}</td>

            <td>
              ₹{medicine.price.toFixed(2)}
            </td>

            <td>{medicine.brand}</td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}