"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AddIncomeForm() {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");   // yyyy-mm-dd
  const [time, setTime] = useState("12:00");
  const [notes, setNotes] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleValueChange = (v: string) => {
    const cleaned = v.replace(/[^0-9.]/g, "");
    setValue(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const fullDate = new Date(`${date}T${time}`);
      const payload = {
        name,
        description,
        date: Timestamp.fromDate(fullDate),
        notes,
        value: parseFloat(value),
        owner: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "incomes"), payload);

      setSuccess("Income added!");
      setTimeout(() => router.push("/dash"), 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <h2 className="text-2xl font-semibold text-blue-700">Add Income</h2>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Name"
          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-600 focus:ring-blue-100"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-600 focus:ring-blue-100"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-600">Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-600 focus:ring-blue-100"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-600">Hour</label>
            <input
              type="time"
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-600 focus:ring-blue-100"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <textarea
          placeholder="Notes"
          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-600 focus:ring-blue-100"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        <div>
          <label className="mb-1 block text-xs text-gray-600">Value (£)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-600 focus:ring-blue-100"
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Income"}
        </button>
      </form>
    </div>
  );
}
