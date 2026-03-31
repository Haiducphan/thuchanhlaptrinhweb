import { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Popconfirm, Tooltip, Modal, Card, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined, SwapOutlined } from '@ant-design/icons';
import moment from 'moment';
import Form from './components/Form';


const DEFAULT_DATA: ThanhVien.IRecord[] = [
	{ _id: '1', hoTen: 'Trần Thị B', email: 'thib@mail.com', sdt: '0901234562', gioiTinh: 'Nữ', diaChi: 'HCM', soTruong: 'Hát', cauLacBoId: '2', cauLacBoTen: 'CLB Âm nhạc' },
	{ _id: '2', hoTen: 'Hoàng Văn E', email: 'vane@mail.com', sdt: '0901234565', gioiTinh: 'Nam', diaChi: 'Hà Nội', soTruong: 'Python', cauLacBoId: '1', cauLacBoTen: 'CLB Tin học' },
	{ _id: '3', hoTen: 'Vũ Thị H', email: 'thih@mail.com', sdt: '0901234568', gioiTinh: 'Nữ', diaChi: 'Vinh', soTruong: 'TOEFL 80', cauLacBoId: '4', cauLacBoTen: 'CLB Tiếng Anh' },
	{ _id: '4', hoTen: 'Nguyễn Văn X', email: 'vanx@mail.com', sdt: '0901234560', gioiTinh: 'Nam', diaChi: 'Hải Dương', soTruong: 'C++', cauLacBoId: '1', cauLacBoTen: 'CLB Tin học' },
	{ _id: '5', hoTen: 'Lê Thị Y', email: 'thiy@mail.com', sdt: '0901234569', gioiTinh: 'Nữ', diaChi: 'Nam Định', soTruong: 'Piano', cauLacBoId: '2', cauLacBoTen: 'CLB Âm nhạc' },
	{ _id: '6', hoTen: 'Bùi Văn Z', email: 'vanz@mail.com', sdt: '0901234570', gioiTinh: 'Nam', diaChi: 'Thanh Hóa', soTruong: 'Bơi lội', cauLacBoId: '3', cauLacBoTen: 'CLB Thể thao' },
];

const ThanhVienPage = () => {
	const [data, setData] = useState<ThanhVien.IRecord[]>(() => {
		const saved = localStorage.getItem('thanh_vien_data');
		return saved ? JSON.parse(saved) : DEFAULT_DATA;
	});
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [visibleChuyenCLB, setVisibleChuyenCLB] = useState(false);
	const [clbMoi, setClbMoi] = useState<string>('');
	const [record, setRecord] = useState<ThanhVien.IRecord | undefined>();
	const [edit, setEdit] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [clbList, setClbList] = useState<any[]>(() => {
		const saved = localStorage.getItem('clb_data');
		if (!saved) return [
			{ _id: '1', ten: 'CLB Tin học' },
			{ _id: '2', ten: 'CLB Âm nhạc' },
			{ _id: '3', ten: 'CLB Thể thao' },
			{ _id: '4', ten: 'CLB Tiếng Anh' },
		];
		try { return JSON.parse(saved); } catch { return []; }
	});

	useEffect(() => {
		if (visibleForm) {
			const saved = localStorage.getItem('clb_data');
			if (saved) {
				try { setClbList(JSON.parse(saved)); } catch {}
			}
		}
	}, [visibleForm]);

	const saveData = (newData: ThanhVien.IRecord[]) => {
		setData(newData);
		localStorage.setItem('thanh_vien_data', JSON.stringify(newData));
	};

	const handleDelete = (id: string) => {
		saveData(data.filter((item) => item._id !== id));
		message.success('Xóa thành công');
	};

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const handleEditRecord = (rec: ThanhVien.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	const handleSave = (values: any) => {
		const clb = clbList.find((c: any) => c._id === values.cauLacBoId);
		if (edit && record) {
			saveData(data.map((item) => item._id === record._id ? { ...item, ...values, cauLacBoTen: clb?.ten } : item));
			message.success('Lưu thành công');
		} else {
			saveData([{ ...values, _id: Date.now().toString(), cauLacBoTen: clb?.ten }, ...data]);
			message.success('Thêm mới thành công');
		}
		setVisibleForm(false);
	};

	const handleChuyenCLB = () => {
		if (!clbMoi) { message.error('Vui lòng chọn câu lạc bộ mới'); return; }
		if (!selectedIds.length) { message.warning('Vui lòng chọn ít nhất 1 thành viên'); return; }
		const clb = clbList.find((c: any) => c._id === clbMoi);
		saveData(data.map((item) => selectedIds.includes(item._id) ? { ...item, cauLacBoId: clbMoi, cauLacBoTen: clb?.ten } : item));
		message.success(`Đã chuyển ${selectedIds.length} thành viên sang "${clb?.ten}"`);
		setVisibleChuyenCLB(false);
		setSelectedIds([]);
		setClbMoi('');
	};

	const columns = [
		{ title: 'TT', width: 50, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
		{ title: 'Họ tên', dataIndex: 'hoTen', width: 160 },
		{ title: 'Email', dataIndex: 'email', width: 200 },
		{ title: 'SĐT', dataIndex: 'sdt', width: 130 },
		{ title: 'Giới tính', dataIndex: 'gioiTinh', width: 100, align: 'center' as const },
		{ title: 'Địa chỉ', dataIndex: 'diaChi', width: 160, ellipsis: true },
		{ title: 'Sở trường', dataIndex: 'soTruong', width: 130, ellipsis: true },
		{ title: 'Câu lạc bộ', dataIndex: 'cauLacBoTen', width: 180, render: (val: string) => <Tag color="blue">{val || '-'}</Tag> },
		{ title: 'Ngày tham gia', dataIndex: 'createdAt', width: 140, align: 'center' as const, render: () => moment().format('DD/MM/YYYY') },
		{
			title: 'Thao tác', align: 'center' as const, width: 120, fixed: 'right' as const,
			render: (rec: ThanhVien.IRecord) => (
				<Space>
					<Tooltip title="Chỉnh sửa"><Button onClick={() => handleEditRecord(rec)} type="link" icon={<EditOutlined />} /></Tooltip>
					<Popconfirm onConfirm={() => handleDelete(rec._id)} title="Bạn có chắc muốn xóa?" placement="topLeft"><Button danger type="link" icon={<DeleteOutlined />} /></Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Card title="Thành viên câu lạc bộ">
				<div style={{ marginBottom: 12 }}>
					<Button type="primary" onClick={handleAdd}>+ Thêm mới</Button>
				</div>

				{selectedIds.length > 0 && (
					<div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
						<span style={{ lineHeight: '32px', color: '#666' }}>Đã chọn {selectedIds.length} thành viên</span>
						<Button type="primary" icon={<SwapOutlined />} onClick={() => setVisibleChuyenCLB(true)}>Chuyển CLB</Button>
					</div>
				)}

				<Table rowSelection={{ type: 'checkbox', onChange: (keys) => setSelectedIds(keys as string[]) }} columns={columns} dataSource={data.map((item) => ({ ...item, key: item._id }))} bordered pagination={{ pageSize: 10 }} scroll={{ x: 1300 }} />
			</Card>

			<Form record={record} edit={edit} visible={visibleForm} onClose={() => setVisibleForm(false)} onSave={handleSave} danhSachCLB={clbList} />

			<Modal title="Chuyển câu lạc bộ" visible={visibleChuyenCLB} onOk={handleChuyenCLB} onCancel={() => { setVisibleChuyenCLB(false); setClbMoi(''); }} okText="Chuyển">
				<p>Chuyển <strong>{selectedIds.length}</strong> thành viên sang câu lạc bộ:</p>
				<Select style={{ width: '100%', marginTop: 8 }} showSearch placeholder="Chọn câu lạc bộ mới" value={clbMoi || undefined} onChange={setClbMoi} dropdownStyle={{ zIndex: 3000 }} filterOption={(input, option) => (String((option as any)?.children) ?? '').toLowerCase().includes(input.toLowerCase())}>
					{clbList.map((clb: any) => <Select.Option key={clb._id} value={clb._id}>{clb.ten}</Select.Option>)}
				</Select>
			</Modal>
		</>
	);
};

export default ThanhVienPage;
