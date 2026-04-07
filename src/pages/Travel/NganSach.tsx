import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Alert, InputNumber, Button, Table, Tag } from 'antd';
import { WarningOutlined, CheckCircleOutlined, WalletOutlined, AlertOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { store } from './store';
import Navbar from './components/Navbar';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const NganSach: React.FC = () => {
  const [budget, setBudget] = useState(store.budget);
  const [itinerary, setItinerary] = useState(store.itinerary);
  const [budgetLimit, setBudgetLimit] = useState<number>(10000000);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBudget({ ...store.budget });
      setItinerary([...store.itinerary]);
    });
    return unsub;
  }, []);

  const categories = [
    { key: 'anUong', label: 'Ăn uống', value: budget.anUong, color: '#ff6b6b' },
    { key: 'luuTru', label: 'Lưu trú', value: budget.luuTru, color: '#4ecdc4' },
    { key: 'diChuyen', label: 'Di chuyển', value: budget.diChuyen, color: '#45b7d1' },
    { key: 'khac', label: 'Khác', value: budget.khac, color: '#96ceb4' },
  ];

  const pieOptions = { labels: categories.map((c) => c.label), colors: categories.map((c) => c.color), chart: { type: 'pie' as const }, dataLabels: { enabled: true }, legend: { position: 'bottom' as const } };
  const pieSeries = categories.map((c) => c.value);

  const barOptions = { chart: { type: 'bar' as const, toolbar: { show: false } }, plotOptions: { bar: { horizontal: false, columnWidth: '50%' } }, dataLabels: { enabled: false }, xaxis: { categories: categories.map((c) => c.label) }, colors: categories.map((c) => c.color), title: { text: 'Chi phí theo hạng mục', align: 'left' as const } };
  const barSeries = [{ name: 'Chi phí', data: categories.map((c) => c.value) }];

  const isOverBudget = budget.total > budgetLimit;
  const usedPercent = budgetLimit > 0 ? Math.round((budget.total / budgetLimit) * 100) : 0;

  const tableData = itinerary.map((day: any) => ({
    day: day.day,
    places: day.places.map((p: any) => p.name).join(', ') || 'Chưa chọn',
    count: day.places.length,
    cost: day.places.reduce((s: number, p: any) => s + p.foodCost + p.stayCost + p.transportCost, 0),
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar />
      <div style={{ padding: '24px 16px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 24 }}>💰 Quản Lý Ngân Sách</h2>

        {isOverBudget && (
          <Alert message="⚠️ Cảnh Báo Vượt Ngân Sách!" description={`Tổng chi phí ${formatVND(budget.total)} đã vượt ngân sách ${formatVND(budgetLimit)} (vượt ${formatVND(budget.total - budgetLimit)}).`} type="error" icon={<WarningOutlined />} showIcon style={{ marginBottom: 16 }} />
        )}

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: '20px 16px' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}><WalletOutlined /> Ngân sách giới hạn</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1890ff' }}>{formatVND(budgetLimit)}</div>
              <div style={{ marginTop: 8 }}>
                <InputNumber
                  style={{ width: '100%' }}
                  value={budgetLimit}
                  onChange={(v) => setBudgetLimit(v || 0)}
                  addonAfter={<Button size="small" onClick={() => setBudgetLimit(10000000)}>Reset</Button>}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: '20px 16px' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}><SafetyCertificateOutlined /> Tổng chi phí</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: isOverBudget ? '#cf1322' : '#3f8600' }}>{formatVND(budget.total)}</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: '20px 16px' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}><AlertOutlined /> {isOverBudget ? 'Vượt ngân sách' : 'Còn lại'}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: isOverBudget ? '#cf1322' : '#3f8600' }}>
                {isOverBudget ? '+' : '-'}{formatVND(Math.abs(budget.total - budgetLimit))}
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="Tiến độ sử dụng ngân sách" style={{ marginBottom: 24 }}>
          <Progress percent={usedPercent > 100 ? 100 : usedPercent} status={isOverBudget ? 'exception' : usedPercent > 80 ? 'exception' : 'active'} strokeColor={isOverBudget ? '#cf1322' : '#52c41a'} format={() => `${formatVND(budget.total)} / ${formatVND(budgetLimit)}`} />
          <div style={{ marginTop: 8 }}><span style={{ color: usedPercent > 80 ? '#faad14' : '#52c41a' }}>{usedPercent > 80 ? <WarningOutlined /> : <CheckCircleOutlined />} {usedPercent <= 50 ? 'Tiết kiệm tốt! Dưới 50% ngân sách.' : usedPercent <= 80 ? 'Ngân sách sử dụng ở mức hợp lý.' : usedPercent <= 100 ? 'Ngân sách sắp hết, hãy cân nhắc giảm chi tiêu!' : 'Đã vượt ngân sách!'}</span></div>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}><Card title="📊 Biểu đồ tròn phân bổ ngân sách">{budget.total > 0 ? <ReactApexChart type="pie" series={pieSeries} options={pieOptions} height={300} /> : <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Chưa có dữ liệu chi tiêu</div>}</Card></Col>
          <Col xs={24} md={12}><Card title="📊 Biểu đồ cột chi phí theo hạng mục">{budget.total > 0 ? <ReactApexChart type="bar" series={barSeries} options={barOptions} height={300} /> : <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Chưa có dữ liệu chi tiêu</div>}</Card></Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={12}>
            <Card title="Chi tiết từng hạng mục">
              {categories.map((cat) => (
                <div key={cat.key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{cat.label}</span><span style={{ fontWeight: 'bold', color: cat.color }}>{formatVND(cat.value)}</span></div>
                  <Progress percent={budget.total > 0 ? Math.round((cat.value / budget.total) * 100) : 0} strokeColor={cat.color} showInfo={false} size="small" />
                </div>
              ))}
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="📅 Chi phí theo ngày">
              {itinerary.filter((d: any) => d.places.length > 0).length > 0 ? (
                <Table
                  dataSource={tableData.filter((d: any) => d.count > 0)}
                  rowKey="day"
                  size="small"
                  pagination={false}
                  columns={[
                    { title: 'Ngày', dataIndex: 'day', render: (d: number) => <Tag color="blue">Ngày {d}</Tag> },
                    { title: 'Điểm đến', dataIndex: 'places', ellipsis: true },
                    { title: 'Số điểm', dataIndex: 'count', align: 'center' as const },
                    { title: 'Chi phí', dataIndex: 'cost', render: (v: number) => <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{formatVND(v)}</span> },
                  ]}
                />
              ) : <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>📭 Chưa có lịch trình nào. Hãy thêm điểm đến từ Trang Chủ hoặc Lịch Trình.</div>}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default NganSach;