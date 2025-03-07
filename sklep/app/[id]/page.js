'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState([])
    const [toCart, setToCart] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
          try {
            const response = await fetch(`https://fakestoreapi.in/api/products/${id}`);
            const data = await response.json();
            setProduct(data.product)
            
          } catch (error) {
            console.log(error)
          }
        }
        
        fetchProduct();
      }, [id]);

    function addToCart() {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const alreadyExists = cart.some((prod) => prod.id === product.id)
        if (!alreadyExists) {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
            });
            localStorage.setItem("cart", JSON.stringify(cart))
            setToCart(true)
        }
    }
      
    return (
        <div className="min-h-screen pt-20 pb-5">
            <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
                <div className="grid grid-cols-3 gap-8">
                    <div className="flex flex-col space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <img 
                                src={product.image} 
                                alt={product.title} 
                                className="w-full h-[300px] object-contain"
                            />
                        </div>
                        <p className="text-gray-700"><span className="font-semibold">Brand:</span> {product.brand}</p>
                        <p className="text-gray-700"><span className="font-semibold">Category:</span> {product.category}</p>
                        <p className="text-gray-700"><span className="font-semibold">Color:</span> {product.color}</p>
                        <p className="text-gray-700"><span className="font-semibold">Model:</span> {product.model}</p>
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">{product.title}</h1>
                        <p className="text-gray-700 leading-relaxed"><span className="font-semibold">Description:</span> {product.description}</p>
                    </div>

                    <div className="flex flex-col">
                        <div className="sticky top-4">
                            <p className="text-3xl font-bold text-blue-600">${product.price}</p>
                            
                                {toCart ? 
                                <button className="mt-4 w-full text-white py-3 px-6 rounded-lg bg-blue-900">
                                    W koszyku
                                </button> 
                                    : 
                                <button onClick={addToCart} className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                    Dodaj do koszyka
                                </button> 
                                }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}