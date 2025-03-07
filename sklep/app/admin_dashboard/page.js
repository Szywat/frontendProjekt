"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [orderList, setOrderList] = useState([]);


  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/");
    }
    getOrders();
  }, [router]);

  const getOrders = async () => {
    const res = await fetch(`http://127.0.0.1:5000/order/orders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const data = await res.json()
    setOrderList(data || []);
    console.log(data);
  }
  
  const removeOrder = async (index) => {
    const res = await fetch("http://127.0.0.1:5000/order/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    })

    if (res.ok) {
      setOrderList((prevOrders) => prevOrders.filter((_, i) => i !== index));
    }
  }

const calculateOrderTotal = (items, discount) => {
  const subtotal = JSON.parse(items)
    .reduce((sum, item) => sum + item.price, 0);
  
  if (discount) {
    return (subtotal * (1 - discount)).toFixed(2);
  }
  return subtotal.toFixed(2);
}


  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 mt-12">Panel Administratora</h1>    
        <h2 className="text-2xl font-semibold text-gray-300 mt-8 mb-6">Lista zamówień:</h2>
        
        <div className="grid gap-8">
          {orderList.map((order, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-xl p-6 border-2 border-blue-500">
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold text-blue-400">Zamówienie użytkownika: <span className="text-white">{order.username}</span></h3>  
              </div>
              <div className="grid gap-4">
                {JSON.parse(order.items).map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded transition-all duration-200">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-16 h-16 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-200">{item.title}</p>
                      <p className="text-emerald-400 font-bold">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xl text-emerald-400 font-bold">
                Suma zamówienia: ${calculateOrderTotal(order.items, order.discount)} 
              </div>
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => removeOrder(index)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg"
                >
                  Skompletuj zamówienie
                </button>
                <button 
                  onClick={() => removeOrder(index)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-lg"
                >
                  Usuń zamówienie
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}