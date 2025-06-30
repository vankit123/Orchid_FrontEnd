"use client";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  Package,
} from "lucide-react";
import { useState ,useEffect} from "react";
import { api } from "../setting/api";
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { toast } from 'react-toastify';
export default function ProductsManagement() {
   const [isProductModalOpen, setIsProductModalOpen] = useState(false)
       const [searchTerm, setSearchTerm] = useState("")
   
       const [orchids, setOrchids] = useState([]);
     const [isLoading, setIsLoading] = useState(true)
     const [categories, setCategories] = useState([]);
     const [isEditModalOpen, setIsEditModalOpen] = useState(false)
       const [selectedProduct, setSelectedProduct] = useState(null)
       const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState("")
  const [errors , setErrors] = useState(null)
  const [editForm, setEditForm] = useState({
    orchidName: "",
    orchidType: "",
    price: "",
    isNatural: "",
    orchidDescription: "",
    bloomingSeason:"",
    difficultyLevel:"",
    origin:"",

  })
  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

const fetchCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    console.log("Categories response:", response);
    
    // Chuyển mỗi category object thành chuỗi categoryName
    const categoryNames = response.data?.result?.map((item) => item.categoryName) || [];

    setCategories([...categoryNames]);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
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
   useEffect(() => {
    fetchOrchids();
      fetchCategories();
  }, []);

  const handleDelete = async (orchidId) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa orchid này?");
  if (!confirmDelete) return;

  try {
    const response = await api.delete(`/api/orchids/${orchidId}`);
    if (response.data.status === true) {
      // Gọi lại API hoặc cập nhật state xóa khỏi danh sách hiển thị
       fetchOrchids();
       toast.success("Xóa thành công")
    } else {
      console.error("Không thể xóa orchid");
    }
  } catch (error) {
    console.error("Lỗi khi xóa orchid:", error);
    toast.error("Xóa thất bại");
  }
};
  const handleAddClick = () => {
    setSelectedProduct(null)
    setEditForm({
      orchidName: "",
      orchidType: "",
      price: "",
      isNatural: "",
      orchidDescription: "",
      bloomingSeason: "",
      difficultyLevel: "",
      origin: "",
      orchidUrl: "",
    })
     setImageUrl(""); 
    setImageFile(null);
    setIsEditModalOpen(true)
  }
  const handleEditClick = (orchid) => {
    setSelectedProduct(orchid)
    setEditForm({
      orchidName: orchid.orchidName,
      orchidType: orchid.orchidType,
      price: orchid.price,
      isNatural: orchid.isNatural,
      orchidDescription: orchid.orchidDescription,
      bloomingSeason: orchid.bloomingSeason,
      difficultyLevel: orchid.difficultyLevel,
      origin: orchid.origin,
      orchidUrl: orchid.orchidUrl,
    })
     setImageUrl(orchid.orchidUrl || ""); // dùng ảnh cũ
    setImageFile(null);
    setIsEditModalOpen(true)
  }

const handleFormChange = (field, value) => {
  const actualValue =
    field === "isNatural" ? value === "true" : value;
  setEditForm((prev) => ({ ...prev, [field]: actualValue }));
};

const handleSaveProduct = async () => {
  try {
        let base64Image = editForm.orchidUrl;

    if (imageFile) {
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      base64Image = await toBase64(imageFile);
    }

    const payload = {
      orchidName: editForm.orchidName || selectedProduct.orchidName,
      orchidType: editForm.orchidType || selectedProduct.orchidType,
      price: editForm.price ?? selectedProduct.price,
      isNatural: editForm.isNatural ?? selectedProduct.isNatural,
      orchidDescription: editForm.orchidDescription || selectedProduct.orchidDescription,
      bloomingSeason: editForm.bloomingSeason || selectedProduct.bloomingSeason,
      difficultyLevel: editForm.difficultyLevel || selectedProduct.difficultyLevel,
      origin: editForm.origin || selectedProduct.origin,
      orchidUrl: base64Image,
    };

    console.log("Payload gửi lên:", payload); 
        if (selectedProduct) {
      // Update
      await api.put(`/api/orchids/${selectedProduct.id}`, payload);
      toast.success("Cập nhật sản phẩm thành công");
    } else {
      // Create
      await api.post(`/api/orchids`, payload);
      toast.success("Thêm sản phẩm thành công");
    }

    setIsEditModalOpen(false);
    fetchOrchids();
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
  }
};
const filteredOrchids = orchids.filter((item) => {
  const matchesSearch = item.orchidName.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesSearch;
});

 const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900 ml-4">
          Quản lý sản phẩm
        </h2>
        <button  onClick={handleAddClick}  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 !rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Thể loại
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrchids.map((orchid) => (
                <tr key={orchid.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={orchid.orchidUrl || "/placeholder.svg"}
                        alt={orchid.orchidName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-900">
                        {orchid.orchidName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {orchid.orchidType}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {formatPrice(orchid.price)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        orchid.status
                      )}`}
                    >
                      {orchid.isNatural === true
                        ? "Tự nhiên"
                        : "Nhân tạo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(orchid)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                      <button  onClick={() => handleDelete(orchid.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>{selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</span>
            </DialogTitle>
          </DialogHeader>

       
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="orchidName">Tên sản phẩm</Label>
                  <Input
                    id="orchidName"
                    value={editForm?.orchidName}
                    onChange={(e) => handleFormChange("orchidName", e.target.value)}
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

<div className="space-y-2">
  <Label htmlFor="category">Danh mục</Label>
  <Select
    value={editForm.orchidType}
    onValueChange={(value) => handleFormChange("orchidType", value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Chọn danh mục" />
    </SelectTrigger>
    <SelectContent className="bg-white">
      {categories.map((name) => (
        <SelectItem key={name} value={name}>
          {name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VNĐ)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editForm.price}
                    onChange={(e) => handleFormChange("price", e.target.value)}
                    placeholder="Nhập giá sản phẩm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Thể loại</Label>
                  <Select value={editForm.isNatural?.toString()} onValueChange={(value) => handleFormChange("isNatural", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thể loại" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="true">Tự nhiên</SelectItem>
                      <SelectItem value="false">Nhân tạo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloomingSeason">Thời gian ra hoa</Label>
                  <Input
                    id="bloomingSeason"
                    type="text"
                    value={editForm.bloomingSeason}
                    onChange={(e) => handleFormChange("bloomingSeason", e.target.value)}
                    placeholder="Nhập thời gian ra hoa"
                  />
                </div>               
                 <div className="space-y-2">
                  <Label htmlFor="difficultyLevel">Độ khó chăm sóc</Label>
                  <Input
                    id="difficultyLevel"
                    type="text"
                    value={editForm.difficultyLevel}
                    onChange={(e) => handleFormChange("difficultyLevel", e.target.value)}
                    placeholder="Nhập độ khó chăm sóc"
                  />
                </div>                
                <div className="space-y-2">
                  <Label htmlFor="origin">Xuất sứ</Label>
                  <Input
                    id="origin"
                    type="text"
                    value={editForm.origin}
                    onChange={(e) => handleFormChange("origin", e.target.value)}
                    placeholder="Nhập nơi xuất sứ"
                  />
                </div>
<div className="space-y-2">
  <Label htmlFor="image">Ảnh sản phẩm</Label>
  <input
    id="image"
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file); // chỉ lưu file vào state
        setImageUrl(URL.createObjectURL(file)); // hiện preview
      } else {
        setImageFile(null);
        setImageUrl("");
      }
    }}
    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
  />
{(imageUrl || editForm.orchidUrl) && (
  <img
    src={imageUrl || editForm.orchidUrl}
    alt="Xem trước ảnh"
    className="w-32 h-32 object-cover rounded-lg border"
  />
)}


</div>

              </div>

              <div>
                <Label htmlFor="orchidDescription">Mô tả</Label>
                <Textarea 
                  id="orchidDescription"
                  value={editForm.orchidDescription}
                  onChange={(e) => handleFormChange("orchidDescription", e.target.value)}
                  placeholder="Nhập mô tả sản phẩm"
                  rows={3}
                />
              </div>

              

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Hủy
                </Button>
                
                <Button onClick={handleSaveProduct} className="bg-green-600 hover:bg-green-700">
                 {selectedProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
                </Button>
              </div>
            </div>
          
        </DialogContent>
      </Dialog>

    </div>
  );
}
