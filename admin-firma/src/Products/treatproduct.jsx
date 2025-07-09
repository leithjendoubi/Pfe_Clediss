import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TreatProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/product/');
        setProducts(Array.isArray(response.data.products) ? response.data.products : []);
      } catch {
        toast.error('فشل في تحميل المنتجات');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = (productId) => async () => {
    setIsDeleting(prev => ({ ...prev, [productId]: true }));
    try {
      await axios.delete(`http://localhost:4000/api/product/delete/${productId}`);
      setProducts(prev => prev.filter(product => product._id !== productId));
      toast.success('تم حذف المنتج بنجاح!');
    } catch {
      toast.error('فشل في حذف المنتج');
    } finally {
      setIsDeleting(prev => ({ ...prev, [productId]: false }));
    }
  };

  const tableHeaderStyle = "px-4 py-3 text-right text-sm font-medium text-blue-900 bg-blue-100";
  const tableCellStyle = "px-4 py-2 text-right text-sm font-medium text-gray-700 border-t border-blue-200";
  const buttonStyle = "px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors";

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6" style={{ fontFamily: "'Amiri', serif" }}>
            إدارة المنتجات
          </h1>
          {isLoading ? (
            <p className="text-center text-gray-600">جارٍ تحميل المنتجات...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">لا توجد منتجات متاحة</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200">
                <thead>
                  <tr>
                    <th className={tableHeaderStyle}>معرف المنتج</th>
                    <th className={tableHeaderStyle}>الاسم</th>
                    <th className={tableHeaderStyle}>الوصف</th>
                    <th className={tableHeaderStyle}>السعر</th>
                    <th className={tableHeaderStyle}>الصورة</th>
                    <th className={tableHeaderStyle}>الفئة</th>
                    <th className={tableHeaderStyle}>الفئة الفرعية</th>
                    <th className={tableHeaderStyle}>الأحجام</th>
                    <th className={tableHeaderStyle}>الوزن الصافي</th>
                    <th className={tableHeaderStyle}>الوزن المتوفر</th>
                    <th className={tableHeaderStyle}>معرف المستخدم</th>
                    <th className={tableHeaderStyle}>معرف السوق</th>
                    <th className={tableHeaderStyle}>التاريخ</th>
                    <th className={tableHeaderStyle}>الأكثر مبيعاً</th>
                    <th className={tableHeaderStyle}>إجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-200">
                  {products.map(product => (
                    <tr key={product._id}>
                      <td className={tableCellStyle}>{product._id}</td>
                      <td className={tableCellStyle}>{product.name}</td>
                      <td className={tableCellStyle}>{product.description}</td>
                      <td className={tableCellStyle}>{product.price} د.ت</td>
                      <td className={tableCellStyle}>
                        {product.image && product.image.length > 0 ? (
                          <img
                            src={product.image[0].url}
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded-md"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/64?text=غير+متوفر')}
                          />
                        ) : (
                          <span className="text-gray-500">لا توجد صورة</span>
                        )}
                      </td>
                      <td className={tableCellStyle}>{product.category}</td>
                      <td className={tableCellStyle}>{product.subCategory}</td>
                      <td className={tableCellStyle}>{product.sizes.join(', ') || 'غير متوفر'}</td>
                      <td className={tableCellStyle}>{product.poidnet.join(', ') || 'غير متوفر'}</td>
                      <td className={tableCellStyle}>{product.availablepoids.join(', ') || 'غير متوفر'}</td>
                      <td className={tableCellStyle}>{product.userId}</td>
                      <td className={tableCellStyle}>{product.marcheID}</td>
                      <td className={tableCellStyle}>
                        {new Date(product.date).toLocaleString('ar-TN')}
                      </td>
                      <td className={tableCellStyle}>{product.bestseller ? 'نعم' : 'لا'}</td>
                      <td className={tableCellStyle}>
                        <button
                          onClick={handleDelete(product._id)}
                          disabled={isDeleting[product._id]}
                          className={`${buttonStyle} ${isDeleting[product._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isDeleting[product._id] ? 'جارٍ الحذف...' : 'حذف'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatProducts;