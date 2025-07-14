import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Card, Tag, Space, Divider, message, Modal, Form, Input, Select, InputNumber, Row, Col } from 'antd';
import { ReloadOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './administration.css';

// Configure API base URL
const API_BASE_URL = 'http://localhost:4000/api/administration';

const ProductEditor = ({ value = [], onChange }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newProduct, setNewProduct] = useState('');

  useEffect(() => {
    // Initialize with existing data
    if (value && Array.isArray(value)) {
      setCategories(value.map(([cat]) => cat));
      setProducts(value);
    }
  }, [value]);

  const handleAddProduct = () => {
    if (!selectedCategory || !newProduct.trim()) return;

    const updatedProducts = products.map(item => {
      if (item[0] === selectedCategory) {
        return [item[0], [...item[1], newProduct.trim()]];
      }
      return item;
    });

    // If category doesn't exist, add new category with product
    if (!products.some(item => item[0] === selectedCategory)) {
      updatedProducts.push([selectedCategory, [newProduct.trim()]]);
    }

    setProducts(updatedProducts);
    onChange(updatedProducts);
    setNewProduct('');
  };

  const handleDeleteProduct = (category, productIndex) => {
    const updatedProducts = products.map(item => {
      if (item[0] === category) {
        const filteredProducts = item[1].filter((_, idx) => idx !== productIndex);
        return [item[0], filteredProducts];
      }
      return item;
    }).filter(item => item[1].length > 0); // Remove empty categories

    setProducts(updatedProducts);
    onChange(updatedProducts);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Select
            style={{ width: '100%' }}
            placeholder="اختر فئة"
            value={selectedCategory}
            onChange={setSelectedCategory}
          >
            {categories.map(category => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Input
            placeholder="أدخل اسم المنتج"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            onPressEnter={handleAddProduct}
          />
        </Col>
      </Row>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddProduct}
        disabled={!selectedCategory || !newProduct.trim()}
        style={{ marginBottom: 16 }}
      >
        إضافة منتج
      </Button>

      <div className="product-edit-container">
        {products.map(([category, items]) => (
          <div key={category} className="product-category-edit">
            <h4>{category}</h4>
            <div className="product-items-edit">
              {items.map((product, index) => (
                <div key={`${category}-${index}`} className="product-item">
                  <span>{product}</span>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteProduct(category, index)}
                    danger
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PriceEditor = ({ value = [], onChange }) => {
  const [prices, setPrices] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    if (value && Array.isArray(value)) {
      setPrices(value);
    }
  }, [value]);

  const handleAddPrice = () => {
    if (!newProduct.trim() || isNaN(newPrice) || newPrice === '') return;

    const updatedPrices = [...prices, [newProduct.trim(), Number(newPrice)]];
    setPrices(updatedPrices);
    onChange(updatedPrices);
    setNewProduct('');
    setNewPrice('');
  };

  const handleDeletePrice = (index) => {
    const updatedPrices = prices.filter((_, idx) => idx !== index);
    setPrices(updatedPrices);
    onChange(updatedPrices);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="اسم المنتج"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <InputNumber
            placeholder="السعر"
            value={newPrice}
            onChange={setNewPrice}
            style={{ width: '100%' }}
            min={0}
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddPrice}
            disabled={!newProduct.trim() || isNaN(newPrice) || newPrice === ''}
          />
        </Col>
      </Row>

      <div className="price-edit-container">
        {prices.map(([product, price], index) => (
          <div key={index} className="price-item">
            <span className="price-product">{product}</span>
            <span className="price-value">{price} دينار</span>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeletePrice(index)}
              danger
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const AdministrationDashboard = () => {
  const [latestData, setLatestData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState({
    main: false,
    table: false,
    update: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [form] = Form.useForm();

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, main: true, table: true }));

      const [latestRes, historyRes] = await Promise.all([
        api.get('/'),
        api.get('/history'),
      ]);

      setLatestData(latestRes.data);
      setHistoryData(historyRes.data || []);
    } catch (error) {
      console.error('API Error:', error);
      message.error(error.response?.data?.message || 'فشل في جلب بيانات الإدارة');
    } finally {
      setLoading(prev => ({ ...prev, main: false, table: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleEdit = (fieldName) => {
    if (!latestData) return;

    setEditingField(fieldName);
    form.setFieldsValue({
      [fieldName]: latestData[fieldName],
    });
    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(prev => ({ ...prev, update: true }));
      const values = await form.validateFields();

      await api.post('/', {
        [editingField]: values[editingField],
      });

      message.success('تم تحديث الإعدادات بنجاح');
      setIsEditModalVisible(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Update Error:', error);
      message.error(error.response?.data?.message || 'فشل في تحديث الإعدادات');
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  const renderEditField = (fieldName) => {
    if (fieldName === 'produits') {
      return (
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <ProductEditor
              value={getFieldValue(fieldName)}
              onChange={(value) => setFieldsValue({ [fieldName]: value })}
            />
          )}
        </Form.Item>
      );
    }

    if (fieldName === 'produitTarifsParkillo') {
      return (
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldsValue }) => (
            <PriceEditor
              value={getFieldValue(fieldName)}
              onChange={(value) => setFieldsValue({ [fieldName]: value })}
            />
          )}
        </Form.Item>
      );
    }

    if (fieldName.includes('typeMarche') || fieldName.includes('typeDes')) {
      return (
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="أضف عناصر (اضغط Enter لإضافة عنصر جديد)"
          tokenSeparators={[',']}
        />
      );
    }

    return <Input.TextArea rows={4} />;
  };

  const renderEditableField = (title, fieldName, data) => {
    if (!latestData) return null;

    if (fieldName === 'produits') {
      return (
        <div className="editable-field">
          <div className="field-header">
            <h3>{title}</h3>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(fieldName)}
              disabled={loading.main}
            />
          </div>
          <div className="products-container">
            {data?.map?.(([category, products], index) => (
              <div key={index} className="product-category">
                <h4 className="category-title">{category}</h4>
                <div className="product-items">
                  {products?.map?.((product, i) => (
                    <Tag color="blue" key={i} className="product-tag">
                      {product}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (fieldName === 'produitTarifsParkillo') {
      return (
        <div className="editable-field">
          <div className="field-header">
            <h3>{title}</h3>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(fieldName)}
              disabled={loading.main}
            />
          </div>
          <div className="prices-container">
            <table className="price-table">
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>السعر</th>
                </tr>
              </thead>
              <tbody>
                {data?.map?.(([product, price], index) => (
                  <tr key={index}>
                    <td>{product}</td>
                    <td>{price} دينار</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="editable-field">
        <div className="field-header">
          <h3>{title}</h3>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(fieldName)}
            disabled={loading.main}
          />
        </div>
        {Array.isArray(data) ? (
          <Space wrap>
            {data?.map?.((item, index) => (
              <Tag color="blue" key={index}>
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </Tag>
            ))}
          </Space>
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: 'التاريخ',
      dataIndex: 'newDate',
      key: 'date',
      render: (date) => (date ? new Date(date).toLocaleString() : '-'),
      sorter: (a, b) => new Date(a.newDate || 0) - new Date(b.newDate || 0),
      defaultSortOrder: 'descend',
    },
    {
      title: 'أنواع الأسواق',
      dataIndex: 'typeMarche',
      key: 'marketTypes',
      render: (types) => (
        <Space size="small">
          {types?.map?.((type, i) => (
            <Tag color="blue" key={i}>
              {type}
            </Tag>
          )) || '-'}
        </Space>
      ),
    },
    {
      title: 'فئات المنتجات',
      dataIndex: 'categorieProduitMarche',
      key: 'categories',
      render: (categories) => categories?.join?.(', ') || '-',
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => setLatestData(record)}
          disabled={!record}
        >
          عرض التفاصيل
        </Button>
      ),
    },
  ];

  return (
    <div className="administration-container">
      <div className="header-section">
        <h1>لوحة إدارة السوق</h1>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => setRefreshKey(prev => prev + 1)}
          loading={loading.main}
        >
          تحديث البيانات
        </Button>
      </div>

      <Card
        title="الإعدادات الحالية"
        className="current-config-card"
        loading={loading.main}
      >
        {latestData ? (
          <>
            {renderEditableField('أنواع الأسواق', 'typeMarche', latestData.typeMarche)}
            <Divider />
            {renderEditableField('فئات المنتجات', 'categorieProduitMarche', latestData.categorieProduitMarche)}
            <Divider />
            {renderEditableField('المنتجات', 'produits', latestData.produits)}
            <Divider />
            {renderEditableField('أسعار باركيلو', 'produitTarifsParkillo', latestData.produitTarifsParkillo)}
            <Divider />
            {renderEditableField('أنواع البائعين', 'typeDesVendeurs', latestData.typeDesVendeurs)}
            <Divider />
            {renderEditableField('أنواع المنتجين', 'typeDesProducteurs', latestData.typeDesProducteurs)}
          </>
        ) : (
          <p>لا توجد بيانات إعدادات متاحة</p>
        )}
      </Card>

      <Divider />

      <Table
        columns={columns}
        dataSource={historyData}
        rowKey={(record) => record._id || record.newDate || Math.random()}
        loading={loading.table}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: 'لا توجد بيانات تاريخية متاحة',
        }}
      />

      <Modal
        title={`تعديل ${editingField}`}
        open={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalVisible(false)}
        okText="تحديث"
        cancelText="إلغاء"
        confirmLoading={loading.update}
        width={editingField === 'produits' ? 800 : 600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name={editingField}
            label={editingField}
            rules={[
              {
                required: true,
                message: `الرجاء إدخال ${editingField}`,
              },
            ]}
          >
            {renderEditField(editingField)}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdministrationDashboard;