"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import "@/app/globals.css"
import Filter from "./components/Filter";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchList() {
      try {
        const limit = searchParams.get("limit") || "150";
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const priceSort = searchParams.get("priceSort") || "";

        const response = await fetch("https://fakestoreapi.in/api/products?limit=150");
        if (!response.ok) {
          throw new Error("Could not fetch list");
        };
        const data = await response.json();
        let detailedData = data.products

        if (search) {
          detailedData = detailedData.filter((prod) => 
          prod.title.toLowerCase().includes(search.toLowerCase()));
        }

        if (category) {
          detailedData = detailedData.filter((prod) => 
          prod.category.toLowerCase() === category.toLowerCase())
        }

        if (priceSort === 'asc') {
          detailedData = detailedData.sort((a, b) => a.price - b.price);
        } else if (priceSort === 'desc') {
          detailedData = detailedData.sort((a, b) => b.price - a.price);
        }

          detailedData = detailedData.slice(0, limit);
          setProducts(detailedData)
      } catch(error) {
        setErrorMessage(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchList();
  }, [searchParams]);

  const updateFilters = (filters) => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.limit) params.set("limit", filters.limit);
    if (filters.limit) params.set("priceSort", filters.priceSort)

    router.push(`/?${params.toString()}`);
  };

  if (errorMessage) {
    return (
      <div className="text-center p-8">
      <h2 className="text-red-500 text-2xl font-bold mb-4">ERROR!</h2>
      <p className="text-white font-semibold">{errorMessage.toString()}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Lista Produktów</h1>
      {isLoading ? (
        <p className="text-center text-gray-400">Ładowanie...</p>
      ) : (
        <>
        <Filter updateFilters={updateFilters}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Link href={`/${product.id}`} className="block">
                <div className="relative pt-[100%]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 truncate text-white">{product.title}</h2>
                  <p className="text-blue-400 font-bold">${product.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}