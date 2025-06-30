"use client"

import { useState , useEffect} from "react"
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,

} from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { api } from "../setting/api"
// Sample orders data with detailed information

export default function AdminPanel() {
    const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const [dashBoard, setDashBoard] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    orders: [],
  });
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "SHIPPING":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

    useEffect(() => {
    const fetchDashBoard = async () => {
      try {
        const res = await api.get("/api/orders/admin");
        console.log(res)
        if (res.data.status) {
          setDashBoard(res.data.result);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API thống kê:", err);
      }
    };

    fetchDashBoard();
  }, []);

const handleStatusUpdate = async (status) => {
  if (selectedOrder) {
    try {
      const response = await api.post(`/api/orders/${selectedOrder.id}/status`, {
        status: status,
      });

      if (response.data.status === true) {
        // Cập nhật local state
        const updatedOrders = dashBoard.orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, orderStatus: status }
            : order
        );

        // Cập nhật lại state dashBoard
        setDashBoard((prev) => ({
          ...prev,
          orders: updatedOrders,
        }));

        // Cập nhật selectedOrder
        setSelectedOrder((prev) => ({
          ...prev,
          orderStatus: status,
        }));
        setIsStatusUpdateOpen(false);
      }
    } catch (error) {
      console.error("Cập nhật trạng thái thất bại", error);
    }
  }
};


  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(Number.parseInt(num))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-lg border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(dashBoard.totalRevenue)} </p>
                    <p className="text-2xl font-bold text-gray-900">VNĐ</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-lg border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold text-gray-900">{dashBoard.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">+8.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-lg border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
                    <p className="text-2xl font-bold text-gray-900">{dashBoard.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-sm text-red-600 font-medium">-2.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Tất cả đơn hàng</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashBoard.orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOrderDetailOpen(true);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Mã đơn hàng :  {order.id}</p>
                        <p className="text-sm text-gray-600">{order.accountEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatNumber(order.totalAmount)} VNĐ</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}
                      >
                        {order.orderStatus === "PENDING" && "Chờ xử lý"}
                        {order.orderStatus === "COMPLETED" && "Hoàn thành"}
                        {order.orderStatus === "SHIPPING" && "Đang giao"}
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Chi tiết đơn hàng </span>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div >
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Thông tin đơn hàng</h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Mã đơn:</span> {selectedOrder.id}
                      </p>
                      <p>
                        <span className="font-medium">Ngày đặt:</span> {selectedOrder.orderDate}
                      </p>
                      <p>
                        <span className="font-medium">Trạng thái:</span>
                        <Badge
                          className={`ml-2 cursor-pointer hover:opacity-80 ${getStatusColor(selectedOrder.orderStatus)}`}
                          onClick={() => setIsStatusUpdateOpen(!isStatusUpdateOpen)}
                        >
                          {selectedOrder.orderStatus === "PENDING" && "Chờ xử lý"}
                          {selectedOrder.orderStatus === "COMPLETED" && "Hoàn thành"}
                          {selectedOrder.orderStatus === "SHIPPING" && "Đang giao"}
                        </Badge>
                        {isStatusUpdateOpen && (
                          <div className="mt-2 bg-white">
                            <Select onValueChange={handleStatusUpdate} defaultValue={selectedOrder.orderStatus}>
                              <SelectTrigger className="w-48 ">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                              <SelectContent className=" bg-white">
                                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                                <SelectItem value="SHIPPING">Đang giao</SelectItem>
                                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-4">Sản phẩm đã đặt</h4>
                  <div className="space-y-3">
                    {selectedOrder.orderDetails.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.orchidName}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{formatNumber(item.price)} VNĐ/cái</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardContent className="p-4 flex justify-between">
                  <h4 className="font-semibold mb-4">Tổng kết đơn hàng</h4>
                      <span className="text-green-600 font-bold text-2xl">{formatNumber(selectedOrder.totalAmount)} VNĐ</span>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
