import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Modal, Form, Input, InputNumber, Select, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BarChartOutlined, GlobalOutlined, DollarOutlined, TrophyOutlined, TeamOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { store } from './store';
import Navbar from './components/Navbar';
import { Destination } from './mockData';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const QuanTri: React.FC = () => {
  const [destinations, setDestinations] = useState([...store.destinations]);
  const [itinerary, setItinerary] = useState([...store.itinerary]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Destination> | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setDestinations([...store.destinations]);
      setItinerary([...store.itinerary]);
    });
    return unsub;
  }, []);

  const totalPlacesChosen = itinerary.reduce((s, d) => s + d.places.length, 0);
  const totalDays = itinerary.length;
  const totalBudgetUsed = store.budget.total;

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Destination) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    store.deleteDestination(id);
    store.notify();
    message.success('Đã xóa điểm đến');
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editing?.id) {
        store.updateDestination({ ...editing, ...values } as Destination);
        message.success('Cập nhật thành công');
      } else {
        store.addDestination(values as Destination);
        message.success('Thêm thành công');
      }
      store.notify();
      setModalOpen(false);
    });
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, r: Destination) => (
        <div>
          <div style={{ fontWeight: 700 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#888' }}>{r.location}</div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (t: string) => {
        const map: Record<string, { label: string; color: string }> = {
          bien: { label: 'Biển', color: 'blue' },
          nui: { label: 'Núi', color: 'green' },
          thanh_pho: { label: 'Thành phố', color: 'purple' },
        };
        return <Tag color={map[t]?.color}>{map[t]?.label}</Tag>;
      },
    },
    { title: 'Thời gian', dataIndex: 'visitTime', key: 'visitTime' },
    {
      title: 'Chi phí',
      key: 'cost',
      render: (_: any, r: Destination) => (
        <div style={{ fontSize: 11 }}>
          <div>Ăn: {formatVND(r.foodCost)}</div>
          <div>Lưu trú: {formatVND(r.stayCost)}</div>
          <div>Di chuyển: {formatVND(r.transportCost)}</div>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (r: number) => <span style={{ color: '#faad14', fontWeight: 600 }}>{r} ★</span>,
    },
    {
      title: 'Lượt',
      dataIndex: 'popular',
      key: 'popular',
      render: (p: number) => <Tag color="orange">{p}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, r: Destination) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ padding: '0 4px' }} />
          <Popconfirm
            title="Xóa điểm đến này?"
            description="Hành động không thể hoàn tác."
            onConfirm={() => handleDelete(r.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} style={{ padding: '0 4px' }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  const bienCount = destinations.filter((d) => d.type === 'bien').length;
  const nuiCount = destinations.filter((d) => d.type === 'nui').length;
  const tpCount = destinations.filter((d) => d.type === 'thanh_pho').length;
  const topDest = [...destinations].sort((a, b) => b.popular - a.popular)[0];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar />
      <div style={{ padding: '24px 16px', maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 24 }}>
          <Col flex="auto"><h2 style={{ margin: 0 }}>⚙️ Trang Quản Trị</h2></Col>
          <Col><Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>Thêm Điểm Đến</Button></Col>
        </Row>

        <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 10, textAlign: 'center' }} bodyStyle={{ padding: '16px 8px' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1890ff' }}>{destinations.length}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}><GlobalOutlined /> Tổng điểm đến</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 10, textAlign: 'center' }} bodyStyle={{ padding: '16px 8px' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#722ed1' }}>{totalDays}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}><TeamOutlined /> Ngày đã tạo lịch trình</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 10, textAlign: 'center' }} bodyStyle={{ padding: '16px 8px' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#fa8c16' }}>{totalPlacesChosen}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>📍 Điểm đến đã chọn</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 10, textAlign: 'center' }} bodyStyle={{ padding: '16px 8px' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#52c41a' }}>{formatVND(totalBudgetUsed)}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}><DollarOutlined /> Tổng chi phí lịch trình</div>
            </Card>
          </Col>
        </Row>

        <Card
          tabList={[
            { key: 'list', label: '📋 Danh sách điểm đến' },
            { key: 'stats', label: <><BarChartOutlined /> Thống kê</> },
          ]}
          activeTabKey={activeTab}
          onTabChange={(k) => setActiveTab(k as any)}
          style={{ borderRadius: 10 }}
        >
          {activeTab === 'list' ? (
            <Table dataSource={destinations} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} size="middle" />
          ) : (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 8, fontWeight: 600, color: '#333' }}>📊 Điểm đến theo loại hình</div>
                <ReactApexChart
                  type="pie"
                  series={[bienCount, nuiCount, tpCount]}
                  options={{ labels: ['Biển', 'Núi', 'Thành phố'], colors: ['#1890ff', '#52c41a', '#722ed1'], legend: { position: 'bottom' as const } }}
                  height={280}
                />
                <div style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: -8 }}>
                  Biển: {bienCount} | Núi: {nuiCount} | TP: {tpCount}
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 8, fontWeight: 600, color: '#333' }}>💰 Chi phí theo điểm đến</div>
                <ReactApexChart
                  type="bar"
                  series={[
                    { name: 'Ăn uống', data: destinations.map((d) => d.foodCost) },
                    { name: 'Lưu trú', data: destinations.map((d) => d.stayCost) },
                    { name: 'Di chuyển', data: destinations.map((d) => d.transportCost) },
                  ]}
                  options={{
                    chart: { type: 'bar' as const, toolbar: { show: false } },
                    plotOptions: { bar: { horizontal: true } },
                    dataLabels: { enabled: false },
                    xaxis: { categories: destinations.map((d) => d.name) },
                    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
                    legend: { position: 'bottom' as const },
                    grid: { borderColor: '#f0f0f0' },
                  }}
                  height={280}
                />
              </Col>
              <Col xs={24}>
                <div style={{ marginBottom: 8, marginTop: 8, fontWeight: 600, color: '#333' }}>
                  🏆 Địa điểm phổ biến nhất: <span style={{ color: '#fa8c16' }}>{topDest?.name || '-'}</span>
                </div>
                <Row gutter={[12, 12]}>
                  {[...destinations].sort((a, b) => b.popular - a.popular).map((d) => (
                    <Col xs={12} sm={8} md={6} key={d.id}>
                      <Card
                        size="small"
                        style={{ borderRadius: 10, overflow: 'hidden' }}
                        cover={
                          <img
                            src={d.image}
                            style={{ height: 100, objectFit: 'cover', width: '100%' }}
                            onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'; }}
                          />
                        }
                        actions={[
                          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(d)} key="edit" />,
                          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(d.id)} okButtonProps={{ danger: true }}>
                            <Button type="link" danger size="small" icon={<DeleteOutlined />} key="del" />
                          </Popconfirm>,
                        ]}
                      >
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{d.location}</div>
                        <div style={{ fontSize: 13, color: '#e74c3c', marginTop: 4, fontWeight: 600 }}>{d.popular} lượt</div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          )}
        </Card>
      </div>

      <Modal
        title={editing ? '✏️ Sửa điểm đến' : '➕ Thêm điểm đến mới'}
        visible={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        width={620}
        okText={editing ? 'Lưu thay đổi' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input placeholder="VD: Phú Quốc" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}>
                <Input placeholder="VD: Kiên Giang" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
                <Select placeholder="Chọn loại hình">
                  <Select.Option value="bien">🌊 Biển</Select.Option>
                  <Select.Option value="nui">🏔️ Núi</Select.Option>
                  <Select.Option value="thanh_pho">🏙️ Thành phố</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="visitTime" label="Thời gian tham quan" rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}>
                <Input placeholder="VD: 3 ngày" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="image" label="URL Hình ảnh" rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="foodCost" label="Chi phí ăn uống" rules={[{ required: true, message: 'Nhập chi phí' }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="stayCost" label="Chi phí lưu trú" rules={[{ required: true, message: 'Nhập chi phí' }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="transportCost" label="Chi phí di chuyển" rules={[{ required: true, message: 'Nhập chi phí' }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="rating" label="Rating (0-5)" rules={[{ required: true, message: 'Nhập rating' }]}>
                <InputNumber style={{ width: '100%' }} min={0} max={5} step={0.1} placeholder="4.5" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="popular" label="Độ phổ biến" rules={[{ required: true, message: 'Nhập độ phổ biến' }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="100" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn về điểm đến..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanTri;
