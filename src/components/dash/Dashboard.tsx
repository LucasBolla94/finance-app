"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Entry {
  value: number;
  date: Timestamp;
}

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Entry[]>([]);
  const [expenses, setExpenses] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const today = new Date();
  const currentWeek = getWeekRange(today);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const fetchData = async () => {
      const [incomesSnap, expensesSnap] = await Promise.all([
        getDocs(query(collection(db, "incomes"), where("owner", "==", uid))),
        getDocs(query(collection(db, "expenses"), where("owner", "==", uid))),
      ]);

      const incomeData: Entry[] = [];
      incomesSnap.forEach((doc) => {
        const d = doc.data();
        if (!d.date || !d.value) return;
        incomeData.push({
          value: d.value,
          date: d.date,
        });
      });

      const expenseData: Entry[] = [];
      expensesSnap.forEach((doc) => {
        const d = doc.data();
        if (!d.date || !d.value) return;
        expenseData.push({
          value: d.value,
          date: d.date,
        });
      });

      setIncomes(incomeData);
      setExpenses(expenseData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const incomePerDay = Array(7).fill(0);
  const expensesPerDay = Array(7).fill(0);

  const incomePerMonth = Array(12).fill(0);
  const expensesPerMonth = Array(12).fill(0);

  incomes.forEach((entry) => {
    const d = entry.date.toDate();

    if (d >= currentWeek.start && d <= currentWeek.end) {
      const weekday = (d.getDay() + 6) % 7;
      incomePerDay[weekday] += entry.value;
    }

    const month = d.getMonth();
    incomePerMonth[month] += entry.value;
  });

  expenses.forEach((entry) => {
    const d = entry.date.toDate();

    if (d >= currentWeek.start && d <= currentWeek.end) {
      const weekday = (d.getDay() + 6) % 7;
      expensesPerDay[weekday] += entry.value;
    }

    const month = d.getMonth();
    expensesPerMonth[month] += entry.value;
  });

  const totalIncome = incomePerDay.reduce((a, b) => a + b, 0);
  const totalExpenses = expensesPerDay.reduce((a, b) => a + b, 0);
  const balance = totalIncome - totalExpenses;

  const weeklyChartData = {
    labels: days,
    datasets: [
      {
        label: "Income",
        data: incomePerDay,
        backgroundColor: "#3b82f6",
      },
      {
        label: "Expenses",
        data: expensesPerDay,
        backgroundColor: "#f87171",
      },
    ],
  };

  const monthlyChartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomePerMonth,
        backgroundColor: "#3b82f6",
      },
      {
        label: "Expenses",
        data: expensesPerMonth,
        backgroundColor: "#f87171",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* BLOCOS DE VALORES */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Income (This Week)</p>
          <h3 className="mt-2 text-xl font-bold text-green-600">
            £{totalIncome.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Expenses (This Week)</p>
          <h3 className="mt-2 text-xl font-bold text-red-600">
            £{totalExpenses.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-lg bg-white p-4 shadow col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-500">Balance</p>
          <h3 className="mt-2 text-xl font-bold text-gray-700">
            £{balance.toFixed(2)}
          </h3>
        </div>
      </section>

      {/* WEEKLY CHART */}
      <section className="rounded-lg bg-white p-4 shadow">
        <h4 className="mb-4 text-lg font-semibold text-gray-700">Weekly Overview</h4>
        {loading ? (
          <p className="text-sm text-gray-500">Loading chart...</p>
        ) : (
          <Bar data={weeklyChartData} />
        )}
      </section>

      {/* MONTHLY CHART */}
      <section className="rounded-lg bg-white p-4 shadow">
        <h4 className="mb-4 text-lg font-semibold text-gray-700">Monthly Overview</h4>
        {loading ? (
          <p className="text-sm text-gray-500">Loading chart...</p>
        ) : (
          <Bar data={monthlyChartData} />
        )}
      </section>
    </div>
  );
}

/* 📅 Semana atual (segunda a domingo) */
function getWeekRange(date: Date) {
  const day = date.getDay();
  const diffToMonday = (day + 6) % 7;

  const start = new Date(date);
  start.setDate(date.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
