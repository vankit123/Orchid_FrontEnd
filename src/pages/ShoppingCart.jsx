"use client"

import React from "react"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Heart, Tag, CreditCard, Truck } from "lucide-react"
import { useState,useEffect } from "react"
import { api } from "../components/setting/api"
import { toast } from "react-toastify"
export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const savedCart = localStorage.getItem("orchidCart")
    console.log(savedCart)
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("orchidCart", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading])

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId))
  }
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("orchidCart")
  }

const handleOrder = async () => {
  try {
    const orderDetailsList = cartItems.map((item) => ({
      orchidId: item.id, // tùy cách bạn lưu orchid
      quantity: item.quantity,
      price: item.price
    }))
    console.log("order",orderDetailsList)
    const response = await api.post("/api/orders", orderDetailsList)
    console.log("order",response)
    if (response.status === 200 || response.status === 201) {
      toast.success("Đặt hàng thành công!")
      // Optional: clear cart & redirect
      localStorage.removeItem("orchidCart")
      setCartItems([])
      // navigate("/thank-you") nếu bạn dùng react-router
    }
  } catch (error) {
    console.error("Checkout error:", error)
    alert("Có lỗi xảy ra khi thanh toán!")
  }
}

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    const rawPrice = item.price || "0" // nếu price là undefined/null thì gán thành "0"
  const price = Number.parseInt(rawPrice.toString().replace(/[^\d]/g, ""), 10)
    return sum + price * item.quantity
  }, 0)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between ">
            <a
              onClick ={()=> window.history.back()}
              className="flex items-center cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              <ArrowLeft className="w-5 h-5  text-gray-600 hover:text-gray-900" />
              <span className=" text-gray-600 hover:text-gray-900 ml-2">Tiếp tục mua sắm</span>
            </a>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Giỏ hàng ({cartItems.length})</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <a href="/home">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all">
                Khám phá sản phẩm
              </button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Sản phẩm trong giỏ</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={item.orchidUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="absolute -top-2 -right-2">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Danh mục: {item.category}</p>
                        <p className="text-lg font-bold text-green-600">{item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
              <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg mb-8 font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-green-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button onClick={handleOrder} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Thanh toán</span>
                </button>

               
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
