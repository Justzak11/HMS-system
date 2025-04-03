import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  CalendarOutlined, 
  HomeOutlined, 
  UserOutlined, 
  DollarOutlined, 
  TeamOutlined, 
  ShopOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/bookings',
      icon: <CalendarOutlined />,
      label: 'Bookings',
    },
    {
      key: '/rooms',
      icon: <HomeOutlined />,
      label: 'Rooms',
    },
    {
      key: '/guests',
      icon: <UserOutlined />,
      label: 'Guests',
    },
    {
      key: '/billing',
      icon: <DollarOutlined />,
      label: 'Billing',
    },
    {
      key: '/conference',
      icon: <TeamOutlined />,
      label: 'Conference Rooms',
    },
    {
      key: '/restaurant',
      icon: <ShopOutlined />,
      label: 'Restaurant',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  return (
    <Sider
      width={250}
      style={{
        background: '#001529',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        HMS
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar; 