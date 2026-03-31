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
