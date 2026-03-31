import { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Popconfirm, Tooltip, Modal, Card, message } from 'antd';
import { DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import Form from './components/Form';

const getCLBList = (): any[] => {
	const saved = localStorage.getItem('clb_data');
	if (!saved) return [
		{ _id: '1', ten: 'CLB Tin học' },
		{ _id: '2', ten: 'CLB Âm nhạc' },
		{ _id: '3', ten: 'CLB Thể thao' },
		{ _id: '4', ten: 'CLB Tiếng Anh' },
	];
	try { return JSON.parse(saved); } catch { return []; }
};

const getLichSu = (): any[] => {
	const saved = localStorage.getItem('lich_su_thao_tac');
	return saved ? JSON.parse(saved) : [];
};

const saveLichSu = (data: any[]) => {
	localStorage.setItem('lich_su_thao_tac', JSON.stringify(data));
};

const DEFAULT_DATA: DonDangKy.IRecord[] = [
	{ _id: '1', hoTen: 'Nguyễn Văn A', email: 'vana@mail.com', sdt: '0901234561', gioiTinh: 'Nam', diaChi: 'Hà Nội', soTruong: 'Lập trình', cauLacBoId: '1', cauLacBoTen: 'CLB Tin học', lyDoDangKy: 'Yêu thích lập trình', trangThai: 'Pending' },
	{ _id: '2', hoTen: 'Trần Thị B', email: 'thib@mail.com', sdt: '0901234562', gioiTinh: 'Nữ', diaChi: 'HCM', soTruong: 'Hát', cauLacBoId: '2', cauLacBoTen: 'CLB Âm nhạc', lyDoDangKy: 'Đam mê ca hát', trangThai: 'Approved' },
	{ _id: '3', hoTen: 'Lê Văn C', email: 'vanc@mail.com', sdt: '0901234563', gioiTinh: 'Nam', diaChi: 'Đà Nẵng', soTruong: 'Bóng đá', cauLacBoId: '3', cauLacBoTen: 'CLB Thể thao', lyDoDangKy: 'Sức khỏe tốt', trangThai: 'Pending' },
	{ _id: '4', hoTen: 'Phạm Thị D', email: 'thid@mail.com', sdt: '0901234564', gioiTinh: 'Nữ', diaChi: 'Hải Phòng', soTruong: 'IELTS 7.0', cauLacBoId: '4', cauLacBoTen: 'CLB Tiếng Anh', lyDoDangKy: 'Muốn cải thiện giao tiếp', trangThai: 'Rejected', ghiChu: 'Chưa đạt yêu cầu' },
	{ _id: '5', hoTen: 'Hoàng Văn E', email: 'vane@mail.com', sdt: '0901234565', gioiTinh: 'Nam', diaChi: 'Hà Nội', soTruong: 'Python', cauLacBoId: '1', cauLacBoTen: 'CLB Tin học', lyDoDangKy: 'Học thêm về AI', trangThai: 'Approved' },
	{ _id: '6', hoTen: 'Ngô Thị F', email: 'thif@mail.com', sdt: '0901234566', gioiTinh: 'Nữ', diaChi: 'Cần Thơ', soTruong: 'Guitar', cauLacBoId: '2', cauLacBoTen: 'CLB Âm nhạc', lyDoDangKy: 'Thích chơi nhạc cụ', trangThai: 'Pending' },
	{ _id: '7', hoTen: 'Đặng Văn G', email: 'vang@mail.com', sdt: '0901234567', gioiTinh: 'Nam', diaChi: 'Quảng Ninh', soTruong: 'Cầu lông', cauLacBoId: '3', cauLacBoTen: 'CLB Thể thao', lyDoDangKy: 'Yêu thể thao', trangThai: 'Rejected', ghiChu: 'Lịch không phù hợp' },
	{ _id: '8', hoTen: 'Vũ Thị H', email: 'thih@mail.com', sdt: '0901234568', gioiTinh: 'Nữ', diaChi: 'Vinh', soTruong: 'TOEFL 80', cauLacBoId: '4', cauLacBoTen: 'CLB Tiếng Anh', lyDoDangKy: 'Du học', trangThai: 'Approved' },
];

const DonDangKyPage = () => {
	const [data, setData] = useState<DonDangKy.IRecord[]>(() => {
		const saved = localStorage.getItem('don_dang_ky_data');
		return saved ? JSON.parse(saved) : DEFAULT_DATA;
	});
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [rejectingIds, setRejectingIds] = useState<string[]>([]);
	const [rejectReason, setRejectReason] = useState('');
	const [visibleRejectModal, setVisibleRejectModal] = useState(false);
	const [record, setRecord] = useState<DonDangKy.IRecord | undefined>();
	const [edit, setEdit] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [clbList, setClbList] = useState(getCLBList());

	useEffect(() => {
		if (visibleForm) setClbList(getCLBList());
	}, [visibleForm]);

	const saveData = (newData: DonDangKy.IRecord[]) => {
		setData(newData);
		localStorage.setItem('don_dang_ky_data', JSON.stringify(newData));
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

	const handleEditRecord = (rec: DonDangKy.IRecord) => {
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
			saveData([{ ...values, _id: Date.now().toString(), cauLacBoTen: clb?.ten, trangThai: 'Pending' }, ...data]);
			message.success('Thêm mới thành công');
		}
		setVisibleForm(false);
	};

	const handleDuyetOne = (don: DonDangKy.IRecord) => {
		const ls = getLichSu();
		ls.push({ _id: Date.now().toString(), donDangKyId: don._id, hoTen: don.hoTen, hanhDong: 'Approved', thoiGian: moment().format('YYYY-MM-DD HH:mm:ss') });
		saveLichSu(ls);
		saveData(data.map((item) => item._id === don._id ? { ...item, trangThai: 'Approved' } : item));
		message.success('Đã duyệt đơn');
	};

	const handleDuyet = () => {
		if (!selectedIds.length) { message.warning('Vui lòng chọn ít nhất 1 đơn'); return; }
		const pending = data.filter((d) => selectedIds.includes(d._id) && d.trangThai === 'Pending');
		if (!pending.length) { message.warning('Không có đơn nào để duyệt'); return; }
		const ls = getLichSu();
		for (const don of pending) {
			ls.push({ _id: Date.now().toString(), donDangKyId: don._id, hoTen: don.hoTen, hanhDong: 'Approved', thoiGian: moment().format('YYYY-MM-DD HH:mm:ss') });
		}
		saveLichSu(ls);
		saveData(data.map((item) => pending.some((p) => p._id === item._id) ? { ...item, trangThai: 'Approved' } : item));
		message.success(`Đã duyệt ${pending.length} đơn`);
		setSelectedIds([]);
	};

	const handleRejectAll = () => {
		if (!rejectingIds.length) return;
		if (!rejectReason.trim()) { message.error('Vui lòng nhập lý do từ chối'); return; }
		const ls = getLichSu();
		for (const id of rejectingIds) {
			const don = data.find((d) => d._id === id);
			if (don) ls.push({ _id: Date.now().toString(), donDangKyId: don._id, hoTen: don.hoTen, hanhDong: 'Rejected', lyDo: rejectReason, thoiGian: moment().format('YYYY-MM-DD HH:mm:ss') });
		}
		saveLichSu(ls);
		saveData(data.map((item) => rejectingIds.includes(item._id) ? { ...item, trangThai: 'Rejected', ghiChu: rejectReason } : item));
		message.success(`Đã từ chối ${rejectingIds.length} đơn`);
		setVisibleRejectModal(false);
		setRejectingIds([]);
		setRejectReason('');
		setSelectedIds([]);
	};

	const openRejectModal = (ids?: string[]) => {
		const idsToReject = ids ?? selectedIds;
		if (!idsToReject.length) { message.warning('Vui lòng chọn ít nhất 1 đơn'); return; }
		setRejectingIds(idsToReject);
		setRejectReason('');
		setVisibleRejectModal(true);
	};

	const columns = [
		{ title: 'TT', width: 50, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
		{ title: 'Họ tên', dataIndex: 'hoTen', width: 160 },
		{ title: 'Email', dataIndex: 'email', width: 200 },
		{ title: 'SĐT', dataIndex: 'sdt', width: 120 },
		{ title: 'Giới tính', dataIndex: 'gioiTinh', width: 100, align: 'center' as const },
		{ title: 'Địa chỉ', dataIndex: 'diaChi', width: 150, ellipsis: true },
		{ title: 'Sở trường', dataIndex: 'soTruong', width: 130, ellipsis: true },
		{ title: 'Câu lạc bộ', dataIndex: 'cauLacBoTen', width: 180 },
		{ title: 'Lý do đăng ký', dataIndex: 'lyDoDangKy', width: 180, ellipsis: true },
		{ title: 'Trạng thái', dataIndex: 'trangThai', width: 120, align: 'center' as const, render: (val: string) => { const color = val === 'Approved' ? 'green' : val === 'Rejected' ? 'red' : 'orange'; const text = val === 'Approved' ? 'Đã duyệt' : val === 'Rejected' ? 'Từ chối' : 'Chờ duyệt'; return <Tag color={color}>{text}</Tag>; } },
		{ title: 'Ghi chú', dataIndex: 'ghiChu', width: 150, ellipsis: true, render: (val: string) => val || '-' },
		{ title: 'Ngày đăng ký', dataIndex: 'createdAt', width: 140, align: 'center' as const, render: () => moment().format('DD/MM/YYYY') },
		{
			title: 'Thao tác', align: 'center' as const, width: 180, fixed: 'right' as const,
			render: (rec: DonDangKy.IRecord) => (
				<Space>
					<Tooltip title="Chỉnh sửa"><Button onClick={() => handleEditRecord(rec)} type="link" icon={<EditOutlined />} /></Tooltip>
					{rec.trangThai === 'Pending' && (
						<>
							<Tooltip title="Duyệt"><Button type="link" icon={<CheckOutlined style={{ color: 'green' }} />} onClick={() => handleDuyetOne(rec)} /></Tooltip>
							<Tooltip title="Từ chối"><Button type="link" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => openRejectModal([rec._id])} /></Tooltip>
						</>
					)}
					<Popconfirm onConfirm={() => handleDelete(rec._id)} title="Bạn có chắc muốn xóa?" placement="topLeft"><Button danger type="link" icon={<DeleteOutlined />} /></Popconfirm>
				</Space>
			),
		},
	];

	const selectedApproved = selectedIds.filter((k) => data.find((d) => d._id === k)?.trangThai === 'Approved').length;
	const selectedPending = selectedIds.filter((k) => data.find((d) => d._id === k)?.trangThai === 'Pending').length;

	return (
		<>
			<Card title="Đơn đăng ký thành viên">
				<div style={{ marginBottom: 12 }}><Button type="primary" onClick={handleAdd}>+ Thêm mới</Button></div>

				{selectedIds.length > 0 && (
					<div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
						<span style={{ lineHeight: '32px', color: '#666' }}>Đã chọn {selectedIds.length} đơn{selectedPending > 0 && ` (${selectedPending} chờ duyệt)`}{selectedApproved > 0 && ` (${selectedApproved} đã duyệt)`}</span>
						{selectedPending > 0 && <Button type="primary" onClick={handleDuyet} icon={<CheckOutlined />}>Duyệt {selectedPending} đơn</Button>}
						<Button danger onClick={() => openRejectModal()} icon={<CloseOutlined />}>Từ chối {selectedIds.length} đơn</Button>
					</div>
				)}

				<Table rowSelection={{ type: 'checkbox', onChange: (keys) => setSelectedIds(keys as string[]) }} columns={columns} dataSource={data.map((item) => ({ ...item, key: item._id }))} bordered pagination={{ pageSize: 10 }} scroll={{ x: 1600 }} />
			</Card>

			<Form record={record} edit={edit} visible={visibleForm} onClose={() => setVisibleForm(false)} onSave={handleSave} danhSachCLB={clbList} />

			<Modal title="Từ chối đơn đăng ký" visible={visibleRejectModal} onOk={handleRejectAll} onCancel={() => { setVisibleRejectModal(false); setRejectingIds([]); }} okText="Từ chối" okButtonProps={{ danger: true }}>
				<p>Bạn có chắc muốn từ chối <strong>{rejectingIds.length}</strong> đơn đăng ký?</p>
				<p style={{ marginTop: 12 }}>Lý do từ chối (bắt buộc):</p>
				<textarea style={{ width: '100%', minHeight: 80, padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }} placeholder="Nhập lý do từ chối..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
			</Modal>
		</>
	);
};

export default DonDangKyPage;
