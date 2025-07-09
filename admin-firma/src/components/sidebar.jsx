import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  
  if (location.pathname === '/') {
    return null; // لا تظهر الشريط الجانبي في صفحة تسجيل الدخول
  }
  
  const menuItems = [
    {
      key: "1",
      icon: <i className="fas fa-tachometer-alt"></i>,
      label: <Link to="/administration">لوحة التحكم</Link>,
    },
    {
      key: "2",
      icon: <i className="fas fa-store"></i>,
      label: <Link to="/marche">الأسواق</Link>,
    },
    {
      key: "3",
      icon: <i className="fas fa-truck"></i>,
      label: <Link to="/livreurDemand">طلبات السائقين</Link>,
    },
    {
      key: "4",
      icon: <i className="fas fa-users"></i>,
      label: <Link to="/demandofusers">طلبات المستخدمين</Link>,
    },
    {
      key: "5",
      icon: <i className="fas fa-boxes"></i>,
      label: <Link to="/treatproducts">المنتجات</Link>,
    },
  ];

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        minHeight: "100vh",
        boxShadow: "2px 0 6px rgba(0, 21, 41, 0.35)",
      }}
    >
      <div className="logo" style={{ padding: "16px", textAlign: "center" }}>
        <h2 style={{ color: "white", margin: 0 }}>لوحة الإدارة</h2>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;