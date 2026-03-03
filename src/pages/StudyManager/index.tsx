import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, DatePicker, Select, Card, Tabs, Progress, message, Tag, Popconfirm } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const StudyManager = () => {
    const { danhSachMon, nhatKyHoc, setNhatKyHoc, themMon, suaMon, xoaMon } = useModel('study');
    const [isModalHoc, setIsModalHoc] = useState(false);
    const [isModalMon, setIsModalMon] = useState(false);
    const [dangSuaMon, setDangSuaMon] = useState<any>(null);
    const [formHoc] = Form.useForm();
    const [formMon] = Form.useForm();

    const tongThoiGian = nhatKyHoc.reduce((acc: number, cur: any) => acc + (cur.duration || 0), 0);
    const mucTieuThang = 500;

    const luuBuoiHoc = (values: any) => {
        const newData = { ...values, id: Date.now(), date: values.date.format('YYYY-MM-DD HH:mm') };
        setNhatKyHoc([newData, ...nhatKyHoc]);
        setIsModalHoc(false);
        formHoc.resetFields();
        message.success('Đã lưu buổi học!');
    };

    const luuDanhMucMon = (values: any) => {
        if (dangSuaMon) {
            suaMon(dangSuaMon.id, values.name);
            message.success('Đã sửa môn học');
        } else {
            themMon(values.name);
            message.success('Đã thêm môn học mới');
        }
        setIsModalMon(false);
        setDangSuaMon(null);
        formMon.resetFields();
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card title={<b style={{ color: '#fa8c16' }}>QUẢN LÝ HỌC TẬP PTIT</b>}>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Tiến độ học tập" key="1">
                        <div style={{ marginBottom: 20, padding: 15, background: '#fff7e6', borderRadius: 8 }}>
                            <Progress percent={Math.min(100, Math.round((tongThoiGian / mucTieuThang) * 100))} status="active" strokeColor="#fa8c16" />
                            <Text style={{ marginTop: 10, display: 'block' }}>Tổng: {tongThoiGian}/{mucTieuThang} phút</Text>
                        </div>
                        <Button type="primary" onClick={() => setIsModalHoc(true)} style={{ marginBottom: 16, backgroundColor: '#fa8c16' }}>+ Thêm buổi học</Button>
                        <Table dataSource={nhatKyHoc} rowKey="id" columns={[
                            { title: 'Môn học', dataIndex: 'subject' },
                            { title: 'Thời gian', dataIndex: 'date' },
                            { title: 'Thời lượng', dataIndex: 'duration', render: v => `${v} phút` },
                            { title: 'Thao tác', render: (_, record) => <Button type="link" danger onClick={() => setNhatKyHoc(nhatKyHoc.filter((i: any) => i.id !== record.id))}>Xóa</Button> }
                        ]} />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Danh mục môn học" key="2">
                        <Button onClick={() => { setDangSuaMon(null); setIsModalMon(true); }} style={{ marginBottom: 16 }}>+ Thêm môn mới</Button>
                        <Table dataSource={danhSachMon} rowKey="id" columns={[
                            { title: 'Tên môn học', dataIndex: 'name' },
                            {
                                title: 'Thao tác', render: (_, record) => (
                                    <Space>
                                        <Button type="link" onClick={() => { setDangSuaMon(record); formMon.setFieldsValue(record); setIsModalMon(true); }}>Sửa</Button>
                                        <Popconfirm title="Xóa môn này?" onConfirm={() => xoaMon(record.id)}><Button type="link" danger>Xóa</Button></Popconfirm>
                                    </Space>
                                )
                            }
                        ]} />
                    </Tabs.TabPane>
                </Tabs>
            </Card>

            { }
            <Modal title="Thêm buổi học" visible={isModalHoc} onOk={() => formHoc.submit()} onCancel={() => setIsModalHoc(false)}>
                <Form form={formHoc} layout="vertical" onFinish={luuBuoiHoc}>
                    <Form.Item name="subject" label="Môn học" rules={[{ required: true }]}>
                        <Select placeholder="Chọn môn">{danhSachMon.map((m: any) => <Select.Option key={m.id} value={m.name}>{m.name}</Select.Option>)}</Select>
                    </Form.Item>
                    <Form.Item name="date" label="Ngày giờ" rules={[{ required: true }]}><DatePicker showTime style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="duration" label="Số phút" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
                </Form>
            </Modal>

            {/* Modal Quản lý danh mục môn */}
            <Modal title={dangSuaMon ? "Sửa môn học" : "Thêm môn học"} visible={isModalMon} onOk={() => formMon.submit()} onCancel={() => setIsModalMon(false)}>
                <Form form={formMon} layout="vertical" onFinish={luuDanhMucMon}>
                    <Form.Item name="name" label="Tên môn học" rules={[{ required: true }]}><Input /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
const Text = ({ children, style }: any) => <span style={style}>{children}</span>;
export default StudyManager;