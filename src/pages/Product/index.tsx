import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const ProductManager = () => {
    // 1. Dữ liệu mẫu khởi tạo
    const [products, setProducts] = useState([
        { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
        { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
        { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
        { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
        { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
    ]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    // 2. Thêm sản phẩm mới
    const handleAdd = (values) => {
        const newProduct = { ...values, id: Date.now() };
        setProducts([...products, newProduct]);
        setIsModalOpen(false);
        form.resetFields();
        message.success('Thêm sản phẩm thành công!');
    };

    // 3. Xóa sản phẩm
    const handleDelete = (id) => {
        setProducts(products.filter(item => item.id !== id));
        message.success('Xóa sản phẩm thành công!');
    };

    // Cấu hình các cột của Table
    const columns = [
        { title: 'STT', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1 },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: (val) => val.toLocaleString() + ' đ' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
                    <Button type="link" danger>Xóa</Button>
                </Popconfirm>
            ),
        },
    ];

    // 4. Tìm kiếm sản phẩm
    const filteredData = products.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
                <Input
                    placeholder="Tìm theo tên sản phẩm..."
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Thêm sản phẩm
                </Button>
            </Space>

            <Table columns={columns} dataSource={filteredData} rowKey="id" />

            <Modal
                title="Thêm sản phẩm mới"
                visible={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical" onFinish={handleAdd}>
                    <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Bắt buộc nhập tên!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Giá" rules={[{ required: true, type: 'number', min: 1, message: 'Giá phải là số dương!' }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương!' }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManager;