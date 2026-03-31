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
