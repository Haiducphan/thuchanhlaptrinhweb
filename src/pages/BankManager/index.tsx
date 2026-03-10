import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, Select, InputNumber, Space, message, Tag, Typography, Popconfirm } from 'antd';
import { useModel } from 'umi';

const { Title, Text } = Typography;

const BankManager = () => {
    const { monHoc, setMonHoc, cauHoi, setCauHoi, deThi, setDeThi, khoiKT } = useModel('bank');
    const [activeTab, setActiveTab] = useState('1');

    const [isModalMon, setIsModalMon] = useState(false);
    const [isModalCauHoi, setIsModalCauHoi] = useState(false);
    const [isModalDeThi, setIsModalDeThi] = useState(false);

    const [formMon] = Form.useForm();
    const [formCauHoi] = Form.useForm();
    const [formDeThi] = Form.useForm();

    const luuMonHoc = (values: any) => {
        setMonHoc([...monHoc, { ...values, id: Date.now() }]);
        message.success('Đã thêm môn học mới vào hệ thống!');
        setIsModalMon(false);
        formMon.resetFields();
    };

    const luuCauHoi = (values: any) => {
        setCauHoi([...cauHoi, { ...values, id: Date.now() }]);
        message.success('Đã lưu câu hỏi vào ngân hàng!');
        setIsModalCauHoi(false);
        formCauHoi.resetFields();
    };

    const xuLyTaoDe = (values: any) => {
        const { maMon, soLuong, mucDo, khoi } = values;

        let danhSachChon = cauHoi.filter(q => q.maMon === maMon && q.mucDo === mucDo && q.khoi === khoi);

        if (danhSachChon.length < soLuong) {
            const cauHoiDuPhong = cauHoi.filter(q => q.maMon === maMon && !danhSachChon.includes(q));
            danhSachChon = [...danhSachChon, ...cauHoiDuPhong.slice(0, soLuong - danhSachChon.length)];
        }


        if (danhSachChon.length < soLuong) {
            message.warning(`Ngân hàng môn này hiện chỉ có ${danhSachChon.length} câu, không đủ tạo đề ${soLuong} câu!`);
            return;
        }

        const deMoi = {
            id: Date.now(),
            tenDe: `Đề thi môn ${maMon} - (Chính thức) - ${new Date().toLocaleDateString()}`,
            maMon: maMon,
            chiTiet: danhSachChon.sort(() => 0.5 - Math.random())
        };

        setDeThi([deMoi, ...deThi]);
        message.success('Đã tạo đề thi thành công!');
        setIsModalDeThi(false);
        formDeThi.resetFields();
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card title={<Title level={3} style={{ color: '#fa8c16', margin: 0 }}>📚 QUẢN LÝ NGÂN HÀNG ĐỀ THI - PTIT</Title>}>
                <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">

                    {/* TAB 1: MÔN HỌC */}
                    <Tabs.TabPane tab="1. Môn học" key="1">
                        <Button type="primary" onClick={() => setIsModalMon(true)} style={{ marginBottom: 16, background: '#fa8c16', borderColor: '#fa8c16' }}>
                            + Thêm học phần mới
                        </Button>
                        <Table dataSource={monHoc} rowKey="id" columns={[
                            { title: 'Mã môn', dataIndex: 'maMon' },
                            { title: 'Tên môn', dataIndex: 'tenMon' },
                            { title: 'Số tín chỉ', dataIndex: 'tinChi' },
                            {
                                title: 'Thao tác',
                                render: (_, rec) => (
                                    <Popconfirm title="Xóa môn này?" onConfirm={() => setMonHoc(monHoc.filter(m => m.id !== rec.id))}>
                                        <Button type="link" danger>Xóa</Button>
                                    </Popconfirm>
                                )
                            }
                        ]} />
                    </Tabs.TabPane>

                    {/* TAB 2: CÂU HỎI  */}
                    <Tabs.TabPane tab="2. Ngân hàng câu hỏi" key="2">
                        <Button type="primary" onClick={() => setIsModalCauHoi(true)} style={{ marginBottom: 16 }}>
                            + Thêm câu hỏi tự luận
                        </Button>
                        <Table dataSource={cauHoi} rowKey="id" columns={[
                            { title: 'Nội dung câu hỏi', dataIndex: 'noiDung', ellipsis: true },
                            { title: 'Mức độ', dataIndex: 'mucDo', render: (m) => <Tag color={m === 'Khó' ? 'red' : 'blue'}>{m}</Tag> },
                            { title: 'Khối KT', dataIndex: 'khoi' },
                            {
                                title: 'Thao tác',
                                render: (_, rec) => (
                                    <Button type="link" danger onClick={() => setCauHoi(cauHoi.filter(c => c.id !== rec.id))}>Xóa</Button>
                                )
                            }
                        ]} />
                    </Tabs.TabPane>

                    {/* TAB 3: ĐỀ THI */}
                    <Tabs.TabPane tab="3. Đề thi & Cấu trúc" key="3">
                        <Button type="primary" danger onClick={() => setIsModalDeThi(true)} style={{ marginBottom: 16 }}>
                            + Tạo đề thi tự động
                        </Button>
                        <Table dataSource={deThi} rowKey="id" columns={[
                            { title: 'Tên đề thi', dataIndex: 'tenDe' },
                            { title: 'Số câu', render: (_, rec) => rec.chiTiet.length },
                            {
                                title: 'Thao tác',
                                render: (_, rec) => (
                                    <Space>
                                        <Button type="link" onClick={() => Modal.info({
                                            title: rec.tenDe,
                                            width: 600,
                                            content: rec.chiTiet.map((c: any, i: number) => <p key={i}><b>Câu {i + 1}:</b> {c.noiDung}</p>)
                                        })}>Xem đề</Button>
                                        <Button type="link" danger onClick={() => setDeThi(deThi.filter(d => d.id !== rec.id))}>Hủy đề</Button>
                                    </Space>
                                )
                            }
                        ]} />
                    </Tabs.TabPane>
                </Tabs>
            </Card>

            <Modal title="Thêm học phần mới" visible={isModalMon} onOk={() => formMon.submit()} onCancel={() => setIsModalMon(false)}>
                <Form form={formMon} layout="vertical" onFinish={luuMonHoc}>
                    <Form.Item name="maMon" label="Mã môn học" rules={[{ required: true }]}><Input placeholder="VD: IT101" /></Form.Item>
                    <Form.Item name="tenMon" label="Tên môn học" rules={[{ required: true }]}><Input placeholder="VD: Lập trình Web" /></Form.Item>
                    <Form.Item name="tinChi" label="Số tín chỉ" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
                </Form>
            </Modal>

            <Modal title="Thêm câu hỏi mới" visible={isModalCauHoi} onOk={() => formCauHoi.submit()} onCancel={() => setIsModalCauHoi(false)}>
                <Form form={formCauHoi} layout="vertical" onFinish={luuCauHoi}>
                    <Form.Item name="maMon" label="Thuộc học phần" rules={[{ required: true }]}>
                        <Select options={monHoc.map((m: any) => ({ label: m.tenMon, value: m.maMon }))} />
                    </Form.Item>
                    <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
                    <Form.Item name="mucDo" label="Mức độ khó" rules={[{ required: true }]}>
                        <Select options={['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(v => ({ label: v, value: v }))} />
                    </Form.Item>
                    <Form.Item name="khoi" label="Khối kiến thức" rules={[{ required: true }]}>
                        <Select options={khoiKT.map((v: any) => ({ label: v, value: v }))} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Cấu trúc đề thi mong muốn" visible={isModalDeThi} onOk={() => formDeThi.submit()} onCancel={() => setIsModalDeThi(false)}>
                <Form form={formDeThi} layout="vertical" onFinish={xuLyTaoDe}>
                    <Form.Item name="maMon" label="Chọn môn thi" rules={[{ required: true }]}>
                        <Select options={monHoc.map((m: any) => ({ label: m.tenMon, value: m.maMon }))} />
                    </Form.Item>
                    <Form.Item name="soLuong" label="Số lượng câu hỏi" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="mucDo" label="Mức độ ưu tiên" rules={[{ required: true }]}>
                        <Select options={['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(v => ({ label: v, value: v }))} />
                    </Form.Item>
                    <Form.Item name="khoi" label="Khối kiến thức trọng tâm" rules={[{ required: true }]}>
                        <Select options={khoiKT.map((v: any) => ({ label: v, value: v }))} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BankManager;