import { useState } from 'react';

export interface KhoaHoc {
  id: string;
  tenKhoaHoc: string;
  giangVien: string;
  soLuongHocVien: number;
  moTa: string;
  trangThai: 'DANG_MO' | 'DA_KET_THUC' | 'TAM_DUNG';
  ngayTao: string;
  ngayCapNhat: string;
}

const giangVienList = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E'];

const trangThaiList = ['DANG_MO', 'DA_KET_THUC', 'TAM_DUNG'];

const trangThaiLabel: Record<string, string> = {
  DANG_MO: 'Đang mở',
  DA_KET_THUC: 'Đã kết thúc',
  TAM_DUNG: 'Tạm dừng',
};

const trangThaiColor: Record<string, string> = {
  DANG_MO: 'green',
  DA_KET_THUC: 'red',
  TAM_DUNG: 'orange',
};

const khoaHocMock: KhoaHoc[] = [
  {
    id: '1',
    tenKhoaHoc: 'Lập trình React JS',
    giangVien: 'Nguyễn Văn A',
    soLuongHocVien: 120,
    moTa: '<p>Khóa học React JS cơ bản cho người mới bắt đầu</p>',
    trangThai: 'DANG_MO',
    ngayTao: '2024-01-10 08:30',
    ngayCapNhat: '2024-03-15 14:20',
  },
  {
    id: '2',
    tenKhoaHoc: 'Python cho người mới',
    giangVien: 'Trần Thị B',
    soLuongHocVien: 85,
    moTa: '<p>Học lập trình Python từ con số 0</p>',
    trangThai: 'DANG_MO',
    ngayTao: '2024-02-05 09:00',
    ngayCapNhat: '2024-03-20 10:00',
  },
  {
    id: '3',
    tenKhoaHoc: 'NodeJS Backend',
    giangVien: 'Lê Văn C',
    soLuongHocVien: 60,
    moTa: '<p>Xây dựng API với NodeJS và Express</p>',
    trangThai: 'DA_KET_THUC',
    ngayTao: '2023-11-01 10:00',
    ngayCapNhat: '2024-01-20 16:30',
  },
  {
    id: '4',
    tenKhoaHoc: 'UI/UX Design cơ bản',
    giangVien: 'Phạm Thị D',
    soLuongHocVien: 45,
    moTa: '<p>Thiết kế giao diện người dùng chuyên nghiệp</p>',
    trangThai: 'TAM_DUNG',
    ngayTao: '2024-01-25 11:00',
    ngayCapNhat: '2024-02-28 09:45',
  },
  {
    id: '5',
    tenKhoaHoc: 'Docker & Kubernetes',
    giangVien: 'Hoàng Văn E',
    soLuongHocVien: 30,
    moTa: '<p>Triển khai ứng dụng với Docker và Kubernetes</p>',
    trangThai: 'DANG_MO',
    ngayTao: '2024-03-01 08:00',
    ngayCapNhat: '2024-03-18 15:10',
  },
  {
    id: '6',
    tenKhoaHoc: 'Machine Learning cơ bản',
    giangVien: 'Nguyễn Văn A',
    soLuongHocVien: 55,
    moTa: '<p>Giới thiệu về Machine Learning với Python</p>',
    trangThai: 'DA_KET_THUC',
    ngayTao: '2023-09-15 10:30',
    ngayCapNhat: '2023-12-20 11:00',
  },
  {
    id: '7',
    tenKhoaHoc: 'MongoDB NoSQL',
    giangVien: 'Trần Thị B',
    soLuongHocVien: 40,
    moTa: '<p>Thiết kế và truy vấn cơ sở dữ liệu MongoDB</p>',
    trangThai: 'TAM_DUNG',
    ngayTao: '2024-02-10 13:00',
    ngayCapNhat: '2024-03-05 08:30',
  },
  {
    id: '8',
    tenKhoaHoc: 'TypeScript nâng cao',
    giangVien: 'Lê Văn C',
    soLuongHocVien: 70,
    moTa: '<p>Tìm hiểu TypeScript từ trung bình đến nâng cao</p>',
    trangThai: 'DANG_MO',
    ngayTao: '2024-02-20 14:00',
    ngayCapNhat: '2024-03-22 16:00',
  },
];

const LS_KEY = 'khoa_hoc_data';

const getStorage = (): KhoaHoc[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return khoaHocMock;
};

export const useKhoaHocModel = () => {
  const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<KhoaHoc[]>(getStorage());

  const layIdLonNhat = (list: KhoaHoc[]) => {
    if (list.length === 0) return 0;
    return Math.max(...list.map((k) => parseInt(k.id, 10)));
  };

  const now = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const saveStorage = (data: KhoaHoc[]) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (_) {}
  };

  const themKhoaHoc = (khoaHoc: Omit<KhoaHoc, 'id' | 'ngayTao' | 'ngayCapNhat'>) => {
    const moi: KhoaHoc = { ...khoaHoc, id: String(layIdLonNhat(danhSachKhoaHoc) + 1), ngayTao: now(), ngayCapNhat: now() };
    setDanhSachKhoaHoc((prev) => {
      const newData = [...prev, moi];
      saveStorage(newData);
      return newData;
    });
    return moi;
  };

  const suaKhoaHoc = (id: string, duLieu: Partial<KhoaHoc>) => {
    setDanhSachKhoaHoc((prev) => {
      const newData = prev.map((k) => (k.id === id ? { ...k, ...duLieu, ngayCapNhat: now() } : k));
      saveStorage(newData);
      return newData;
    });
  };

  const xoaKhoaHoc = (id: string) => {
    setDanhSachKhoaHoc((prev) => {
      const newData = prev.filter((k) => k.id !== id);
      saveStorage(newData);
      return newData;
    });
  };

  const kiemTraTenTrung = (ten: string, idLoaiBo?: string) => {
    return danhSachKhoaHoc.some(
      (k) => k.tenKhoaHoc.toLowerCase() === ten.toLowerCase() && k.id !== idLoaiBo
    );
  };

  return {
    danhSachKhoaHoc,
    giangVienList,
    trangThaiList,
    trangThaiLabel,
    trangThaiColor,
    themKhoaHoc,
    suaKhoaHoc,
    xoaKhoaHoc,
    kiemTraTenTrung,
  };
};
