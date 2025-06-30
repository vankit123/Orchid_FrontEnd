import React from 'react';
import { useParams } from 'react-router';
import { api } from '../components/setting/api'
import { ArrowLeft, Flower, Shield, Award, Star, MapPin ,ShoppingBag} from "lucide-react"
import { useState ,useEffect } from 'react';
import { toast } from 'react-toastify';
export default function DetailOrchid() {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [cartBounce, setCartBounce] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);
    const [orchid, setOrchid] = useState({});
      const params = useParams();
      const orchidId = params.id;
    console.log(orchidId);

      useEffect(() => {
    const fetchOrchidById = async () => {
      try {
        const response = await api.get(`/api/orchids/${orchidId}`);
        console.log("Orchid data:", response.data);
        setOrchid(response.data.result); // Lấy từ `ApiResponse.result`
      } catch (err) {
        console.error("Error fetching orchid:", err);
        setError("Không thể tải dữ liệu lan.");
      } finally {
        setLoading(false);
      }
    };

    if (orchidId) {
      fetchOrchidById();
    }
  }, [orchidId]);

  const handleBuyNow = async () => {
  try {
    const orderDetailsList = [
      {
        orchidId: orchid.id,
        quantity: 1,
        price: orchid.price,
      },
    ];

    const response = await api.post("/api/orders", orderDetailsList);
    console.log("Buy Now Order", response);

    if (response.status === 200 || response.status === 201) {
        toast.success("Đặt hàng thành công")
    }
  } catch (error) {
    console.error("Buy Now error:", error);
    alert("Có lỗi xảy ra khi mua hàng!");
  }
};

const handleAddToCart = () => {
  const savedCart = JSON.parse(localStorage.getItem("orchidCart") || "[]")
  console.log(savedCart)
  const newItem = {
    id: orchid.id,
    name: orchid.orchidName,
    price: orchid.price,
    image: orchid.image,
    quantity: 1,
    category: orchid.orchidType,
    orchidUrl : orchid.orchidUrl,
    addedAt: new Date().toISOString(),
  }

  const existingIndex = savedCart.findIndex((item) => item.id === newItem.id)

  if (existingIndex !== -1) {
    savedCart[existingIndex].quantity += 1
  } else {
    savedCart.push(newItem)
  }

  // Save back
  localStorage.setItem("orchidCart", JSON.stringify(savedCart))

  // Nếu bạn có setCartItems tại đây cũng dùng savedCart:
  setCartItems(savedCart)

  // Optional: Hiển thị animation hoặc thông báo
  setCartBounce(true)
  setTimeout(() => setCartBounce(false), 2000)
}
 const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ"
  }
  return (
   <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <div>Trang chủ</div>
            </button>
              <a href="/cart" className="relative">
                <div
                  className={`p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-500 transition-all duration-200 ${cartBounce ? "animate-spin" : ""}`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </div>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-6 shadow-xl">
                <div className="absolute top-6 right-6 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Flower className="w-4 h-4" />
                    <span>Premium</span>
                  </div>
                </div>
                <img
                  src={orchid.orchidUrl || "/placeholder.svg"}
                  alt={orchid.orchidName}
                  className="w-full h-96 object-cover rounded-2xl"
                />
              </div>
            </div>


                        
            {/* Action Buttons */}
                       <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Đang thêm...</span>
                  </>
                ) : (
                  <span>Thêm vào giỏ hàng</span>
                )}
              </button>
              <button onClick={handleBuyNow} className="px-6 py-4 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg">
                Mua ngay
              </button>
            </div>

            {/* Guarantee */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bảo hành chất lượng</p>
                  <p className="text-sm text-gray-600">Đổi trả trong 30 ngày nếu không hài lòng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="#" className="hover:text-green-600 transition-colors">
                Trang chủ
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">{orchid.orchidName}</span>
            </nav>

            {/* Title and Category */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium">
                  {orchid.category}
                </span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{orchid.origin}</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {orchid.orchidName}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-600">{formatPrice(orchid.price)}</span>
            </div>

            {/* Description */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h3>
              <p className="text-gray-700 leading-relaxed">{orchid.orchidDescription}</p>
            </div>

            {/* Product Details */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chi tiết</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Thời gian ra hoa</p>
                  <p className="font-medium text-gray-900">{orchid.bloomingSeason}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Độ khó chăm sóc</p>
                  <p className="font-medium text-gray-900">{orchid.difficultyLevel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Xuất xứ</p>
                  <p className="font-medium text-gray-900">{orchid.origin}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Loại</p>
                  <p className="font-medium text-gray-900">{orchid.orchidType}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}