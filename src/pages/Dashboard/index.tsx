import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { useModel } from 'umi';

const Dashboard = () => {
    const { products, orders } = useModel('product');
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16}>
                <Col span={6}><Card><Statistic title="Tổng sản phẩm" value={products.length} /></Card></Col>
                <Col span={6}><Card><Statistic title="Giá trị tồn kho" value={totalStockValue} suffix="đ" /></Card></Col>
                <Col span={6}><Card><Statistic title="Tổng đơn hàng" value={orders.length} /></Card></Col>
                <Col span={6}><Card><Statistic title="Doanh thu" value={totalRevenue} suffix="đ" valueStyle={{ color: '#3f8600' }} /></Card></Col>
            </Row>
        </div>
    );
};
export default Dashboard;