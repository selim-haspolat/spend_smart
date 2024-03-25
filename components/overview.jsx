"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: 0,
  },
  {
    name: "Dec",
    total: 6000,
  },
];

export function Overview({ purchases }) {
  const [data, setData] = useState([]);

  const customizePurchases = () => {
    const months = [
      {
        name: "Jan",
        total: 0,
      },
      {
        name: "Feb",
        total: 0,
      },
      {
        name: "Mar",
        total: 0,
      },
      {
        name: "Apr",
        total: 0,
      },
      {
        name: "May",
        total: 0,
      },
      {
        name: "Jun",
        total: 0,
      },
      {
        name: "Jul",
        total: 0,
      },
      {
        name: "Aug",
        total: 0,
      },
      {
        name: "Sep",
        total: 0,
      },
      {
        name: "Oct",
        total: 0,
      },
      {
        name: "Nov",
        total: 0,
      },
      {
        name: "Dec",
        total: 0,
      },
    ];

    const currentMonth = new Date().getMonth() + 1;

    purchases.forEach((p) => {
      if (new Date(p.createdAt).getFullYear() === new Date().getFullYear()) {
        months[new Date(p.createdAt).getMonth()].total += p.value;
      }
    });

    const updatedMonths = [
      ...months.slice(currentMonth),
      ...months.slice(0, currentMonth),
    ];

    setData(updatedMonths);
  };

  useEffect(() => {
    customizePurchases();
  }, [purchases]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
