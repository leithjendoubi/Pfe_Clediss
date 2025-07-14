import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProducteurVendeur = () => {
  // State for all data categories
  const [data, setData] = useState({
    pendingProducers: [],
    acceptedProducers: [],
    pendingSellers: [],
    acceptedSellers: [],
    allProducers: [],
    allSellers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  // API endpoints configuration
  const API_ENDPOINTS = {
    producers: {
      pending: 'http://localhost:4000/api/producteur/demands',
      accepted: 'http://localhost:4000/api/producteur/demandsaccepted',
      all: 'http://localhost:4000/api/producteur/getall'
    },
    sellers: {
      pending: 'http://localhost:4000/api/vendeur/demands',
      accepted: 'http://localhost:4000/api/vendeur/demandsaccepted',
      all: 'http://localhost:4000/api/vendeur/getall'
    }
  };

  // Fetch data with error handling
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        pendingProducers,
        acceptedProducers,
        pendingSellers,
        acceptedSellers,
        allProducers,
        allSellers
      ] = await Promise.all([
        axios.get(API_ENDPOINTS.producers.pending),
        axios.get(API_ENDPOINTS.producers.accepted),
        axios.get(API_ENDPOINTS.sellers.pending),
        axios.get(API_ENDPOINTS.sellers.accepted),
        axios.get(API_ENDPOINTS.producers.all),
        axios.get(API_ENDPOINTS.sellers.all)
      ]);

      setData({
        pendingProducers: pendingProducers.data,
        acceptedProducers: acceptedProducers.data,
        pendingSellers: pendingSellers.data,
        acceptedSellers: acceptedSellers.data,
        allProducers: allProducers.data,
        allSellers: allSellers.data
      });
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
      setError('فشل تحميل البيانات. الرجاء المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  // Action handlers
  const handleAccept = async (type, id) => {
    try {
      const endpoint = type === 'producer' 
        ? `http://localhost:4000/api/producteur/${id}/accept-demande`
        : `http://localhost:4000/api/vendeur/accept/${id}`;
      
      await axios.put(endpoint);
      await fetchData(); // Refresh all data
    } catch (err) {
      setError(`فشل قبول طلب ${type === 'producer' ? 'المنتج' : 'البائع'}`);
    }
  };

  const handleRefuse = async (type, id) => {
    try {
      const endpoint = type === 'producer' 
        ? `http://localhost:4000/api/producteur/${id}/refuse-demande`
        : `http://localhost:4000/api/vendeur/refuse/${id}`;
      
      await axios.put(endpoint);
      await fetchData(); // Refresh all data
    } catch (err) {
      setError(`فشل رفض طلب ${type === 'producer' ? 'المنتج' : 'البائع'}`);
    }
  };

  const handleStop = async (type, id) => {
    try {
      await axios.put(`http://localhost:4000/api/${type}/${id}/stop`);
      await fetchData(); // Refresh all data
    } catch (err) {
      setError(`فشل إيقاف ${type === 'producer' ? 'المنتج' : 'البائع'}`);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`هل أنت متأكد من حذف ${type === 'producer' ? 'هذا المنتج؟' : 'هذا البائع؟'}`)) {
      try {
        await axios.delete(`http://localhost:4000/api/${type}/${id}`);
        await fetchData(); // Refresh all data
      } catch (err) {
        setError(`فشل حذف ${type === 'producer' ? 'المنتج' : 'البائع'}`);
      }
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Table component
  const DataTable = ({ items, type, showActions = true }) => {
    const isProducer = type === 'producer';
    const isAllView = !showActions;

    return (
      <div className="overflow-x-auto rounded-lg border border-blue-100 shadow-sm mb-8" dir="rtl">
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">الاسم</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">الهاتف</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">العنوان</th>
              {!isAllView && (
                <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">مكان التخزين</th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">الفئة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">النوع</th>
              {!isAllView && (
                <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">الحالة</th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">المستندات</th>
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">الإجراءات</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-200">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.nometprenomlegal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {item.numeroPhone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {item.adressProfessionnel}
                </td>
                {!isAllView && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.adressDeStockage}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {item.categorieProduitMarche?.join(', ') || 'غير متوفر'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {isProducer ? item.typeDesProducteurs || 'غير متوفر' : item.typeDesVendeurs || 'غير متوفر'}
                </td>
                {!isAllView && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.statutdemande === 'accepted' ? 'bg-green-100 text-green-800' : 
                        item.statutdemande === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {item.statutdemande === 'accepted' ? 'مقبول' : 
                       item.statutdemande === 'pending' ? 'قيد الانتظار' : 'مقبول'}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {item.documents ? (
                    <div className="flex flex-col space-y-1">
                      {Object.values(item.documents).map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {doc.title}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">لا توجد مستندات</span>
                  )}
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {item.statutdemande === 'accepted' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStop(type, item._id)}
                          className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition-colors"
                        >
                          إيقاف
                        </button>
                        <button
                          onClick={() => handleDelete(type, item._id)}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAccept(type, item._id)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                        >
                          قبول
                        </button>
                        <button
                          onClick={() => handleRefuse(type, item._id)}
                          className="px-3 py-1 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600 transition-colors"
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-blue-800">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">خطأ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800">إدارة المنتجين والبائعين</h1>
          <p className="text-blue-600 mt-2">لوحة تحكم شاملة للإدارة</p>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              الطلبات المعلقة
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'accepted' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              الطلبات المقبولة
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              جميع السجلات
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'pending' && (
          <>
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-800">المنتجون المعلقون</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {data.pendingProducers.length} معلقة
                </span>
              </div>
              {data.pendingProducers.length > 0 ? (
                <DataTable items={data.pendingProducers} type="producer" />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 text-center">
                  <p className="text-gray-500">لا توجد طلبات منتجين معلقة.</p>
                </div>
              )}
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-800">البائعون المعلقون</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {data.pendingSellers.length} معلقة
                </span>
              </div>
              {data.pendingSellers.length > 0 ? (
                <DataTable items={data.pendingSellers} type="seller" />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 text-center">
                  <p className="text-gray-500">لا توجد طلبات بائعين معلقة.</p>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'accepted' && (
          <>
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-800">المنتجون النشطون</h2>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {data.acceptedProducers.length} نشط
                </span>
              </div>
              {data.acceptedProducers.length > 0 ? (
                <DataTable items={data.acceptedProducers} type="producer" />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 text-center">
                  <p className="text-gray-500">لا توجد منتجين نشطين.</p>
                </div>
              )}
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-800">البائعون النشطون</h2>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {data.acceptedSellers.length} نشط
                </span>
              </div>
              {data.acceptedSellers.length > 0 ? (
                <DataTable items={data.acceptedSellers} type="seller" />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 text-center">
                  <p className="text-gray-500">لا توجد بائعين نشطين.</p>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'all' && (
          <>
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-800">جميع المنتجين</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {data.allProducers.length} إجمالي
                </span>
              </div>
              {data.allProducers.length > 0 ? (
                <DataTable items={data.allProducers} type="producer" showActions={false} />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 text-center">
                  <p className="text-gray-500">لا توجد منتجين.</p>
                </div>
              )}
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-800">جميع البائعين</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {data.allSellers.length} إجمالي
                </span>
              </div>
              {data.allSellers.length > 0 ? (
                <DataTable items={data.allSellers} type="seller" showActions={false} />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 text-center">
                  <p className="text-gray-500">لا توجد بائعين.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ProducteurVendeur;