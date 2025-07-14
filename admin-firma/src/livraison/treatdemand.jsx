import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import defaultAvatar from '../assets/default-avatar.png'; // تأكد من وجود هذا الملف في مشروعك

const API_BASE_URL = 'http://localhost:4000';

const LivreurManagement = () => {
  const [demands, setDemands] = useState([]);
  const [registeredLivreurs, setRegisteredLivreurs] = useState([]);
  const [loading, setLoading] = useState({
    demands: true,
    livreurs: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [acceptModal, setAcceptModal] = useState(false);
  const [currentLivreur, setCurrentLivreur] = useState(null);
  const [formData, setFormData] = useState({
    citeprincipale: '',
    VolumeDisponibleParDefaut: '',
    poidsMaximale: '',
  });

  // جلب تفاصيل المستخدم لساعي معين
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/userdata`, { userId });
      if (response.status !== 200 || !response.data.success || !response.data.userData) {
        throw new Error('استجابة بيانات المستخدم غير صالحة');
      }
      return response.data.userData;
    } catch (error) {
      console.error('خطأ في جلب تفاصيل المستخدم:', error);
      return {
        name: 'مستخدم غير معروف',
        email: 'غير متاح',
        image: defaultAvatar,
      };
    }
  };

  // جلب جميع طلبات الانتظار
  const fetchDemands = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/livreur/demande`);
      if (response.status === 200 && response.data.success) {
        // جلب تفاصيل المستخدم لكل طلب
        const demandsWithDetails = await Promise.all(
          response.data.data.map(async (demand) => {
            const userDetail = await fetchUserDetails(demand.userId);
            return { ...demand, userDetail };
          })
        );
        setDemands(demandsWithDetails);
      } else {
        throw new Error('استجابة الطلبات غير صالحة');
      }
      setLoading((prev) => ({ ...prev, demands: false }));
    } catch (error) {
      toast.error('فشل في جلب الطلبات');
      console.error('خطأ في جلب الطلبات:', error);
      setLoading((prev) => ({ ...prev, demands: false }));
    }
  };

  // جلب جميع السعاة المسجلين مع تفاصيلهم
  const fetchRegisteredLivreurs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/livreur/getall`);
      if (response.status !== 200 || !response.data.success || !Array.isArray(response.data.data)) {
        throw new Error('استجابة السعاة غير صالحة');
      }
      const livreurs = response.data.data;

      // جلب تفاصيل المستخدم لكل ساعي
      const livreursWithDetails = await Promise.all(
        livreurs.map(async (livreur) => {
          const userDetail = await fetchUserDetails(livreur.userId);
          return { ...livreur, userDetail };
        })
      );

      setRegisteredLivreurs(livreursWithDetails);
      setLoading((prev) => ({ ...prev, livreurs: false }));
    } catch (error) {
      toast.error('فشل في جلب السعاة المسجلين');
      console.error('خطأ في جلب السعاة:', error);
      setLoading((prev) => ({ ...prev, livreurs: false }));
    }
  };

  // فتح نافذة قبول الساعي
  const openAcceptModal = (livreur) => {
    setCurrentLivreur(livreur);
    setFormData({
      citeprincipale: '',
      VolumeDisponibleParDefaut: '',
      poidsMaximale: '',
    });
    setAcceptModal(true);
  };

  // التعامل مع تغييرات إدخال النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // قبول الطلب
  const handleAccept = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/livreur/accept`, {
        ...formData,
        livreurId: currentLivreur._id,
      });
      toast.success('تم قبول الطلب بنجاح');
      setAcceptModal(false);
      fetchDemands(); // تحديث قائمة الطلبات
      fetchRegisteredLivreurs(); // تحديث قائمة السعاة المسجلين
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في قبول الطلب');
      console.error('خطأ في قبول الطلب:', error);
    }
  };

  // رفض الطلب
  const handleReject = async (livreurId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/livreur/reject`, { livreurId });
      toast.success('تم رفض الطلب بنجاح');
      fetchDemands(); // تحديث قائمة الطلبات
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في رفض الطلب');
      console.error('خطأ في رفض الطلب:', error);
    }
  };

  useEffect(() => {
    fetchDemands();
    fetchRegisteredLivreurs();
  }, []);

  // تصفية السعاة بناءً على مصطلح البحث
  const filteredLivreurs = registeredLivreurs.filter((livreur) => {
    const searchLower = searchTerm.toLowerCase();
    const user = livreur.userDetail || {};

    return (
      (livreur._id?.toLowerCase()?.includes(searchLower) || false) ||
      (livreur.userId?.toLowerCase()?.includes(searchLower) || false) ||
      (user.name?.toLowerCase()?.includes(searchLower) || false) ||
      (user.email?.toLowerCase()?.includes(searchLower) || false) ||
      (livreur.citeprincipale?.toLowerCase()?.includes(searchLower) || false) ||
      (livreur.statutDemande?.toLowerCase()?.includes(searchLower) || false)
    );
  });

  // عرض المستندات
  const viewDocuments = (documents) => {
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return 'لا توجد مستندات';
    }

    return (
      <div className="space-y-2">
        {documents.map((doc, index) => (
          <a
            key={index}
            href={doc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 block"
          >
            عرض المستند {index + 1}
          </a>
        ))}
      </div>
    );
  };

  // حالة التحميل
  if (loading.demands || loading.livreurs) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* قسم الطلبات */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">الطلبات المعلقة</h1>
        {demands.length === 0 ? (
          <p className="text-gray-600">لا توجد طلبات معلقة</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                  >
                    معلومات المستخدم
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                  >
                    الاتصال
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                  >
                    المستندات
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                  >
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {demands.map((demand) => (
                  <tr key={demand._id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={demand.userDetail?.image || defaultAvatar}
                            alt={demand.userDetail?.name || 'مستخدم'}
                            onError={(e) => {
                              e.target.src = defaultAvatar;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {demand.userDetail?.name || 'مستخدم غير معروف'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {demand.userDetail?.email || 'غير متاح'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{demand.telephone || 'غير متاح'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {viewDocuments(demand.documents)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openAcceptModal(demand)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => handleReject(demand._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        رفض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* قسم السعاة المسجلين */}
      <div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">السعاة المسجلون</h1>
          <p className="text-gray-600">عرض وإدارة جميع شركاء التوصيل المسجلين</p>
        </div>

        {/* شريط البحث */}
        <div className="mb-6">
          <div className="relative rounded-md shadow-sm max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3 border"
              placeholder="ابحث بالاسم، البريد الإلكتروني، المدينة أو الحالة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="ابحث عن السعاة"
            />
          </div>
        </div>

        {filteredLivreurs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد نتائج</h3>
            <p className="mt-1 text-gray-500">حاول تعديل استعلام البحث الخاص بك.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                    >
                      معلومات المستخدم
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                    >
                      الاتصال
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                    >
                      السعة
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                    >
                      الحالة
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                    >
                      المستندات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLivreurs.map((livreur) => (
                    <tr key={livreur._id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={livreur.userDetail?.image || defaultAvatar}
                              alt={livreur.userDetail?.name || 'مستخدم'}
                              onError={(e) => {
                                e.target.src = defaultAvatar;
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {livreur.userDetail?.name || 'مستخدم غير معروف'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {livreur.userDetail?.email || 'غير متاح'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{livreur.telephone || 'غير متاح'}</div>
                        <div className="text-sm text-gray-500">{livreur.citeprincipale || 'غير متاح'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">الحجم:</span>{' '}
                          {livreur.VolumeDisponibleParDefaut || 'غير متاح'}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">الوزن الأقصى:</span>{' '}
                          {livreur.poidsMaximale || 'غير متاح'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            livreur.statutDemande === 'Accepté'
                              ? 'bg-green-100 text-green-800'
                              : livreur.statutDemande === 'Rejeté'
                              ? 'bg-red-100 text-red-800'
                              : livreur.statutDemande === 'En attente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {livreur.statutDemande === 'Accepté' ? 'مقبول' : 
                           livreur.statutDemande === 'Rejeté' ? 'مرفوض' : 
                           livreur.statutDemande === 'En attente' ? 'في انتظار' : 
                           'غير معروف'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {viewDocuments(livreur.documents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* نافذة قبول الساعي */}
      {acceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">قبول الساعي</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">المدينة الرئيسية</label>
                <input
                  type="text"
                  name="citeprincipale"
                  value={formData.citeprincipale}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الحجم المتاح</label>
                <input
                  type="number"
                  name="VolumeDisponibleParDefaut"
                  value={formData.VolumeDisponibleParDefaut}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الوزن الأقصى</label>
                <input
                  type="number"
                  name="poidsMaximale"
                  value={formData.poidsMaximale}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setAcceptModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  تأكيد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivreurManagement;