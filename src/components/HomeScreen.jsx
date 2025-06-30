import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container';
import { Search, Star,ShoppingBag, Flower, Package,ShoppingCart ,User} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { api } from "../components/setting/api"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
export default function HomeScreen() {
    const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cartBounce, setCartBounce] = React.useState(false)
  const [isLoading, setIsLoading] = useState(true)
    const [orchids, setOrchids] = useState([]);
      const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
    const [categories, setCategories] = useState(["all"]);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

      const handleAuthAction = () => {
    if (token) {
      // Logout
      localStorage.removeItem("token")
      navigate("/login")
      // Add any additional logout logic here
    } else {
      // Login - you can redirect to login page or open login modal
      navigate("/login")
    }
  }
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-blue-100 text-blue-800"
      case "SHIPPING":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  
useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        const res = await api.get("/api/orders");
        console.log("order",res)
        if (res.data.status === true && res.data.result) {
          setOrders(res.data.result);
        } else {
          setError("Không thể tải danh sách đơn hàng.");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Đã xảy ra lỗi khi tải đơn hàng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

     const fetchOrchids = async () => {
    try {
      const response = await api.get("/api/orchids");
      console.log(response)
      setOrchids(response.data?.result);
    } catch (error) {
      console.error("Error fetching orchids:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
const fetchCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    console.log("Categories response:", response);
    
    // Chuyển mỗi category object thành chuỗi categoryName
    const categoryNames = response.data?.result?.map((item) => item.categoryName) || [];

    setCategories(["all", ...categoryNames]);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

  useEffect(() => {
    fetchOrchids();
    fetchCategories();   
  }, []);


const filteredOrchids = orchids.filter((item) => {
  const matchesSearch = item.orchidName.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory === "all" || item.orchidType === selectedCategory;
  return matchesSearch && matchesCategory;
});
const cartItems = JSON.parse(localStorage.getItem('orchidCart')) || [];
 const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách orchid...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Orchid FloSto
              </div>
              <p className="text-gray-600 mt-1">Khám phá những loài lan đẹp nhất</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm orchid..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent  backdrop-blur-sm"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                {categories.map((category, index) => (
                 <option key={category + index} value={category}>
                    {category === "all" ? "Tất cả danh mục" : category}
                  </option>
               ))}
              </select>
            <div className="flex items-center space-x-4 ml-2">
              {/* Orders Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center space-x-2 !rounded-xl border border-gray-300 bg-white py-2 px-2">
                    <Package className="w-4 h-4" />
                    <span>Đơn hàng</span>
                  </button>
                </DialogTrigger>
<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
  <DialogHeader>
    <DialogTitle className="flex items-center space-x-2">
      <Package className="w-5 h-5" />
      <span>Đơn hàng của tôi</span>
    </DialogTitle>
  </DialogHeader>

  {!token ? (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
      <p className="text-lg text-gray-700">Vui lòng đăng nhập để xem đơn hàng</p>
      <button
        onClick={() => (window.location.href = "/login")}
        className="px-4 py-2 bg- text-white rounded bg-gradient-to-r from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 transition"
      >
        Quay lại trang đăng nhập
      </button>
    </div>
  ) : (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="border">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold">Đơn hàng #{order.id}</h4>
                <p className="text-sm text-gray-600">Ngày đặt: {order.orderDate}</p>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(order.orderStatus)}>{order.orderStatus}</Badge>
                <p className="font-semibold text-green-600 mt-1">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Sản phẩm:</h4>
              {order.orderDetails?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.orchidName} x{item.quantity}
                  </span>
                  <span className="text-green-600">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )}
</DialogContent>
              </Dialog>


            </div>
              <a href="/cart" className="relative">
                <div
                  className={`p-2 ml-4 rounded-full bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-500 transition-all duration-200 ${cartBounce ? "animate-spin" : ""}`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </div>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </a>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='flex items-center space-x-2 !rounded-xl border border-gray-300 bg-white py-2 px-2'>
                    <User className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className='cursor-pointer' onClick={handleAuthAction}>{token ? "Đăng xuất" : "Đăng nhập"}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Hiển thị <span className="font-semibold text-green-600">{filteredOrchids.length}</span> kết quả
            {searchTerm && (
              <span>
                {" "}
                cho "<span className="font-semibold">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Orchid Grid */}


        <div
          className={`grid gap-6  md:grid-cols-3 lg:grid-cols-3" `}
        >
          {filteredOrchids.map((item) => (
            <div
              key={item.id}

              className="group relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={item.orchidUrl || "/placeholder.svg"}
                  alt={item.orchidName}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {item.isNatural ? (
                    <span className="px-3 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                      Tự nhiên
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                      Công nghiệp
                    </span>
                  )}
                </div>




                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <span className="text-sm text-green-600 font-medium">{item.category}</span>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2 group-hover:text-green-600 transition-colors">
                  {item.orchidName}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">124 đánh giá</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">{formatPrice(item.price)}</span>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Flower className="w-4 h-4" />
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/detail/${item.id}`}>
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 text-white font-semibold py-3 px-4  transition-all transform group-hover:scale-[1.02]  items-center justify-center space-x-2">
                    <span >Xem chi tiết</span>
                  </button>
                </Link>
                
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrchids.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-gray-600 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
