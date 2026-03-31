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
