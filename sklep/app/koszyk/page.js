"use client"
import { useState, useEffect } from "react";

export default function KoszykPage() {
    const [cart, setCart] = useState([]);
    const [sum, setSum] = useState(0);
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart)
    }, [])

    useEffect(() => {
        const suma = cart.reduce((acc, prod) => acc + prod.price, 0)
        setSum(suma)
    }, [cart])

    const removeFromCart = (id) => {
        const updatedCart = cart.filter((c) => c.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      };

    const coupons = {
        PROM90: 0.9,
        PROM50: 0.5,
        PROM15: 0.15, 
    };

    const applyCoupon = () => {
        if (coupons[coupon]) {
            setDiscount(coupons[coupon]);
        } else {
            setDiscount(0)
            alert("Nieprawidłowy kupon")
        }
    }

    const disc = (sum * (1 - discount)).toFixed(2)

    const payment = async () => {
        const response = await fetch(`http://127.0.0.1:5000/order/user/${localStorage.getItem('username')}`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "items": localStorage.getItem("cart"), "discount": discount})   
            }
        )
        const data = await response.json();
        console.log(data);
        

        localStorage.removeItem("cart")
        setCart([])
    }

    return (
        <div className="min-h-screen p-8 pt-20 ">
            {cart.length === 0 ? (
                <div className="text-center text-2xl text-gray-600 mt-10">
                    Koszyk jest pusty
                </div>
            ) : (
                <div className="max-w-4xl mx-auto  p-6">
                    {cart.map(prod => (
                        <div key={prod.id} className="flex items-center justify-between border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <img 
                                    src={prod.image} 
                                    alt={prod.name}
                                    className="w-24 h-24 object-cover rounded-md mr-6 shadow-sm"
                                />
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {prod.name}
                                    </p>
                                    <p className="text-xl text-blue-600 font-bold">
                                        ${prod.price}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeFromCart(prod.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mr-5 font-medium"
                            >
                                Usuń
                            </button>
                        </div>
                    ))}
                    <div className="mt-8 space-y-4">
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                placeholder="Wpisz kod kuponu" 
                                value={coupon} 
                                onChange={(e) => setCoupon(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            />
                            <button 
                                onClick={applyCoupon}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                                Wykorzystaj kupon
                            </button>
                        </div>
                        <div className="text-xl font-bold border-t pt-4 flex justify-between items-center">
                            <div>
                                Suma: <span className="text-gray-400">${sum}</span>
                                {discount > 0 && (
                                    <span className="ml-2 text-green-600">Po rabacie: ${disc}</span>
                                )}
                            </div>
                            <button onClick={payment} className="px-6 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
                                Zapłać
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}