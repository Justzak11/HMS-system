import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const stats = {
    totalGuests: 150,
    occupiedRooms: 45,
    todayBookings: 12,
    monthlyRevenue: 25000,
  };

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Guests"
              value={stats.totalGuests}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Occupied Rooms"
              value={stats.occupiedRooms}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Bookings"
              value={stats.todayBookings}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Revenue"
              value={stats.monthlyRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={16}>
          <Card title="Recent Bookings">
            <p>Recent bookings will be displayed here</p>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Room Status">
            <p>Room status overview will be displayed here</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 