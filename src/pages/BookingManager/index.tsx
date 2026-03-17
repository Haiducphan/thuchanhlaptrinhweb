import React, { useState, useMemo } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, InputNumber, TimePicker, Space, message, Typography, Popconfirm, Tag, Select, DatePicker, Rate, Row, Col, Statistic, Divider } from 'antd';
import { useModel } from 'umi';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const BookingManager = () => {
    const { dsNhanVien, setDsNhanVien, dsDichVu, setDsDichVu, dsLichHen, setDsLichHen } = useModel('booking');
    const [activeTab, setActiveTab] = useState('1');

    const [formStaff] = Form.useForm();
    const [formService] = Form.useForm();
    const [formBooking] = Form.useForm();
    const [isModalStaff, setIsModalStaff] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);
    const [isModalService, setIsModalService] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [isModalBooking, setIsModalBooking] = useState(false);


    const selectedDvId = Form.useWatch('dvId', formBooking);
    const selectedStartTime = Form.useWatch('thoiGian', formBooking);

    const estimatedEndTime = useMemo(() => {
        if (selectedDvId && selectedStartTime) {
            const dv = dsDichVu.find(s => s.id === selectedDvId);
            if (dv) return selectedStartTime.clone().add(dv.duration, 'minute').format('HH:mm');
        }
        return null;
    }, [selectedDvId, selectedStartTime, dsDichVu]);

    // --- TAB 1: NHÂN VIÊN & DỊCH VỤ ---
    const luuNhanVien = (v: any) => {
        const data = { ...v, id: editingStaff ? editingStaff.id : Date.now(), caLam: [v.caLam[0].format('HH:mm'), v.caLam[1].format('HH:mm')] };
        if (editingStaff) setDsNhanVien(dsNhanVien.map(i => i.id === editingStaff.id ? data : i));
        else setDsNhanVien([...dsNhanVien, data]);
        setIsModalStaff(false); setEditingStaff(null); formStaff.resetFields();
        message.success('Cập nhật nhân viên thành công!');
    };

    const luuDichVu = (v: any) => {
        const data = { ...v, id: editingService ? editingService.id : Date.now() };
        if (editingService) setDsDichVu(dsDichVu.map(i => i.id === editingService.id ? data : i));
        else setDsDichVu([...dsDichVu, data]);
        setIsModalService(false); setEditingService(null); formService.resetFields();
        message.success('Cập nhật dịch vụ thành công!');
    };

    // --- TAB 2: LOGIC ĐẶT LỊCH  ---
    const xuLyDatLich = (values: any) => {
        const { nvId, thoiGian, khach, sdt, dvId } = values;
        const nv = dsNhanVien.find(e => e.id === nvId);
        const dv = dsDichVu.find(s => s.id === dvId);

        const thoiLuong = Number(dv?.duration || 0);
        const thoiGianKetThuc = thoiGian.clone().add(thoiLuong, 'minute');


        setDsLichHen([...dsLichHen, {
            id: Date.now(),
            khach, sdt, nvId,
            tenNV: nv.name,
            tenDV: dv.serviceName,
            gia: dv.price,
            thoiGian: thoiGian.toISOString(),
            thoiGianKetThuc: thoiGianKetThuc.toISOString(),
            trangThai: 'Chờ duyệt', sao: 0, phanHoi: ''
        }]);
        setIsModalBooking(false); formBooking.resetFields();
        message.success('Đặt lịch thành công!');
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card title={<Title level={3} style={{ color: '#08979c', margin: 0 }}>HỆ THỐNG ĐẶT LỊCH DỊCH VỤ - TH03</Title>}>
                <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">

                    <Tabs.TabPane tab="1. Nhân sự & Dịch vụ" key="1">
                        <Space style={{ marginBottom: 16 }}>
                            <Button type="primary" onClick={() => { setEditingStaff(null); formStaff.resetFields(); setIsModalStaff(true); }}>+ Thêm Nhân viên</Button>
                            <Button type="primary" style={{ background: '#52c41a' }} onClick={() => { setEditingService(null); formService.resetFields(); setIsModalService(true); }}>+ Thêm Dịch vụ</Button>
                        </Space>
                        <Table dataSource={dsNhanVien} rowKey="id" columns={[
                            { title: 'Nhân viên', dataIndex: 'name' },
                            { title: 'Thứ trực', dataIndex: 'thuLamViec', render: (t) => t?.map((i: any) => <Tag color="blue" key={i}>{i === 0 ? 'CN' : `T${i + 1}`}</Tag>) },
                            { title: 'Ca trực', render: (_, r) => <Tag color="orange">{r.caLam[0]}-{r.caLam[1]}</Tag> },
                            {
                                title: 'Thao tác', render: (_, r) => (
                                    <Space>
                                        <Button type="link" onClick={() => { setEditingStaff(r); formStaff.setFieldsValue({ ...r, caLam: [dayjs(r.caLam[0], 'HH:mm'), dayjs(r.caLam[1], 'HH:mm')] }); setIsModalStaff(true); }}>Sửa</Button>
                                        <Popconfirm title="Xóa?" onConfirm={() => setDsNhanVien(dsNhanVien.filter(i => i.id !== r.id))}><Button type="link" danger>Xóa</Button></Popconfirm>
                                    </Space>
                                )
                            }
                        ]} />
                        <Divider />
                        <Table dataSource={dsDichVu} rowKey="id" columns={[
                            { title: 'Dịch vụ', dataIndex: 'serviceName' },
                            { title: 'Giá', render: (_, r) => r.price.toLocaleString() + ' VNĐ' },
                            { title: 'Thời lượng', render: (_, r) => r.duration + ' phút' },
                            {
                                title: 'Thao tác', render: (_, r) => (
                                    <Space>
                                        <Button type="link" onClick={() => { setEditingService(r); formService.setFieldsValue(r); setIsModalService(true); }}>Sửa</Button>
                                        <Popconfirm title="Xóa?" onConfirm={() => setDsDichVu(dsDichVu.filter(i => i.id !== r.id))}><Button type="link" danger>Xóa</Button></Popconfirm>
                                    </Space>
                                )
                            }
                        ]} />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="2. Lịch hẹn" key="2">
                        <Button type="primary" onClick={() => setIsModalBooking(true)} style={{ marginBottom: 16 }}>+ Đăng ký lịch mới</Button>
                        <Table dataSource={dsLichHen} rowKey="id" columns={[
                            { title: 'Khách hàng', render: (_, r) => <Text strong>{r.khach}{r.sdt ? ` - ${r.sdt}` : ''}</Text> }, // Fix lỗi hiển thị rỗng
                            { title: 'Nhân viên', dataIndex: 'tenNV' },
                            { title: 'Dịch vụ', dataIndex: 'tenDV' },
                            {
                                title: 'Thời gian hẹn', render: (_, r) => (
                                    <div>
                                        <Text type="secondary">{dayjs(r.thoiGian).format('DD/MM/YYYY')}</Text><br />
                                        <Tag color="cyan">{dayjs(r.thoiGian).format('HH:mm')} - {dayjs(r.thoiGianKetThuc).format('HH:mm')}</Tag>
                                    </div>
                                )
                            },
                            {
                                title: 'Trạng thái', dataIndex: 'trangThai', render: (st, r) => (
                                    <Select value={st} style={{ width: 125 }} onChange={(v) => setDsLichHen(dsLichHen.map(l => l.id === r.id ? { ...l, trangThai: v } : l))}>
                                        {['Chờ duyệt', 'Xác nhận', 'Hoàn thành', 'Hủy'].map(i => <Select.Option key={i} value={i}>{i}</Select.Option>)}
                                    </Select>
                                )
                            }
                        ]} />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="3. Đánh giá" key="3">
                        <Table dataSource={dsLichHen.filter(l => l.trangThai === 'Hoàn thành')} rowKey="id" columns={[
                            { title: 'Khách hàng', dataIndex: 'khach' },
                            { title: 'Nhân viên', dataIndex: 'tenNV' },
                            { title: 'Đánh giá', render: (_, r) => <Rate value={r.sao} onChange={(v) => setDsLichHen(dsLichHen.map(l => l.id === r.id ? { ...l, sao: v } : l))} /> },
                            {
                                title: 'NV Phản hồi',
                                render: (_, r) => (
                                    <Input.Search
                                        placeholder="Trả lời khách..."
                                        enterButton="Gửi"
                                        value={r.phanHoi}
                                        // Sửa onSearch để cập nhật state và hiện thông báo
                                        onSearch={(v) => {
                                            if (!v) return message.warning('Vui lòng nhập nội dung phản hồi!');
                                            setDsLichHen(dsLichHen.map(l => l.id === r.id ? { ...l, phanHoi: v } : l));
                                            message.success('Đã gửi phản hồi cho khách hàng!');
                                        }}
                                        onChange={(e) => setDsLichHen(dsLichHen.map(l => l.id === r.id ? { ...l, phanHoi: e.target.value } : l))}
                                    />
                                )
                            }
                        ]} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="4. Thống kê" key="4">
                        <Row gutter={16} style={{ marginBottom: 20 }}>
                            <Col span={12}>
                                <Card style={{ background: '#f6ffed' }}>
                                    <Statistic
                                        title={<Text strong style={{ color: '#52c41a' }}>TỔNG DOANH THU</Text>}
                                        value={dsLichHen.filter(l => l.trangThai === 'Hoàn thành').reduce((s, i) => s + (i.gia || 0), 0)}
                                        suffix="VNĐ"
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card style={{ background: '#e6f7ff' }}>
                                    <Statistic
                                        title={<Text strong style={{ color: '#1890ff' }}>LỊCH HẸN THÁNG {dayjs().format('MM')}</Text>}
                                        value={dsLichHen.filter(l => dayjs(l.thoiGian).month() === dayjs().month()).length}
                                        suffix="Lượt"
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Divider orientation="left">Doanh thu / Dịch vụ</Divider>
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={dsDichVu.map(dv => ({
                                        key: dv.id,
                                        name: dv.serviceName,
                                        total: dsLichHen.filter(l => l.tenDV === dv.serviceName && l.trangThai === 'Hoàn thành').reduce((s, i) => s + (i.gia || 0), 0)
                                    }))}
                                    columns={[
                                        { title: 'Dịch vụ', dataIndex: 'name' },
                                        { title: 'Doanh thu', render: (v) => v.total.toLocaleString() + ' đ' }
                                    ]}
                                />
                            </Col>
                            <Col span={12}>
                                <Divider orientation="left">Doanh thu / Nhân viên</Divider>
                                <Table
                                    size="small"
                                    pagination={false}

                                    dataSource={dsNhanVien.map(nv => ({
                                        key: nv.id,
                                        name: nv.name,
                                        total: dsLichHen.filter(l => l.nvId === nv.id && l.trangThai === 'Hoàn thành').reduce((s, i) => s + (i.gia || 0), 0)
                                    }))}
                                    columns={[
                                        { title: 'Nhân viên', dataIndex: 'name' },
                                        { title: 'Doanh thu', render: (v) => v.total.toLocaleString() + ' đ' }
                                    ]}
                                />
                            </Col>
                        </Row>

                        <Divider orientation="left">Số lượng lịch hẹn theo ngày</Divider>
                        <Table
                            size="small"
                            pagination={{ pageSize: 5 }}
                            dataSource={[...new Set(dsLichHen.map(l => dayjs(l.thoiGian).format('DD/MM/YYYY')))].map(date => ({
                                key: date,
                                date,
                                count: dsLichHen.filter(l => dayjs(l.thoiGian).format('DD/MM/YYYY') === date).length
                            }))}
                            columns={[
                                { title: 'Ngày', dataIndex: 'date' },
                                { title: 'Số lượng lịch', dataIndex: 'count', align: 'center' }
                            ]}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Card>

            {/* MODAL ĐẶT LỊCH */}
            <Modal title="Đăng ký lịch hẹn" visible={isModalBooking} onOk={() => formBooking.submit()} onCancel={() => setIsModalBooking(false)}>
                <Form form={formBooking} layout="vertical" onFinish={xuLyDatLich}>
                    <Form.Item name="khach" label="Tên khách hàng" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="sdt" label="Số điện thoại" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="nvId" label="Chọn nhân viên" rules={[{ required: true }]}><Select options={dsNhanVien.map(n => ({ label: n.name, value: n.id }))} /></Form.Item>
                    <Form.Item name="dvId" label="Dịch vụ" rules={[{ required: true }]}><Select options={dsDichVu.map(d => ({ label: d.serviceName, value: d.id }))} /></Form.Item>
                    <Form.Item name="thoiGian" label="Ngày và Giờ bắt đầu" rules={[{ required: true }]}><DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} /></Form.Item>

                    {estimatedEndTime && (
                        <div style={{ marginTop: -10, marginBottom: 15 }}>
                            <Text type="secondary">Giờ kết thúc dự kiến: </Text>
                            <Text strong style={{ color: '#13c2c2' }}>{estimatedEndTime}</Text>
                        </div>
                    )}
                </Form>
            </Modal>


            <Modal title="Thêm nhân viên" visible={isModalStaff} onOk={() => formStaff.submit()} onCancel={() => setIsModalStaff(false)}>
                <Form form={formStaff} layout="vertical" onFinish={luuNhanVien}>
                    <Form.Item name="name" label="Tên nhân viên" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="thuLamViec" label="Thứ trực" rules={[{ required: true }]}>
                        <Select mode="multiple" options={[1, 2, 3, 4, 5, 6, 0].map(i => ({ label: i === 0 ? 'CN' : `Thứ ${i + 1}`, value: i }))} />
                    </Form.Item>
                    <Form.Item name="caLam" label="Giờ trực" rules={[{ required: true }]}><TimePicker.RangePicker format="HH:mm" /></Form.Item>
                    <Form.Item name="gioiHan" label="Giới hạn khách" rules={[{ required: true }]}><InputNumber min={1} /></Form.Item>
                </Form>
            </Modal>

            <Modal title="Dịch vụ" visible={isModalService} onOk={() => formService.submit()} onCancel={() => setIsModalService(false)}>
                <Form form={formService} layout="vertical" onFinish={luuDichVu}>
                    <Form.Item name="serviceName" label="Tên dịch vụ" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="price" label="Giá" rules={[{ required: true }]}><InputNumber min={0} /></Form.Item>
                    <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}><InputNumber min={5} /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BookingManager;