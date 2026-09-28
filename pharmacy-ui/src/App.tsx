import { useEffect, useState } from "react";

import type { Medicine } from "./models/Medicine";

import {
  getMedicines
} from "./services/api";

import MedicineGrid from "./components/MedicineGrid";

import MedicineForm from "./components/MedicineForm";
import SaleForm from "./components/SaleForm";

function App() {

  const [medicines, setMedicines] =
    useState<Medicine[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadMedicines = async () => {

    try {

      setLoading(true);

      const data =
        await getMedicines(search);

      setMedicines(data);

      setError("");

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load medicines."
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, [search]);

  return (

    <div className="app">

      <header className="header">

        <h1>ABC Pharmacy</h1>

        <p>
          Medicine Management System
        </p>

      </header>

      <main>

        <section className="search-section">

          <input
            type="text"
            placeholder="Search medicine by name..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </section>

        <MedicineForm
          onMedicineAdded={loadMedicines}
        />

        <SaleForm
  medicines={medicines}
  onSaleCompleted={loadMedicines}
/>

        <section>

          <h2>Available Medicines</h2>

          {loading && (
            <p>Loading medicines...</p>
          )}

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            medicines.length === 0 && (
              <p>No medicines found.</p>
            )}

          {!loading &&
            !error &&
            medicines.length > 0 && (

              <MedicineGrid
                medicines={medicines}
              />

            )}

        </section>

      </main>

    </div>
  );
}

export default App;