import { useState, useEffect } from 'react';

export default () => {
    const [khoiKT, setKhoiKT] = useState<any[]>(() => JSON.parse(localStorage.getItem('khoi_kt') || '["Tổng quan", "Chuyên sâu", "Nâng cao"]'));
    const [monHoc, setMonHoc] = useState<any[]>(() => JSON.parse(localStorage.getItem('mon_hoc_list') || '[]'));
    const [cauHoi, setCauHoi] = useState<any[]>(() => JSON.parse(localStorage.getItem('cau_hoi_list') || '[]'));
    const [deThi, setDeThi] = useState<any[]>(() => JSON.parse(localStorage.getItem('de_thi_list') || '[]'));

    useEffect(() => {
        localStorage.setItem('khoi_kt', JSON.stringify(khoiKT));
        localStorage.setItem('mon_hoc_list', JSON.stringify(monHoc));
        localStorage.setItem('cau_hoi_list', JSON.stringify(cauHoi));
        localStorage.setItem('de_thi_list', JSON.stringify(deThi));
    }, [khoiKT, monHoc, cauHoi, deThi]);

    return { khoiKT, setKhoiKT, monHoc, setMonHoc, cauHoi, setCauHoi, deThi, setDeThi };
};