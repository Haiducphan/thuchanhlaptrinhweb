import { useState } from 'react';
import { Table, Button, Image, Tag, Space, Popconfirm, Tooltip, Card } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import Form from './components/Form';

const DEFAULT_DATA: CauLacBo.IRecord[] = [
	{ _id: '1', ten: 'CLB Tin học', anhDaiDien: 'https://picsum.photos/seed/clb1/200', ngayThanhLap: '2024-01-15', moTa: 'CLB dành cho những bạn yêu thích công nghệ thông tin', chunhiemClb: 'Nguyễn Văn An', hoatDong: true },
	{ _id: '2', ten: 'CLB Âm nhạc', anhDaiDien: 'https://picsum.photos/seed/clb2/200', ngayThanhLap: '2024-02-20', moTa: 'CLB ca hát, nhạc cụ dành cho mọi người', chunhiemClb: 'Trần Thị Bình', hoatDong: true },
	{ _id: '3', ten: 'CLB Thể thao', anhDaiDien: 'https://picsum.photos/seed/clb3/200', ngayThanhLap: '2024-03-10', moTa: 'CLB bóng đá, cầu lông, bơi lội', chunhiemClb: 'Lê Minh Cường', hoatDong: true },
	{ _id: '4', ten: 'CLB Tiếng Anh', anhDaiDien: 'https://picsum.photos/seed/clb4/200', ngayThanhLap: '2024-04-05', moTa: 'CLB giao tiếp tiếng Anh, TOEFL, IELTS', chunhiemClb: 'Phạm Thu Hà', hoatDong: false },
];

const CauLacBoPage = () => {
	const [data, setData] = useState<CauLacBo.IRecord[]>(() => {
		const saved = localStorage.getItem('clb_data');
		return saved ? JSON.parse(saved) : DEFAULT_DATA;
	});
	const [record, setRecord] = useState<CauLacBo.IRecord | undefined>();
	const [edit, setEdit] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);

	const saveData = (newData: CauLacBo.IRecord[]) => {
		setData(newData);
		localStorage.setItem('clb_data', JSON.stringify(newData));
	};

	const handleDelete = (id: string) => {
		saveData(data.filter((item) => item._id !== id));
	};

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const handleEditRecord = (rec: CauLacBo.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	const handleSave = (values: any) => {
		if (edit && record) {
			saveData(data.map((item) => item._id === record._id ? { ...item, ...values } : item));
		} else {
			saveData([{ ...values, _id: Date.now().toString() }, ...data]);
		}
		setVisibleForm(false);
	};

	const columns = [
		{ title: 'TT', width: 50, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
		{ title: 'Ảnh đại diện', dataIndex: 'anhDaiDien', width: 100, align: 'center' as const, render: (val: string) => val ? <Image width={60} height={60} src={val} style={{ objectFit: 'cover', borderRadius: 4 }} /> : '-' },
		{ title: 'Tên câu lạc bộ', dataIndex: 'ten', width: 200 },
		{ title: 'Ngày thành lập', dataIndex: 'ngayThanhLap', width: 130, align: 'center' as const, render: (val: string) => val ? moment(val).format('DD/MM/YYYY') : '-' },
		{ title: 'Mô tả', dataIndex: 'moTa', width: 250, ellipsis: true },
		{ title: 'Chủ nhiệm CLB', dataIndex: 'chunhiemClb', width: 180 },
		{ title: 'Hoạt động', dataIndex: 'hoatDong', width: 110, align: 'center' as const, render: (val: boolean) => <Tag color={val ? 'green' : 'red'}>{val ? 'Có' : 'Không'}</Tag> },
		{
			title: 'Thao tác', align: 'center' as const, width: 120, fixed: 'right' as const,
			render: (rec: CauLacBo.IRecord) => (
				<Space>
					<Tooltip title="Chỉnh sửa"><Button onClick={() => handleEditRecord(rec)} type="link" icon={<EditOutlined />} /></Tooltip>
					<Popconfirm onConfirm={() => handleDelete(rec._id)} title="Bạn có chắc muốn xóa?" placement="topLeft">
						<Button danger type="link" icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Card title="Danh sách Câu lạc bộ">
				<div style={{ marginBottom: 12 }}><Button type="primary" onClick={handleAdd}>+ Thêm mới</Button></div>
				<Table columns={columns} dataSource={data.map((item) => ({ ...item, key: item._id }))} bordered pagination={{ pageSize: 10 }} scroll={{ x: 1100 }} />
			</Card>
			<Form record={record} edit={edit} visible={visibleForm} onClose={() => setVisibleForm(false)} onSave={handleSave} />
		</>
	);
};

export default CauLacBoPage;
