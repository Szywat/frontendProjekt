"use client";
import '@/app/globals.css'

import { useEffect, useState } from "react";

export default function Filter({ updateFilters }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("20");
  const [priceSort, setPriceSort] = useState("");
  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const response = await fetch('https://fakestoreapi.in/api/products/category');
        const data = await response.json();
        
        setProductCategories(data.categories)
      } catch(error) {
        alert(error)
      }
    }

    fetchTypes();
  }, [])

  const applyFilters = () => {
    updateFilters({ search, category, limit, priceSort });
  };

  return (
    <div className="p-5 bg-gray-900 rounded-lg shadow-lg max-w-5xl mx-auto border border-purple-500 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-purple-400 tracking-wide">Filtruj</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="mb-3">
            <label className="block text-purple-300 mb-1">Po nazwie: </label>
            <input
              className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-lg text-white 
                         focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
              category="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="block text-purple-300 mb-1">Po kategorii: </label>
            <select 
              className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value=""></option>
              {productCategories.map((category) => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-purple-300 mb-1">Limit: </label>
            <input
              className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
              category="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="1"
              max="100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-purple-300 mb-1">Sortowanie po cenie: </label>
            <select 
              className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
              value={priceSort} 
              onChange={(e) => setPriceSort(e.target.value)}
            >
              <option value=""></option>
              <option value="asc" className="bg-gray-800">Rosnąco</option>
              <option value="desc" className="bg-gray-800">Malejąco</option>
            </select>
          </div>
        </div>
      </div>
      <button 
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 
                   transform hover:scale-105 transition-all duration-300 shadow-lg"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
}