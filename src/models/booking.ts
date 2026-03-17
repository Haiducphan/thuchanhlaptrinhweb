import { useState, useEffect } from 'react';

export default () => {
    // Quản lý nhân viên & giới hạn khách
    const [dsNhanVien, setDsNhanVien] = useState<any[]>(() =>
        JSON.parse(localStorage.getItem('booking_staff') || '[]')
    );

    // Quản lý dịch vụ & đơn giá
    const [dsDichVu, setDsDichVu] = useState<any[]>(() =>
        JSON.parse(localStorage.getItem('booking_services') || '[]')
    );

    // Quản lý lịch hẹn & trạng thái
    const [dsLichHen, setDsLichHen] = useState<any[]>(() =>
        JSON.parse(localStorage.getItem('booking_list') || '[]')
    );

    // Tự động lưu dữ liệu mỗi khi có thay đổi
    useEffect(() => {
        localStorage.setItem('booking_staff', JSON.stringify(dsNhanVien));
        localStorage.setItem('booking_services', JSON.stringify(dsDichVu));
        localStorage.setItem('booking_list', JSON.stringify(dsLichHen));
    }, [dsNhanVien, dsDichVu, dsLichHen]);

    return {
        dsNhanVien, setDsNhanVien,
        dsDichVu, setDsDichVu,
        dsLichHen, setDsLichHen,
    };
};