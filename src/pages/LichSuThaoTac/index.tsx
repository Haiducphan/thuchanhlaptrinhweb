import { Card, Table, Tag } from 'antd';
import moment from 'moment';

const getLichSu = (): any[] => {
	const saved = localStorage.getItem('lich_su_thao_tac');
	return saved ? JSON.parse(saved) : [];
};

const LichSuThaoTacPage = () => {
	const data = getLichSu();

	const columns = [
		{ title: 'TT', width: 50, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
		{ title: 'Họ tên ứng viên', dataIndex: 'hoTen', width: 180 },
		{ title: 'Hành động', dataIndex: 'hanhDong', width: 140, align: 'center' as const, render: (val: string) => val === 'Approved' ? <Tag color="green">Duyệt</Tag> : <Tag color="red">Từ chối</Tag> },
		{ title: 'Lý do', dataIndex: 'lyDo', width: 250, ellipsis: true, render: (val: string) => val || '-' },
		{ title: 'Thời gian thao tác', dataIndex: 'thoiGian', width: 170, align: 'center' as const, render: (val: string) => val ? moment(val).format('HH:mm DD/MM/YYYY') : '-' },
	];

	return (
		<Card title="Lịch sử thao tác duyệt/từ chối">
			<Table columns={columns} dataSource={data.map((item, index) => ({ ...item, key: index }))} bordered pagination={{ pageSize: 10 }} />
		</Card>
	);
};

export default LichSuThaoTacPage;
export { getLichSu };
