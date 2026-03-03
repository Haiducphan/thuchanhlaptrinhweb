import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const OrderManager = () => {
    const { products, setProducts, orders, setOrders } = useModel('product');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleCreateOrder = (values: any) => {
        const orderItems = values.items || [];
        if (orderItems.length === 0) return message.warning('Vui lòng thêm sản phẩm!');

        let totalAmount = 0;
        // SỬA LỖI ĐỎ: Ép kiểu mảng để TypeScript không báo lỗi spread
        let updatedProducts = [...(products as any[])];

        for (const item of orderItems) {
            const productIdx = updatedProducts.findIndex((p: any) => p.id === item.productId);
            if (productIdx !== -1) {
                const p = updatedProducts[productIdx];
                if (p.quantity < item.quantity) {
                    return message.error(`Sản phẩm ${p.name} không đủ kho (Còn: ${p.quantity})`);
                }
                // Trừ số lượng tồn kho
                updatedProducts[productIdx] = { ...p, quantity: p.quantity - item.quantity };
                totalAmount += p.price * item.quantity;
            }
        }

        // Cập nhật lại kho hàng sang trang Sản phẩm
        setProducts(updatedProducts);

        // Lưu đơn hàng mới
        const newOrder = {
            id: 'DH' + Date.now(),
            customerName: values.customerName,
            totalAmount: totalAmount,
            status: 'Hoàn thành',
            createdAt: new Date().toLocaleString('vi-VN')
        };
        setOrders([newOrder, ...orders]);

        setIsModalOpen(false);
        form.resetFields();
        message.success('Tạo đơn thành công và đã trừ kho hàng!');
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2>Quản lý Đơn hàng</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Tạo đơn hàng</Button>
            </div>

            <Table
                columns={[
                    { title: 'Mã đơn', dataIndex: 'id' },
                    { title: 'Khách hàng', dataIndex: 'customerName' },
                    { title: 'Tổng tiền', dataIndex: 'totalAmount', render: (v: any) => v?.toLocaleString() + ' đ' },
                    { title: 'Trạng thái', render: () => <Tag color="green">Hoàn thành</Tag> },
                    { title: 'Ngày tạo', dataIndex: 'createdAt' }
                ]}
                dataSource={orders}
                rowKey="id"
            />

            <Modal
                title="Tạo đơn hàng mới"
                visible={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                width={700}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOrder}>
                    <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
                        <Input placeholder="Nguyễn Văn A" />
                    </Form.Item>

                    <Form.List name="items">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item {...restField} name={[name, 'productId']} rules={[{ required: true, message: 'Chọn SP' }]}>
                                            <Select placeholder="Sản phẩm" style={{ width: 300 }}>
                                                {(products as any[]).map((p: any) => (
                                                    <Select.Option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                                        {p.name} (Kho: {p.quantity})
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true, message: 'Nhập SL' }]}>
                                            <InputNumber min={1} placeholder="SL" />
                                        </Form.Item>
                                        <Button type="link" danger onClick={() => remove(name)}>Xóa</Button>
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm sản phẩm</Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default OrderManager;