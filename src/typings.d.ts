declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'react-split-pane/lib/Pane';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare const APP_CONFIG_IP_ROOT: string;
declare const APP_CONFIG_ONE_SIGNAL_ID: string;
declare const APP_CONFIG_SENTRY_DSN: string;
declare const APP_CONFIG_KEYCLOAK_AUTHORITY: string;
declare const APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID: string;
declare const APP_CONFIG_APP_VERSION: string;

declare const APP_CONFIG_CO_QUAN_CHU_QUAN: string;
declare const APP_CONFIG_TEN_TRUONG: string;
declare const APP_CONFIG_TIEN_TO_TRUONG: string;
declare const APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH: string;
declare const APP_CONFIG_PRIMARY_COLOR: string;

declare const APP_CONFIG_URL_LANDING: string;
declare const APP_CONFIG_URL_CONNECT: string;
declare const APP_CONFIG_URL_CAN_BO: string;
declare const APP_CONFIG_URL_DAO_TAO: string;
declare const APP_CONFIG_URL_NHAN_SU: string;
declare const APP_CONFIG_URL_TAI_CHINH: string;
declare const APP_CONFIG_URL_CTSV: string;
declare const APP_CONFIG_URL_QLKH: string;
declare const APP_CONFIG_URL_VPS: string;
declare const APP_CONFIG_URL_KHAO_THI: string;
declare const APP_CONFIG_URL_CORE: string;
declare const APP_CONFIG_URL_CSVC: string;
declare const APP_CONFIG_URL_THU_VIEN: string;
declare const APP_CONFIG_URL_QLVB: string;

declare const APP_CONFIG_TITLE_LANDING: string;
declare const APP_CONFIG_TITLE_CONNECT: string;
declare const APP_CONFIG_TITLE_CAN_BO: string;
declare const APP_CONFIG_TITLE_DAO_TAO: string;
declare const APP_CONFIG_TITLE_NHAN_SU: string;
declare const APP_CONFIG_TITLE_TAI_CHINH: string;
declare const APP_CONFIG_TITLE_CTSV: string;
declare const APP_CONFIG_TITLE_QLKH: string;
declare const APP_CONFIG_TITLE_VPS: string;
declare const APP_CONFIG_TITLE_KHAO_THI: string;
declare const APP_CONFIG_TITLE_CORE: string;
declare const APP_CONFIG_TITLE_CSVC: string;
declare const APP_CONFIG_TITLE_THU_VIEN: string;
declare const APP_CONFIG_TITLE_QLVB: string;

// =============================================
// VAN BANG - TYPING DECLARATIONS
// =============================================

declare module SoVanBang {
  export interface IRecord {
    _id: string;
    nam: number;
    ten_so?: string;
    ghi_chu?: string;
    createdAt?: string;
    updatedAt?: string;
  }
}

declare module QuyetDinh {
  export interface IRecord {
    _id: string;
    so_quyet_dinh: string;
    ngay_ban_hanh: string;
    trich_yeu: string;
    so_van_bang_id: string;
    so_luot_tra_cuu?: number;
    createdAt?: string;
    updatedAt?: string;
    // Populate
    soVanBang?: SoVanBang.IRecord;
  }
}

declare module TruongCauHinh {
  export type TKieuDuLieu = 'String' | 'Number' | 'Date';

  export interface IRecord {
    _id: string;
    ten_truong: string;
    kieu_du_lieu: TKieuDuLieu;
    thu_tu_hien_thi?: number;
    bat_buoc?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
}

declare module VanBang {
  export interface IRecord {
    _id: string;
    so_vao_so: number;
    so_hieu_van_bang: string;
    ma_sinh_vien: string;
    ho_ten: string;
    ngay_sinh: string;
    quyet_dinh_id: string;
    createdAt?: string;
    updatedAt?: string;
    // Populate
    quyetDinh?: QuyetDinh.IRecord;
    chiTiet?: VanBangChiTiet.IRecord[];
  }
}

declare module VanBangChiTiet {
  export interface IRecord {
    _id: string;
    van_bang_id: string;
    truong_cau_hinh_id: string;
    gia_tri?: string;
    createdAt?: string;
    updatedAt?: string;
    // Populate
    truongCauHinh?: TruongCauHinh.IRecord;
  }
}

declare module CauLacBo {
	export interface IRecord {
		_id: string;
		ten: string;
		anhDaiDien?: string;
		ngayThanhLap?: string;
		moTa?: string;
		chunhiemClb?: string;
		hoatDong?: boolean;
		createdAt?: string;
		updatedAt?: string;
	}
}

declare module DonDangKy {
	export type TrangThaiDon = 'Pending' | 'Approved' | 'Rejected';
	export interface IRecord {
		_id: string;
		hoTen: string;
		email: string;
		sdt: string;
		gioiTinh?: string;
		diaChi?: string;
		soTruong?: string;
		cauLacBoId?: string;
		cauLacBoTen?: string;
		lyDoDangKy?: string;
		trangThai?: TrangThaiDon;
		ghiChu?: string;
		createdAt?: string;
		updatedAt?: string;
	}
}

declare module ThanhVien {
	export interface IRecord {
		_id: string;
		hoTen: string;
		email: string;
		sdt: string;
		gioiTinh?: string;
		diaChi?: string;
		soTruong?: string;
		cauLacBoId?: string;
		cauLacBoTen?: string;
		donDangKyId?: string;
		createdAt?: string;
		updatedAt?: string;
	}
}

declare module LichSuThaoTac {
	export type HanhDong = 'Approved' | 'Rejected';
	export interface IRecord {
		_id: string;
		donDangKyId: string;
		hoTen: string;
		hanhDong: HanhDong;
		lyDo?: string;
		thoiGian: string;
		createdAt?: string;
		updatedAt?: string;
	}
}

declare module TraCuu {
  export interface IParams {
    so_hieu_van_bang?: string;
    so_vao_so?: number | string;
    ma_sinh_vien?: string;
    ho_ten?: string;
    ngay_sinh?: string;
  }

  export interface IKetQua {
    vanBang: VanBang.IRecord;
    chiTietList: Array<{
      truongCauHinh: TruongCauHinh.IRecord;
      gia_tri: string;
    }>;
    quyetDinh: QuyetDinh.IRecord;
  }
}
