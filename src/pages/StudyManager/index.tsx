import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, DatePicker, Select, Card, Tabs, Progress, message, Tag, Typography, Row, Col } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const { Text, Title } = Typography;

const StudyManager = () => {

    const { danhSachMon, nhatKyHoc, setNhatKyHoc, themMon, suaMon, xoaMon } = useModel('study');

    // Quản lý trạng thái Modal và việc Sửa/Thêm
    const [isModalHoc, setIsModalHoc] = useState(false);
    const [isModalMon, setIsModalMon] = useState(false);
    const [dangSuaBuoiHoc, setDangSuaBuoiHoc] = useState<any>(null);
    const [dangSuaMon, setDangSuaMon] = useState<any>(null);

    const [formHoc] = Form.useForm();
    const [formMon] = Form.useForm();

    // Tính toán số liệu thống kê
    const tongThoiGian = nhatKyHoc.reduce((acc: number, cur: any) => acc + (cur.duration || 0), 0);
    const mucTieuThang = 2000;

    // Logic tính toán phần trăm cho BIỂU ĐỒ PHÂN BỔ
    const thongKeTheoMon = danhSachMon.map(mon => {
        const phutMonNay = nhatKyHoc
            .filter((h: any) => h.subject === mon.name)
            .reduce((tong: number, h: any) => tong + (h.duration || 0), 0);
        return {
            ten: mon.name,
            phut: phutMonNay,
            phanTram: tongThoiGian > 0 ? Math.round((phutMonNay / tongThoiGian) * 100) : 0
        };
    });

    const getLoiNhan = () => {
        if (tongThoiGian === 0) return "Chào bạn! Hôm nay chúng ta bắt đầu học môn gì đây?";
        if (tongThoiGian < mucTieuThang) return "Cố gắng lên, bạn sắp chạm mốc mục tiêu tháng rồi!";
        return "Tuyệt vời! Bạn đã hoàn thành xuất sắc mục tiêu học tập!";
    };

    // Hàm xử lý Lưu buổi học (Thêm mới hoặc Cập nhật)
    const luuBuoiHoc = (values: any) => {
        const duLieuMoi = {
            ...values,
            id: dangSuaBuoiHoc ? dangSuaBuoiHoc.id : Date.now(),
            date: values.date.format('YYYY-MM-DD HH:mm')
        };

        if (dangSuaBuoiHoc) {
            setNhatKyHoc(nhatKyHoc.map((item: any) => item.id === dangSuaBuoiHoc.id ? duLieuMoi : item));
            message.success('Đã cập nhật thông tin buổi học!');
        } else {
            setNhatKyHoc([duLieuMoi, ...nhatKyHoc]);
            message.success('Đã lưu buổi học mới!');
        }

        setIsModalHoc(false);
        setDangSuaBuoiHoc(null);
        formHoc.resetFields();
    };

    const luuDanhMucMon = (values: any) => {
        if (dangSuaMon) {
            suaMon(dangSuaMon.id, values.name);
            message.success('Đã sửa tên môn học thành công!');
        } else {
            themMon(values.name);
            message.success('Đã thêm môn học mới!');
        }
        setIsModalMon(false);
        setDangSuaMon(null);
        formMon.resetFields();
    };

    return (
        <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Card bordered={false} title={<Title level={3} style={{ color: '#fa8c16', margin: 0 }}>QUẢN LÝ HỌC TẬP CÁ NHÂN</Title>}>

                {/* Lời nhắn động lực */}
                <div style={{ marginBottom: 20, padding: '12px 20px', borderLeft: '5px solid #fa8c16', background: '#fff7e6', borderRadius: '4px' }}>
                    <Text italic style={{ fontSize: '16px' }}>"{getLoiNhan()}"</Text>
                </div>

                <Tabs defaultActiveKey="1" type="card">
                    <Tabs.TabPane tab="Tiến độ & Thống kê" key="1">
                        {/* Phần Dashboard Biểu đồ */}
                        <Row gutter={[16, 16]} style={{ marginBottom: 25 }}>
                            <Col xs={24} md={8}>
                                <div style={{ padding: 20, background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0', textAlign: 'center', height: '100%' }}>
                                    <Text strong>Tiến độ mục tiêu tháng</Text>
                                    <Progress
                                        type="circle"
                                        percent={Math.min(100, Math.round((tongThoiGian / mucTieuThang) * 100))}
                                        strokeColor="#fa8c16"
                                        style={{ display: 'block', margin: '20px auto' }}
                                    />
                                    <Text>{tongThoiGian} / {mucTieuThang} phút</Text>
                                </div>
                            </Col>
                            <Col xs={24} md={16}>
                                <div style={{ padding: 20, background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0', height: '100%' }}>
                                    <Text strong>Phân bổ thời gian theo môn học (%)</Text>
                                    <div style={{ marginTop: 15 }}>
                                        {thongKeTheoMon.map(item => (
                                            <div key={item.ten} style={{ marginBottom: 12 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <Text>{item.ten}</Text>
                                                    <Text type="secondary">{item.phut} phút</Text>
                                                </div>
                                                <Progress percent={item.phanTram} size="small" status="active" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Button type="primary" onClick={() => { setDangSuaBuoiHoc(null); setIsModalHoc(true); }} style={{ marginBottom: 16, backgroundColor: '#fa8c16', border: 'none' }}>
                            + Ghi nhận buổi học mới
                        </Button>

                        <Table dataSource={nhatKyHoc} rowKey="id" columns={[
                            { title: 'Môn học', dataIndex: 'subject', key: 'subject' },
                            { title: 'Ngày học', dataIndex: 'date', key: 'date' },
                            { title: 'Thời lượng', dataIndex: 'duration', render: (v) => <Tag color="orange">{v} phút</Tag> },
                            {
                                title: 'Thao tác', key: 'action', render: (_, record) => (
                                    <Space size="middle">
                                        <Button type="link" onClick={() => {
                                            setDangSuaBuoiHoc(record);
                                            formHoc.setFieldsValue({ ...record, date: moment(record.date, 'YYYY-MM-DD HH:mm') });
                                            setIsModalHoc(true);
                                        }}>Sửa</Button>
                                        <Button type="link" danger onClick={() => setNhatKyHoc(nhatKyHoc.filter((i: any) => i.id !== record.id))}>Xóa</Button>
                                    </Space>
                                )
                            }
                        ]} />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Danh mục môn học" key="2">
                        <Button type="dashed" onClick={() => { setDangSuaMon(null); setIsModalMon(true); }} style={{ marginBottom: 16 }}>
                            + Thêm môn học mới
                        </Button>
                        <Table dataSource={danhSachMon} rowKey="id" columns={[
                            { title: 'Tên môn học', dataIndex: 'name', key: 'name', render: (text) => <b>{text}</b> },
                            {
                                title: 'Thao tác', key: 'action', render: (_, record) => (
                                    <Space size="middle">
                                        <Button type="link" onClick={() => { setDangSuaMon(record); formMon.setFieldsValue(record); setIsModalMon(true); }}>Sửa tên</Button>
                                        <Button type="link" danger onClick={() => xoaMon(record.id)}>Xóa môn</Button>
                                    </Space>
                                )
                            }
                        ]} />
                    </Tabs.TabPane>
                </Tabs>
            </Card>

            {/* Modal Thêm/Sửa Buổi Học */}
            <Modal
                title={dangSuaBuoiHoc ? "Cập nhật thông tin buổi học" : "Ghi nhận buổi học mới"}
                visible={isModalHoc}
                onOk={() => formHoc.submit()}
                onCancel={() => { setIsModalHoc(false); setDangSuaBuoiHoc(null); }}
                okText="Xác nhận lưu"
                cancelText="Hủy bỏ"
            >
                <Form form={formHoc} layout="vertical" onFinish={luuBuoiHoc}>
                    <Form.Item name="subject" label="Chọn môn học" rules={[{ required: true, message: 'Vui lòng chọn môn!' }]}>
                        <Select placeholder="Chọn môn từ danh mục">
                            {danhSachMon.map((m: any) => <Select.Option key={m.id} value={m.name}>{m.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="date" label="Ngày và giờ học" rules={[{ required: true }]}><DatePicker showTime style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="duration" label="Thời lượng học (phút)" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="content" label="Nội dung đã học"><Input.TextArea rows={3} placeholder="Hôm nay bạn đã học được những gì?" /></Form.Item>
                </Form>
            </Modal>

            {/* Modal Thêm/Sửa Danh Mục Môn */}
            <Modal title={dangSuaMon ? "Sửa tên môn học" : "Thêm môn học mới"} visible={isModalMon} onOk={() => formMon.submit()} onCancel={() => { setIsModalMon(false); setDangSuaMon(null); }}>
                <Form form={formMon} layout="vertical" onFinish={luuDanhMucMon}>
                    <Form.Item name="name" label="Tên môn học" rules={[{ required: true, message: 'Không được để trống tên môn!' }]}>
                        <Input placeholder="Ví dụ: Lập trình Web, Giải tích..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StudyManager;