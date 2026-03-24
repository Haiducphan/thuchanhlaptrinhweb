/**
 * Mock data store cho QLVB - lưu trữ in-memory
 * Không cần database thật, tất cả dữ liệu được quản lý trong bộ nhớ
 */

// ===== Type definitions =====
export interface ISoVanBang {
  _id: string;
  nam: number;
  ten_so?: string;
  ghi_chu?: string;
  createdAt?: string;
}

export interface IQuyetDinh {
  _id: string;
  so_quyet_dinh: string;
  ngay_ban_hanh: string;
  trich_yeu: string;
  so_van_bang_id?: string;
  so_luot_tra_cuu?: number;
  soVanBang?: { _id: string; nam: number; ten_so?: string };
  createdAt?: string;
}

export interface ITruongCauHinh {
  _id: string;
  ten_truong: string;
  kieu_du_lieu: 'String' | 'Number' | 'Date';
  thu_tu_hien_thi?: number;
  bat_buoc?: boolean;
  createdAt?: string;
}

export interface IChiTietVanBang {
  _id: string;
  truong_cau_hinh_id: string;
  truongCauHinh?: ITruongCauHinh;
  gia_tri?: string;
}

export interface IVanBang {
  _id: string;
  quyet_dinh_id?: string;
  quyetDinh?: IQuyetDinh;
  so_vao_so?: number;
  so_hieu_van_bang: string;
  ma_sinh_vien: string;
  ho_ten: string;
  ngay_sinh?: string;
  chiTietList?: IChiTietVanBang[];
  createdAt?: string;
}

// ===== Helper =====
const genId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
const now = () => new Date().toISOString();

// ===== Initial Mock Data =====
let store: {
  soVanBang: ISoVanBang[];
  quyetDinh: IQuyetDinh[];
  truongCauHinh: ITruongCauHinh[];
  vanBang: IVanBang[];
} = {
  soVanBang: [
    {
      _id: 'svb-001',
      nam: 2025,
      ten_so: 'Sổ văn bằng tốt nghiệp năm 2025',
      ghi_chu: 'Dùng cho khóa sinh viên 2021-2025',
      createdAt: '2025-01-10T08:00:00.000Z',
    },
    {
      _id: 'svb-002',
      nam: 2024,
      ten_so: 'Sổ văn bằng tốt nghiệp năm 2024',
      ghi_chu: 'Dùng cho khóa sinh viên 2020-2024',
      createdAt: '2024-01-08T09:30:00.000Z',
    },
    {
      _id: 'svb-003',
      nam: 2026,
      ten_so: 'Sổ văn bằng tốt nghiệp năm 2026',
      ghi_chu: 'Dùng cho khóa sinh viên 2022-2026',
      createdAt: '2026-01-05T10:00:00.000Z',
    },
  ],

  quyetDinh: [
    {
      _id: 'qd-001',
      so_quyet_dinh: '1256/QĐ-ĐHCN',
      ngay_ban_hanh: '2025-06-15',
      trich_yeu: 'Quyết định công nhận tốt nghiệp đợt 1 năm 2025 cho sinh viên khóa 2021-2025',
      so_van_bang_id: 'svb-001',
      so_luot_tra_cuu: 42,
      soVanBang: { _id: 'svb-001', nam: 2025, ten_so: 'Sổ văn bằng tốt nghiệp năm 2025' },
      createdAt: '2025-06-15T14:00:00.000Z',
    },
    {
      _id: 'qd-002',
      so_quyet_dinh: '1302/QĐ-ĐHCN',
      ngay_ban_hanh: '2025-07-20',
      trich_yeu: 'Quyết định công nhận tốt nghiệp đợt 2 năm 2025',
      so_van_bang_id: 'svb-001',
      so_luot_tra_cuu: 18,
      soVanBang: { _id: 'svb-001', nam: 2025, ten_so: 'Sổ văn bằng tốt nghiệp năm 2025' },
      createdAt: '2025-07-20T10:00:00.000Z',
    },
    {
      _id: 'qd-003',
      so_quyet_dinh: '0988/QĐ-ĐHCN',
      ngay_ban_hanh: '2024-06-10',
      trich_yeu: 'Quyết định công nhận tốt nghiệp đợt 1 năm 2024 cho sinh viên khóa 2020-2024',
      so_van_bang_id: 'svb-002',
      so_luot_tra_cuu: 156,
      soVanBang: { _id: 'svb-002', nam: 2024, ten_so: 'Sổ văn bằng tốt nghiệp năm 2024' },
      createdAt: '2024-06-10T08:00:00.000Z',
    },
    {
      _id: 'qd-004',
      so_quyet_dinh: '0156/QĐ-ĐHCN',
      ngay_ban_hanh: '2026-03-01',
      trich_yeu: 'Quyết định công nhận tốt nghiệp đợt 1 năm 2026',
      so_van_bang_id: 'svb-003',
      so_luot_tra_cuu: 5,
      soVanBang: { _id: 'svb-003', nam: 2026, ten_so: 'Sổ văn bằng tốt nghiệp năm 2026' },
      createdAt: '2026-03-01T09:00:00.000Z',
    },
  ],

  truongCauHinh: [
    {
      _id: 'tch-001',
      ten_truong: 'Dân tộc',
      kieu_du_lieu: 'String',
      thu_tu_hien_thi: 1,
      bat_buoc: false,
      createdAt: '2025-01-10T08:30:00.000Z',
    },
    {
      _id: 'tch-002',
      ten_truong: 'Điểm trung bình',
      kieu_du_lieu: 'Number',
      thu_tu_hien_thi: 2,
      bat_buoc: true,
      createdAt: '2025-01-10T08:31:00.000Z',
    },
    {
      _id: 'tch-003',
      ten_truong: 'Ngày cấp bằng',
      kieu_du_lieu: 'Date',
      thu_tu_hien_thi: 3,
      bat_buoc: true,
      createdAt: '2025-01-10T08:32:00.000Z',
    },
    {
      _id: 'tch-004',
      ten_truong: 'Xếp loại tốt nghiệp',
      kieu_du_lieu: 'String',
      thu_tu_hien_thi: 4,
      bat_buoc: false,
      createdAt: '2025-01-10T08:33:00.000Z',
    },
    {
      _id: 'tch-005',
      ten_truong: 'Nơi sinh',
      kieu_du_lieu: 'String',
      thu_tu_hien_thi: 5,
      bat_buoc: false,
      createdAt: '2025-01-10T08:34:00.000Z',
    },
    {
      _id: 'tch-006',
      ten_truong: 'Số tốt nghiệp',
      kieu_du_lieu: 'String',
      thu_tu_hien_thi: 6,
      bat_buoc: true,
      createdAt: '2025-01-10T08:35:00.000Z',
    },
  ],

  vanBang: [
    {
      _id: 'vb-001',
      quyet_dinh_id: 'qd-001',
      so_vao_so: 1,
      so_hieu_van_bang: 'YD-2025-000001',
      ma_sinh_vien: 'B2100001',
      ho_ten: 'Nguyễn Văn An',
      ngay_sinh: '2003-05-12',
      createdAt: '2025-06-16T10:00:00.000Z',
      quyetDinh: {
        _id: 'qd-001',
        so_quyet_dinh: '1256/QĐ-ĐHCN',
        ngay_ban_hanh: '2025-06-15',
        trich_yeu: 'Quyết định công nhận tốt nghiệp đợt 1 năm 2025',
        soVanBang: { _id: 'svb-001', nam: 2025 },
      },
      chiTietList: [
        { _id: 'ct-001', truong_cau_hinh_id: 'tch-001', gia_tri: 'Kinh', truongCauHinh: { _id: 'tch-001', ten_truong: 'Dân tộc', kieu_du_lieu: 'String' } },
        { _id: 'ct-002', truong_cau_hinh_id: 'tch-002', gia_tri: '8.5', truongCauHinh: { _id: 'tch-002', ten_truong: 'Điểm trung bình', kieu_du_lieu: 'Number' } },
        { _id: 'ct-003', truong_cau_hinh_id: 'tch-003', gia_tri: '2025-06-20', truongCauHinh: { _id: 'tch-003', ten_truong: 'Ngày cấp bằng', kieu_du_lieu: 'Date' } },
        { _id: 'ct-004', truong_cau_hinh_id: 'tch-004', gia_tri: 'Giỏi', truongCauHinh: { _id: 'tch-004', ten_truong: 'Xếp loại tốt nghiệp', kieu_du_lieu: 'String' } },
        { _id: 'ct-005', truong_cau_hinh_id: 'tch-005', gia_tri: 'Hà Nội', truongCauHinh: { _id: 'tch-005', ten_truong: 'Nơi sinh', kieu_du_lieu: 'String' } },
        { _id: 'ct-006', truong_cau_hinh_id: 'tch-006', gia_tri: 'GTTT-2025-0001', truongCauHinh: { _id: 'tch-006', ten_truong: 'Số tốt nghiệp', kieu_du_lieu: 'String' } },
      ],
    },
    {
      _id: 'vb-002',
      quyet_dinh_id: 'qd-001',
      so_vao_so: 2,
      so_hieu_van_bang: 'YD-2025-000002',
      ma_sinh_vien: 'B2100002',
      ho_ten: 'Trần Thị Bình',
      ngay_sinh: '2003-08-20',
      createdAt: '2025-06-16T10:05:00.000Z',
      quyetDinh: {
        _id: 'qd-001',
        so_quyet_dinh: '1256/QĐ-ĐHCN',
        ngay_ban_hanh: '2025-06-15',
        trich_yeu: 'Quyết định công nhận tốt nghiệp đợt 1 năm 2025',
        soVanBang: { _id: 'svb-001', nam: 2025 },
      },
      chiTietList: [
        { _id: 'ct-007', truong_cau_hinh_id: 'tch-001', gia_tri: 'Kinh', truongCauHinh: { _id: 'tch-001', ten_truong: 'Dân tộc', kieu_du_lieu: 'String' } },
        { _id: 'ct-008', truong_cau_hinh_id: 'tch-002', gia_tri: '7.8', truongCauHinh: { _id: 'tch-002', ten_truong: 'Điểm trung bình', kieu_du_lieu: 'Number' } },
        { _id: 'ct-009', truong_cau_hinh_id: 'tch-003', gia_tri: '2025-06-20', truongCauHinh: { _id: 'tch-003', ten_truong: 'Ngày cấp bằng', kieu_du_lieu: 'Date' } },
        { _id: 'ct-010', truong_cau_hinh_id: 'tch-004', gia_tri: 'Khá', truongCauHinh: { _id: 'tch-004', ten_truong: 'Xếp loại tốt nghiệp', kieu_du_lieu: 'String' } },
        { _id: 'ct-011', truong_cau_hinh_id: 'tch-005', gia_tri: 'TP.HCM', truongCauHinh: { _id: 'tch-005', ten_truong: 'Nơi sinh', kieu_du_lieu: 'String' } },
        { _id: 'ct-012', truong_cau_hinh_id: 'tch-006', gia_tri: 'GTTT-2025-0002', truongCauHinh: { _id: 'tch-006', ten_truong: 'Số tốt nghiệp', kieu_du_lieu: 'String' } },
      ],
    },
    {
      _id: 'vb-003',
      quyet_dinh_id: 'qd-002',
      so_vao_so: 3,
      so_hieu_van_bang: 'YD-2025-000003',
      ma_sinh_vien: 'B2100015',
      ho_ten: 'Lê Hoàng Cường',
      ngay_sinh: '2003-03-05',
      createdAt: '2025-07-21T11:00:00.000Z',
      quyetDinh: {
        _id: 'qd-002',
        so_quyet_dinh: '1302/QĐ-ĐHCN',
        ngay_ban_hanh: '2025-07-20',
        trich_yeu: 'Quyết định công nhận tốt nghiệp đợt 2 năm 2025',
        soVanBang: { _id: 'svb-001', nam: 2025 },
      },
      chiTietList: [
        { _id: 'ct-013', truong_cau_hinh_id: 'tch-001', gia_tri: 'Tày', truongCauHinh: { _id: 'tch-001', ten_truong: 'Dân tộc', kieu_du_lieu: 'String' } },
        { _id: 'ct-014', truong_cau_hinh_id: 'tch-002', gia_tri: '9.1', truongCauHinh: { _id: 'tch-002', ten_truong: 'Điểm trung bình', kieu_du_lieu: 'Number' } },
        { _id: 'ct-015', truong_cau_hinh_id: 'tch-003', gia_tri: '2025-07-25', truongCauHinh: { _id: 'tch-003', ten_truong: 'Ngày cấp bằng', kieu_du_lieu: 'Date' } },
        { _id: 'ct-016', truong_cau_hinh_id: 'tch-004', gia_tri: 'Xuất sắc', truongCauHinh: { _id: 'tch-004', ten_truong: 'Xếp loại tốt nghiệp', kieu_du_lieu: 'String' } },
        { _id: 'ct-017', truong_cau_hinh_id: 'tch-005', gia_tri: 'Lào Cai', truongCauHinh: { _id: 'tch-005', ten_truong: 'Nơi sinh', kieu_du_lieu: 'String' } },
        { _id: 'ct-018', truong_cau_hinh_id: 'tch-006', gia_tri: 'GTTT-2025-0003', truongCauHinh: { _id: 'tch-006', ten_truong: 'Số tốt nghiệp', kieu_du_lieu: 'String' } },
      ],
    },
    {
      _id: 'vb-004',
      quyet_dinh_id: 'qd-003',
      so_vao_so: 1,
      so_hieu_van_bang: 'YD-2024-000001',
      ma_sinh_vien: 'B2000001',
      ho_ten: 'Phạm Đình Chung',
      ngay_sinh: '2002-11-15',
      createdAt: '2024-06-11T10:00:00.000Z',
      quyetDinh: {
        _id: 'qd-003',
        so_quyet_dinh: '0988/QĐ-ĐHCN',
        ngay_ban_hanh: '2024-06-10',
        trich_yeu: 'Quyết định công nhận tốt nghiệp đợt 1 năm 2024',
        soVanBang: { _id: 'svb-002', nam: 2024 },
      },
      chiTietList: [
        { _id: 'ct-019', truong_cau_hinh_id: 'tch-001', gia_tri: 'Kinh', truongCauHinh: { _id: 'tch-001', ten_truong: 'Dân tộc', kieu_du_lieu: 'String' } },
        { _id: 'ct-020', truong_cau_hinh_id: 'tch-002', gia_tri: '8.2', truongCauHinh: { _id: 'tch-002', ten_truong: 'Điểm trung bình', kieu_du_lieu: 'Number' } },
        { _id: 'ct-021', truong_cau_hinh_id: 'tch-003', gia_tri: '2024-06-15', truongCauHinh: { _id: 'tch-003', ten_truong: 'Ngày cấp bằng', kieu_du_lieu: 'Date' } },
        { _id: 'ct-022', truong_cau_hinh_id: 'tch-004', gia_tri: 'Giỏi', truongCauHinh: { _id: 'tch-004', ten_truong: 'Xếp loại tốt nghiệp', kieu_du_lieu: 'String' } },
        { _id: 'ct-023', truong_cau_hinh_id: 'tch-005', gia_tri: 'Hải Phòng', truongCauHinh: { _id: 'tch-005', ten_truong: 'Nơi sinh', kieu_du_lieu: 'String' } },
        { _id: 'ct-024', truong_cau_hinh_id: 'tch-006', gia_tri: 'GTTT-2024-0001', truongCauHinh: { _id: 'tch-006', ten_truong: 'Số tốt nghiệp', kieu_du_lieu: 'String' } },
      ],
    },
    {
      _id: 'vb-005',
      quyet_dinh_id: 'qd-003',
      so_vao_so: 2,
      so_hieu_van_bang: 'YD-2024-000002',
      ma_sinh_vien: 'B2000005',
      ho_ten: 'Hoàng Minh Đức',
      ngay_sinh: '2002-07-22',
      createdAt: '2024-06-11T10:10:00.000Z',
      quyetDinh: {
        _id: 'qd-003',
        so_quyet_dinh: '0988/QĐ-ĐHCN',
        ngay_ban_hanh: '2024-06-10',
        trich_yeu: 'Quyết định công nhận tốt nghiệp đợt 1 năm 2024',
        soVanBang: { _id: 'svb-002', nam: 2024 },
      },
      chiTietList: [
        { _id: 'ct-025', truong_cau_hinh_id: 'tch-001', gia_tri: 'Kinh', truongCauHinh: { _id: 'tch-001', ten_truong: 'Dân tộc', kieu_du_lieu: 'String' } },
        { _id: 'ct-026', truong_cau_hinh_id: 'tch-002', gia_tri: '7.5', truongCauHinh: { _id: 'tch-002', ten_truong: 'Điểm trung bình', kieu_du_lieu: 'Number' } },
        { _id: 'ct-027', truong_cau_hinh_id: 'tch-003', gia_tri: '2024-06-15', truongCauHinh: { _id: 'tch-003', ten_truong: 'Ngày cấp bằng', kieu_du_lieu: 'Date' } },
        { _id: 'ct-028', truong_cau_hinh_id: 'tch-004', gia_tri: 'Khá', truongCauHinh: { _id: 'tch-004', ten_truong: 'Xếp loại tốt nghiệp', kieu_du_lieu: 'String' } },
        { _id: 'ct-029', truong_cau_hinh_id: 'tch-005', gia_tri: 'Đà Nẵng', truongCauHinh: { _id: 'tch-005', ten_truong: 'Nơi sinh', kieu_du_lieu: 'String' } },
        { _id: 'ct-030', truong_cau_hinh_id: 'tch-006', gia_tri: 'GTTT-2024-0002', truongCauHinh: { _id: 'tch-006', ten_truong: 'Số tốt nghiệp', kieu_du_lieu: 'String' } },
      ],
    },
  ],
};

// ===== Store Accessor =====
export const getStore = () => store;

// ===== CRUD Operations =====

// --- SO VAN BANG ---
export const soVanBangCrud = {
  page: (params: any = {}) => {
    const { page = 1, limit = 10, condition = {}, sort = { nam: -1 }, filters = [] } = params;
    let data = [...store.soVanBang];

    // filter by condition
    if (condition.nam) data = data.filter((i) => i.nam === condition.nam);

    // filter by search
    filters.forEach((f: any) => {
      if (f.operator === 'CONTAIN' && f.values?.[0]) {
        const val = f.values[0].toLowerCase();
        data = data.filter((i) => {
          const fieldVal = f.field.includes('.') ? (i as any)[f.field.split('.')[1]] : (i as any)[f.field];
          return String(fieldVal || '').toLowerCase().includes(val);
        });
      }
    });

    // sort
    if (sort) {
      const [[key, order]] = Object.entries(sort);
      data.sort((a, b) => {
        const av = (a as any)[key];
        const bv = (b as any)[key];
        if (av < bv) return order === 1 ? -1 : 1;
        if (av > bv) return order === 1 ? 1 : -1;
        return 0;
      });
    }

    const total = data.length;
    const start = (page - 1) * limit;
    const result = data.slice(start, start + limit);
    return { data: { data: { result, total } } };
  },
  many: (params: any = {}) => {
    let data = [...store.soVanBang];
    const { condition = {}, sort } = params;
    if (condition.nam) data = data.filter((i) => i.nam === condition.nam);
    if (sort) {
      const [[key, order]] = Object.entries(sort);
      data.sort((a, b) => {
        const av = (a as any)[key];
        const bv = (b as any)[key];
        if (av < bv) return order === 1 ? -1 : 1;
        if (av > bv) return order === 1 ? 1 : -1;
        return 0;
      });
    }
    return { data: { data } };
  },
  getById: (id: string) => {
    const item = store.soVanBang.find((i) => i._id === id);
    return { data: { data: item || null } };
  },
  post: (payload: Partial<ISoVanBang>) => {
    const newItem: ISoVanBang = { ...payload, _id: genId(), createdAt: now() } as ISoVanBang;
    store.soVanBang.push(newItem);
    return { data: { data: newItem } };
  },
  put: (id: string, payload: Partial<ISoVanBang>) => {
    const idx = store.soVanBang.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Not found');
    store.soVanBang[idx] = { ...store.soVanBang[idx], ...payload };
    return { data: { data: store.soVanBang[idx] } };
  },
  delete: (id: string) => {
    const idx = store.soVanBang.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Not found');
    store.soVanBang.splice(idx, 1);
    return { data: { success: true } };
  },
};

// --- QUYET DINH ---
export const quyetDinhCrud = {
  page: (params: any = {}) => {
    const { page = 1, limit = 10, condition = {}, sort = { ngay_ban_hanh: -1 }, filters = [] } = params;
    let data = store.quyetDinh.map((qd) => {
      const svb = store.soVanBang.find((s) => s._id === qd.so_van_bang_id);
      return { ...qd, soVanBang: svb ? { _id: svb._id, nam: svb.nam, ten_so: svb.ten_so } : undefined };
    });

    if (condition.so_van_bang_id) data = data.filter((i) => i.so_van_bang_id === condition.so_van_bang_id);

    filters.forEach((f: any) => {
      if (f.operator === 'CONTAIN' && f.values?.[0]) {
        const val = f.values[0].toLowerCase();
        data = data.filter((i) => {
          const fieldVal = (i as any)[f.field];
          return String(fieldVal || '').toLowerCase().includes(val);
        });
      }
    });

    if (sort) {
      const [[key, order]] = Object.entries(sort);
      data.sort((a, b) => {
        const av = (a as any)[key];
        const bv = (b as any)[key];
        if (av < bv) return order === 1 ? -1 : 1;
        if (av > bv) return order === 1 ? 1 : -1;
        return 0;
      });
    }

    const total = data.length;
    const start = (page - 1) * limit;
    const result = data.slice(start, start + limit);
    return { data: { data: { result, total } } };
  },
  many: (params: any = {}) => {
    let data = [...store.quyetDinh];
    const { sort } = params;
    if (sort) {
      const [[key, order]] = Object.entries(sort);
      data.sort((a, b) => {
        const av = (a as any)[key];
        const bv = (b as any)[key];
        if (av < bv) return order === 1 ? -1 : 1;
        if (av > bv) return order === 1 ? 1 : -1;
        return 0;
      });
    }
    return { data: { data } };
  },
  getById: (id: string) => {
    const item = store.quyetDinh.find((i) => i._id === id);
    const svb = item ? store.soVanBang.find((s) => s._id === item.so_van_bang_id) : undefined;
    return { data: { data: item ? { ...item, soVanBang: svb } : null } };
  },
  post: (payload: Partial<IQuyetDinh>) => {
    const svb = payload.so_van_bang_id ? store.soVanBang.find((s) => s._id === payload.so_van_bang_id) : undefined;
    const newItem: IQuyetDinh = {
      ...payload,
      _id: genId(),
      so_luot_tra_cuu: 0,
      soVanBang: svb ? { _id: svb._id, nam: svb.nam, ten_so: svb.ten_so } : undefined,
      createdAt: now(),
    } as IQuyetDinh;
    store.quyetDinh.push(newItem);
    return { data: { data: newItem } };
  },
  put: (id: string, payload: Partial<IQuyetDinh>) => {
    const idx = store.quyetDinh.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Not found');
    const svb = payload.so_van_bang_id ? store.soVanBang.find((s) => s._id === payload.so_van_bang_id) : undefined;
    store.quyetDinh[idx] = {
      ...store.quyetDinh[idx],
      ...payload,
      soVanBang: svb ? { _id: svb._id, nam: svb.nam, ten_so: svb.ten_so } : undefined,
    };
    return { data: { data: store.quyetDinh[idx] } };
  },
  delete: (id: string) => {
    const idx = store.quyetDinh.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Not found');
    store.quyetDinh.splice(idx, 1);
    return { data: { success: true } };
  },
};

// --- TRUONG CAU HINH ---
export const truongCauHinhCrud = {
  page: (params: any = {}) => {
    const { page = 1, limit = 10, sort = { thu_tu_hien_thi: 1 }, filters = [] } = params;
    let data = [...store.truongCauHinh];

    filters.forEach((f: any) => {
      if (f.operator === 'CONTAIN' && f.values?.[0]) {
        const val = f.values[0].toLowerCase();
        data = data.filter((i) => {
          const fieldVal = (i as any)[f.field];
          return String(fieldVal || '').toLowerCase().includes(val);
        });
      }
    });

    if (sort) {
      const [[key, order]] = Object.entries(sort);
      data.sort((a, b) => {
        const av = (a as any)[key];
        const bv = (b as any)[key];
        if (av < bv) return order === 1 ? -1 : 1;
        if (av > bv) return order === 1 ? 1 : -1;
        return 0;
      });
    }

    const total = data.length;
    const start = (page - 1) * limit;
    const result = data.slice(start, start + limit);
    return { data: { data: { result, total } } };
  },
  many: (params: any = {}) => {
    let data = [...store.truongCauHinh];
    const { sort = { thu_tu_hien_thi: 1 } } = params;
    if (sort) {
      const [[key, order]] = Object.entries(sort);
      data.sort((a, b) => {
        const av = (a as any)[key];
        const bv = (b as any)[key];
        if (av < bv) return order === 1 ? -1 : 1;
        if (av > bv) return order === 1 ? 1 : -1;
        return 0;
      });
    }
    return { data: { data } };
  },
  getById: (id: string) => {
    const item = store.truongCauHinh.find((i) => i._id === id);
    return { data: { data: item || null } };
  },
  post: (payload: Partial<ITruongCauHinh>) => {
    const newItem: ITruongCauHinh = { ...payload, _id: genId(), createdAt: now() } as ITruongCauHinh;
    store.truongCauHinh.push(newItem);
    return { data: { data: newItem } };
  },
  put: (id: string, payload: Partial<ITruongCauHinh>) => {
    const idx = store.truongCauHinh.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Not found');
    store.truongCauHinh[idx] = { ...store.truongCauHinh[idx], ...payload };
    return { data: { data: store.truongCauHinh[idx] } };
  },
  delete: (id: string) => {
    const idx = store.truongCauHinh.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Not found');
    store.truongCauHinh.splice(idx, 1);
    return { data: { success: true } };
  },
};

// --- VAN BANG ---
export const vanBangCrud = {
  page: (params: any = {}) => {
    const { page = 1, limit = 10, condition = {}, sort = { so_vao_so: -1 }, filters = [] } = params;
    let data = store.vanBang.map((vb) => {
      const qd = store.quyetDinh.find((q) => q._id === vb.quyet_dinh_id);
      const svb = qd ? store.soVanBang.find((s) => s._id === qd.so_van_bang_id) : undefined;
      return {
        ...vb,
        quyetDinh: qd ? { ...qd, soVanBang: svb } : undefined,
      };
    });

    if (condition.quyet_dinh_id) data = data.filter((i) => i.quyet_dinh_id === condition.quyet_dinh_id);

    filters.forEach((f: any) => {
      if (f.operator === 'CONTAIN' && f.values?.[0]) {
        const val = f.values[0].toLowerCase();
        data = data.filter((i) => {
          const fieldVal = (i as any)[f.field];
          return String(fieldVal || '').toLowerCase().includes(val);
        });
      }
    });

    if (sort) {
      const [[key, order]] = Object.entries(sort);
      data.sort((a, b) => {
        const av = (a as any)[key];
        const bv = (b as any)[key];
        if (av < bv) return order === 1 ? -1 : 1;
        if (av > bv) return order === 1 ? 1 : -1;
        return 0;
      });
    }

    const total = data.length;
    const start = (page - 1) * limit;
    const result = data.slice(start, start + limit);
    return { data: { data: { result, total } } };
  },
  getById: (id: string) => {
    const item = store.vanBang.find((i) => i._id === id);
    if (!item) return { data: { data: null } };
    const qd = store.quyetDinh.find((q) => q._id === item.quyet_dinh_id);
    const svb = qd ? store.soVanBang.find((s) => s._id === qd.so_van_bang_id) : undefined;
    return { data: { data: { ...item, quyetDinh: qd ? { ...qd, soVanBang: svb } : undefined } } };
  },
  chiTiet: (id: string) => {
    const item = store.vanBang.find((i) => i._id === id);
    if (!item) return { data: { data: null } };
    const qd = store.quyetDinh.find((q) => q._id === item.quyet_dinh_id);
    const svb = qd ? store.soVanBang.find((s) => s._id === qd.so_van_bang_id) : undefined;
    return {
      data: {
        data: {
          vanBang: { ...item, quyetDinh: qd ? { ...qd, soVanBang: svb } : undefined },
          chiTietList: item.chiTietList || [],
        },
      },
    };
  },
  tao: (payload: { vanBang: Partial<IVanBang>; chiTietList: any[] }) => {
    const { vanBang, chiTietList } = payload;
    // Auto-generate so_vao_so
    const qd = store.quyetDinh.find((q) => q._id === vanBang.quyet_dinh_id);
    const soVaoSoList = store.vanBang
      .filter((v) => v.quyet_dinh_id === vanBang.quyet_dinh_id)
      .map((v) => v.so_vao_so || 0);
    const newSoVaoSo = soVaoSoList.length > 0 ? Math.max(...soVaoSoList) + 1 : 1;

    const chiTietItems: IChiTietVanBang[] = (chiTietList || []).map((ct) => ({
      ...ct,
      _id: ct._id || genId(),
      truongCauHinh: store.truongCauHinh.find((t) => t._id === ct.truong_cau_hinh_id),
    }));

    const newItem: IVanBang = {
      ...vanBang,
      _id: genId(),
      so_vao_so: newSoVaoSo,
      chiTietList: chiTietItems,
      createdAt: now(),
    } as IVanBang;
    store.vanBang.push(newItem);

    // Update luot tra cuu
    if (qd) {
      qd.so_luot_tra_cuu = (qd.so_luot_tra_cuu || 0) + 1;
    }

    return { data: { data: newItem } };
  },
  putChiTiet: (id: string, payload: { vanBang: Partial<IVanBang>; chiTietList: any[] }) => {
    const { vanBang, chiTietList } = payload;
    const idx = store.vanBang.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Not found');

    const chiTietItems: IChiTietVanBang[] = (chiTietList || []).map((ct) => ({
      ...ct,
      _id: ct._id || genId(),
      truongCauHinh: store.truongCauHinh.find((t) => t._id === ct.truong_cau_hinh_id),
    }));

    store.vanBang[idx] = {
      ...store.vanBang[idx],
      ...vanBang,
      chiTietList: chiTietItems,
    };
    return { data: { data: store.vanBang[idx] } };
  },
  delete: (id: string) => {
    const idx = store.vanBang.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Not found');
    store.vanBang.splice(idx, 1);
    return { data: { success: true } };
  },
};

// --- TRA CUU ---
export const traCuuCrud = {
  get: (params: any = {}) => {
    const { so_hieu_van_bang, so_vao_so, ma_sinh_vien, ho_ten, ngay_sinh } = params;
    let data = store.vanBang.map((vb) => {
      const qd = store.quyetDinh.find((q) => q._id === vb.quyet_dinh_id);
      const svb = qd ? store.soVanBang.find((s) => s._id === qd.so_van_bang_id) : undefined;
      return { ...vb, quyetDinh: qd ? { ...qd, soVanBang: svb } : undefined };
    });

    if (so_hieu_van_bang) data = data.filter((i) => i.so_hieu_van_bang?.toLowerCase().includes(so_hieu_van_bang.toLowerCase()));
    if (so_vao_so) data = data.filter((i) => String(i.so_vao_so ?? '') === String(so_vao_so));
    if (ma_sinh_vien) data = data.filter((i) => i.ma_sinh_vien?.toLowerCase().includes(ma_sinh_vien.toLowerCase()));
    if (ho_ten) data = data.filter((i) => i.ho_ten?.toLowerCase().includes(ho_ten.toLowerCase()));
    if (ngay_sinh) data = data.filter((i) => i.ngay_sinh?.startsWith(ngay_sinh));

    // Tăng lượt tra cứu
    data.forEach((vb) => {
      const qd = store.quyetDinh.find((q) => q._id === vb.quyet_dinh_id);
      if (qd) qd.so_luot_tra_cuu = (qd.so_luot_tra_cuu || 0) + 1;
    });

    return { data: { data } };
  },
  getById: (id: string) => {
    const item = store.vanBang.find((i) => i._id === id);
    if (!item) return { data: { data: null } };
    const qd = store.quyetDinh.find((q) => q._id === item.quyet_dinh_id);
    const svb = qd ? store.soVanBang.find((s) => s._id === qd.so_van_bang_id) : undefined;
    const tcht = store.truongCauHinh;
    return {
      data: {
        data: {
          ...item,
          quyetDinh: qd ? { ...qd, soVanBang: svb } : undefined,
          chiTietList: (item.chiTietList || []).map((ct) => ({
            ...ct,
            truongCauHinh: tcht.find((t) => t._id === ct.truong_cau_hinh_id),
          })),
        },
      },
    };
  },
};
