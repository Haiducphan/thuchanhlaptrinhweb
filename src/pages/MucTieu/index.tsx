import { useState } from 'react';
import { Card, Button, Tag, Progress, Popconfirm, Segmented, Space, Row, Col, InputNumber, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Form from './components/Form';

const LOAI_MUC_TIEU = ['Giảm cân', 'Tăng cơ', 'Cải thiện sức bền', 'Khác'];
const TRANG_THAI_MUC_TIEU = ['Đang thực hiện', 'Đã đạt', 'Đã hủy'];
const COLOR_STATUS: Record<string, string> = {
	'Đang thực hiện': 'blue',
	'Đã đạt': 'green',
	'Đã hủy': 'red',
};

const DEFAULT_DATA: MucTieu.IRecord[] = [
	{ _id: '1', ten: 'Giảm 5kg trong 2 tháng', loai: 'Giảm cân', giaTriMucTieu: 5, giaTriHienTai: 2.5, deadline: '2026-06-30', trangThai: 'Đang thực hiện' },
	{ _id: '2', ten: 'Tăng cơ bắp tay', loai: 'Tăng cơ', giaTriMucTieu: 3, giaTriHienTai: 3, deadline: '2026-05-15', trangThai: 'Đã đạt' },
	{ _id: '3', ten: 'Chạy marathon 10km', loai: 'Cải thiện sức bền', giaTriMucTieu: 10, giaTriHienTai: 4, deadline: '2026-07-01', trangThai: 'Đang thực hiện' },
];

const MucTieuPage = () => {
	const [data, setData] = useState<MucTieu.IRecord[]>(() => {
		const saved = localStorage.getItem('muctieu_data');
		return saved ? JSON.parse(saved) : DEFAULT_DATA;
	});
	const [filterStatus, setFilterStatus] = useState<string>('Tất cả');
	const [record, setRecord] = useState<MucTieu.IRecord | undefined>();
	const [edit, setEdit] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [editingValue, setEditingValue] = useState<string | null>(null);
	const [tempValue, setTempValue] = useState<number>(0);

	const saveData = (newData: MucTieu.IRecord[]) => {
		setData(newData);
		localStorage.setItem('muctieu_data', JSON.stringify(newData));
	};

	const handleDelete = (id: string) => {
		saveData(data.filter((item) => item._id !== id));
	};

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const handleEdit = (rec: MucTieu.IRecord) => {
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

	const handleUpdateValue = (id: string, value: number) => {
		const updated = data.map((item) => {
			if (item._id !== id) return item;
			const percent = (value / item.giaTriMucTieu) * 100;
			return {
				...item,
				giaTriHienTai: value,
				trangThai: percent >= 100 ? 'Đã đạt' : item.trangThai === 'Đã hủy' ? 'Đã hủy' : 'Đang thực hiện',
			};
		});
		saveData(updated);
		setEditingValue(null);
	};

	const filteredData = filterStatus === 'Tất cả' ? data : data.filter((item) => item.trangThai === filterStatus);

	return (
		<>
			<Card
				title="Quản lý Mục tiêu"
				extra={
					<Space>
						<Segmented
							options={['Tất cả', ...TRANG_THAI_MUC_TIEU]}
							value={filterStatus}
							onChange={(val) => setFilterStatus(val as string)}
						/>
						<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm mục tiêu</Button>
					</Space>
				}
			>
				<Row gutter={[16, 16]}>
					{filteredData.map((item) => {
						const percent = Math.min(100, Math.round((item.giaTriHienTai / item.giaTriMucTieu) * 100));
						const isEditing = editingValue === item._id;

						return (
							<Col xs={24} sm={12} lg={8} xl={6} key={item._id}>
								<Card
									hoverable
									style={{ height: '100%' }}
									actions={[
										<Tooltip title="Sửa"><Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(item)} /></Tooltip>,
										<Popconfirm onConfirm={() => handleDelete(item._id)} title="Xóa mục tiêu này?" placement="topLeft">
											<Button type="text" danger icon={<DeleteOutlined />} />
										</Popconfirm>,
									]}
								>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
										<strong style={{ fontSize: 15 }}>{item.ten}</strong>
										<Tag color={COLOR_STATUS[item.trangThai]}>{item.trangThai}</Tag>
									</div>
									<Tag color="default">{item.loai}</Tag>
									<div style={{ marginTop: 12, marginBottom: 8 }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
											<span>Tiến độ</span>
											<span>{percent}%</span>
										</div>
										<Progress percent={percent} status={percent >= 100 ? 'success' : 'active'} size="small" />
									</div>
									<div style={{ marginBottom: 4 }}>
										<span style={{ color: '#666' }}>Mục tiêu: </span>
										<strong>{item.giaTriMucTieu}</strong>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
										<span style={{ color: '#666' }}>Hiện tại: </span>
										{isEditing ? (
											<Space size={4}>
												<InputNumber
													size="small"
													value={tempValue}
													onChange={(val) => setTempValue(val || 0)}
													style={{ width: 70 }}
													min={0}
												/>
												<Button size="small" type="text" icon={<CheckOutlined />} onClick={() => handleUpdateValue(item._id, tempValue)} />
												<Button size="small" type="text" danger icon={<CloseOutlined />} onClick={() => setEditingValue(null)} />
											</Space>
										) : (
											<Button type="link" size="small" onClick={() => { setEditingValue(item._id); setTempValue(item.giaTriHienTai); }} style={{ padding: 0 }}>
												<strong>{item.giaTriHienTai}</strong>
											</Button>
										)}
									</div>
									<div style={{ color: '#888', fontSize: 12 }}>
										<span>Deadline: {item.deadline}</span>
									</div>
								</Card>
							</Col>
						);
					})}
				</Row>
			</Card>
			<Form record={record} edit={edit} visible={visibleForm} onClose={() => setVisibleForm(false)} onSave={handleSave} loaiOptions={LOAI_MUC_TIEU} trangThaiOptions={TRANG_THAI_MUC_TIEU} />
		</>
	);
};

export default MucTieuPage;
