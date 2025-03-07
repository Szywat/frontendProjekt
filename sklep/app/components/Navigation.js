"use client"
import { useState, useLayoutEffect } from "react";
import Link from "next/link";
import "@/app/globals.css";

export default function Navigation() {
  const [username, setUsername] = useState(null);
  const [adminDashboard, setAdminDashboard] = useState(false);

  useLayoutEffect(() => {
    setUsername(localStorage.getItem("username"));
    if (localStorage.getItem("role") === "admin") {
      setAdminDashboard(true);
      
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUsername(null);
    window.location.reload();
  };

  return (
    <nav className="bg-black shadow-md fixed w-full top-0 z-50">
      <ul className="flex items-center justify-between p-4">
        <li>
          <Link href="/">
            <span className="font-bold">FakeStore<strong className="text-pink-500">API</strong></span>
          </Link>
        </li>
        <div className="flex space-x-8">
          {adminDashboard ? (          
          <li>
          <Link href="/admin_dashboard" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-bold">
          Panel Administratora
          </Link>
          </li>)
          : null}

          <li>
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-bold">
              Strona główna
            </Link>
          </li>
          <li>
            <Link href="/koszyk" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-bold">
              Koszyk
            </Link>
          </li>
          <li>
            {username ? (
              <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-bold">
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-bold">
                Login
              </Link>
            )}
          </li>
        </div>
      </ul>
    </nav>
  );
}