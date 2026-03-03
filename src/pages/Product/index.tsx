import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const ProductManager = () => {
    const { products, deleteProduct, saveProduct } = useModel('product');
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        saveProduct(values);
        setIsModalOpen(false);
        form.resetFields();
        message.success('Đã lưu thay đổi!');
    };

    const columns = [
        { title: 'STT', render: (_: any, __: any, index: number) => index + 1 },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Danh mục', dataIndex: 'category', key: 'category' },
        { title: 'Giá', dataIndex: 'price', render: (v: number) => v.toLocaleString() + ' đ' },
        { title: 'Tồn kho', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Trạng thái',
            dataIndex: 'quantity',
            render: (qty: number) => {
                if (qty > 10) return <Tag color="green">Còn hàng</Tag>;
                if (qty >= 1) return <Tag color="orange">Sắp hết</Tag>;
                return <Tag color="red">Hết hàng</Tag>;
            }
        },
        {
            title: 'Thao tác',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" onClick={() => {
                        form.setFieldsValue(record); // QUAN TRỌNG: Đổ dữ liệu vào form
                        setIsModalOpen(true);
                    }}>
                        Sửa
                    </Button>
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => deleteProduct(record.id)}>
                        <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Input
                    placeholder="Tìm tên sản phẩm..."
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    form.resetFields();
                    setIsModalOpen(true);
                }}>
                    Thêm sản phẩm
                </Button>
            </div>

            <Table columns={columns} dataSource={products.filter((p: any) => p.name.toLowerCase().includes(searchText.toLowerCase()))} rowKey="id" />

            <Modal
                title={form.getFieldValue('id') ? "Sửa sản phẩm" : "Thêm sản phẩm"}
                visible={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    {/* Trường ID ẩn để Model biết đang sửa dòng nào */}
                    <Form.Item name="id" hidden><Input /></Form.Item>

                    <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="quantity" label="Số lượng tồn kho" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

nv
export default ProductManager;