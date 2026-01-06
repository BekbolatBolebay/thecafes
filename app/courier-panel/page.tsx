// app/courier-panel/page.tsx
"use client";

import { useApp } from "@/lib/store";

export default function CourierPanelPage() {
  const { user } = useApp();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Курьер Панелі</h1>
      {user ? (
        <div>
          <p>Сәлем, {user.name}!</p>
          <p>Бұл сіздің тапсырыстарды басқару бетіңіз.</p>
          {/* Tapсырыстар тізімі осында көрсетіледі */}
        </div>
      ) : (
        <p>Жүйеге кіріңіз...</p>
      )}
    </div>
  );
}
