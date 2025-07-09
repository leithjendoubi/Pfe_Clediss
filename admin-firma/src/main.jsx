import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Sidebar from './components/sidebar.jsx'

const { Content } = Layout;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
            <App />
          </Content>
        </Layout>
      </Layout>
    </Router>
  </StrictMode>
)