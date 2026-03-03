import { useState, useEffect } from 'react';

export default () => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
            { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
            { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
            { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
            { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
            { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
        ];
    });

    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('orders');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [products, orders]);

    const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

    const saveProduct = (values) => {
        const formatted = {
            ...values,
            price: Number(values.price),
            quantity: Number(values.quantity)
        };

        setProducts((prev) => {
            // Nếu có ID trong values nghĩa là đang SỬA
            if (values.id) {
                return prev.map((item) =>
                    String(item.id) === String(values.id) ? { ...item, ...formatted } : item
                );
            }
            // Nếu không có ID nghĩa là THÊM MỚI
            return [...prev, { ...formatted, id: Date.now() }];
        });
    };

    return { products, setProducts, orders, setOrders, deleteProduct, saveProduct };
};