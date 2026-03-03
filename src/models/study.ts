import { useState, useEffect } from 'react';

export default () => {
    const [danhSachMon, setDanhSachMon] = useState<any[]>(() => {
        const data = localStorage.getItem('mon_hoc_key');
        return data ? JSON.parse(data) : [
            { id: 1, name: 'Toán' }, { id: 2, name: 'Văn' }, { id: 3, name: 'Anh' }
        ];
    });

    const [nhatKyHoc, setNhatKyHoc] = useState<any[]>(() => {
        const data = localStorage.getItem('nhat_ky_key');
        return data ? JSON.parse(data) : [];
    });

    useEffect(() => {
        localStorage.setItem('mon_hoc_key', JSON.stringify(danhSachMon));
        localStorage.setItem('nhat_ky_key', JSON.stringify(nhatKyHoc));
    }, [danhSachMon, nhatKyHoc]);

    // Các hàm xử lý danh mục môn học
    const themMon = (name: string) => {
        setDanhSachMon([...danhSachMon, { id: Date.now(), name }]);
    };

    const suaMon = (id: number, name: string) => {
        setDanhSachMon(danhSachMon.map(m => m.id === id ? { ...m, name } : m));
    };

    const xoaMon = (id: number) => {
        setDanhSachMon(danhSachMon.filter(m => m.id !== id));
    };

    return { danhSachMon, setDanhSachMon, nhatKyHoc, setNhatKyHoc, themMon, suaMon, xoaMon };
};