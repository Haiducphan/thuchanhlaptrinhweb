import { useState } from 'react';
import { Card, Button, Tag, Input, Row, Col, Modal, Popconfirm, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, FireOutlined } from '@ant-design/icons';
import Form from './components/Form';

const NHOM_CO_OPTIONS = ['Ngực', 'Lưng', 'Chân', 'Vai', 'Tay', 'Bụng', 'Toàn thân'];
const MUC_DO_OPTIONS = ['Dễ', 'Trung bình', 'Khó'];
const COLOR_MUC_DO: Record<string, string> = {
	'Dễ': 'green',
	'Trung bình': 'orange',
	'Khó': 'red',
};

const DEFAULT_DATA: BaiTap.IRecord[] = [
	{ _id: '1', ten: 'Hít đất', nhomCo: 'Ngực', mucDo: 'Dễ', moTa: 'Bài tập cơ bản cho ngực và tay', calo: 350, huongDan: '1. Nằm sấp, tay đặt rộng hơn vai\n2. Hạ người xuống直到 ngực chạm sàn\n3. Đẩy người lên, giữ body thẳng\n4. Lặp lại 10-15 lần mỗi hiệp' },
	{ _id: '2', ten: 'Deadlift', nhomCo: 'Lưng', mucDo: 'Khó', moTa: 'Tập luyện sức mạnh toàn thân, tập trung vào lưng dưới', calo: 500, huongDan: '1. Đứng rộng bằng vai, tạ nằm trước chân\n2. Giữ lưng thẳng, cúi người xuống\n3. Nắm tạ, đứng dậy bằng chân\n4. Từ từ hạ xuống, giữ lưng thẳng' },
	{ _id: '3', ten: 'Squat', nhomCo: 'Chân', mucDo: 'Dễ', moTa: 'Bài tập cơ đùi trước và mông', calo: 400, huongDan: '1. Đứng thẳng, chân rộng bằng vai\n2. Hạ người xuống như ngồi xuống ghế\n3. Đầu gối không vượt quá mũi chân\n4. Đứng lên, lặp lại 15-20 lần' },
	{ _id: '4', ten: 'Plank', nhomCo: 'Bụng', mucDo: 'Trung bình', moTa: 'Bài tập giữ thăng bằng, tăng cường cơ bụng và lưng', calo: 200, huongDan: '1. Nằm sấp, chống tay xuống sàn\n2. Nâng người lên, body thẳng từ đầu đến chân\n3. Giữ tư thế 30-60 giây\n4. Nghỉ, lặp lại 3 hiệp' },
	{ _id: '5', ten: 'Bicep Curl', nhomCo: 'Tay', mucDo: 'Dễ', moTa: 'Bài tập cho cơ tay', calo: 150, huongDan: '1. Đứng thẳng, tay cầm tạ\n2. Giữ khuỷu tay sát body\n3. Cuộn tạ lên, siết cơ tay\n4. Hạ từ từ, lặp lại' },
	{ _id: '6', ten: 'Shoulder Press', nhomCo: 'Vai', mucDo: 'Trung bình', moTa: 'Bài tập cho cơ vai', calo: 300, huongDan: '1. Ngồi hoặc đứng, tay cầm tạ ngang vai\n2. Đẩy tạ lên cao, cánh tay thẳng\n3. Hạ tạ xuống từ từ\n4. Lặp lại 10-12 lần' },
];

const ThuVienBaiTapPage = () => {
	const [data, setData] = useState<BaiTap.IRecord[]>(() => {
		const saved = localStorage.getItem('baitap_data');
		return saved ? JSON.parse(saved) : DEFAULT_DATA;
	});
	const [search, setSearch] = useState('');
	const [filterNhomCo, setFilterNhomCo] = useState<string | undefined>();
	const [filterMucDo, setFilterMucDo] = useState<string | undefined>();
	const [record, setRecord] = useState<BaiTap.IRecord | undefined>();
	const [edit, setEdit] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [visibleDetail, setVisibleDetail] = useState(false);
	const [detailRecord, setDetailRecord] = useState<BaiTap.IRecord | undefined>();

	const saveData = (newData: BaiTap.IRecord[]) => {
		setData(newData);
		localStorage.setItem('baitap_data', JSON.stringify(newData));
	};

	const handleDelete = (id: string) => {
		saveData(data.filter((item) => item._id !== id));
	};

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const handleEdit = (rec: BaiTap.IRecord) => {
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

	const handleViewDetail = (rec: BaiTap.IRecord) => {
		setDetailRecord(rec);
		setVisibleDetail(true);
	};

	const filteredData = data.filter((item) => {
		const matchSearch = item.ten.toLowerCase().includes(search.toLowerCase());
		const matchNhomCo = !filterNhomCo || item.nhomCo === filterNhomCo;
		const matchMucDo = !filterMucDo || item.mucDo === filterMucDo;
		return matchSearch && matchNhomCo && matchMucDo;
	});

	return (
		<>
			<Card
				title="Thư viện Bài tập"
				extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm bài tập</Button>}
			>
				<Space style={{ marginBottom: 16 }} wrap>
					<Input placeholder="Tìm kiếm bài tập..." prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 220 }} allowClear />
					<select style={{ height: 32, borderRadius: 6, border: '1px solid #d9d9d9', padding: '0 11px', minWidth: 130 }} value={filterNhomCo || ''} onChange={(e) => setFilterNhomCo(e.target.value || undefined)}>
						<option value="">Nhóm cơ</option>
						{NHOM_CO_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
					</select>
					<select style={{ height: 32, borderRadius: 6, border: '1px solid #d9d9d9', padding: '0 11px', minWidth: 120 }} value={filterMucDo || ''} onChange={(e) => setFilterMucDo(e.target.value || undefined)}>
						<option value="">Mức độ</option>
						{MUC_DO_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
					</select>
				</Space>

				<Row gutter={[16, 16]}>
					{filteredData.map((item) => (
						<Col xs={24} sm={12} lg={8} key={item._id}>
							<Card hoverable onClick={() => handleViewDetail(item)}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
									<strong style={{ fontSize: 15 }}>{item.ten}</strong>
									<Tag color={COLOR_MUC_DO[item.mucDo]}>{item.mucDo}</Tag>
								</div>
								<Tag color="blue">{item.nhomCo}</Tag>
								<div style={{ margin: '8px 0', color: '#555' }}>{item.moTa}</div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f97316' }}>
									<FireOutlined />
									<span>{item.calo} kcal/h</span>
								</div>
								<div style={{ marginTop: 12, display: 'flex', gap: 8 }} onClick={(e) => e.stopPropagation()}>
									<Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleEdit(item)}>Sửa</Button>
									<Popconfirm onConfirm={() => handleDelete(item._id)} title="Xóa bài tập này?" placement="topLeft">
										<Button size="small" type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
									</Popconfirm>
								</div>
							</Card>
						</Col>
					))}
				</Row>
			</Card>

			<Modal
				visible={visibleDetail}
				title={detailRecord?.ten}
				onCancel={() => setVisibleDetail(false)}
				footer={<Button onClick={() => setVisibleDetail(false)}>Đóng</Button>}
				width={500}
			>
				{detailRecord && (
					<div>
						<div style={{ marginBottom: 8 }}>
							<Tag color="blue">{detailRecord.nhomCo}</Tag>
							<Tag color={COLOR_MUC_DO[detailRecord.mucDo]}>{detailRecord.mucDo}</Tag>
							<Tag color="orange"><FireOutlined /> {detailRecord.calo} kcal/h</Tag>
						</div>
						<div style={{ marginBottom: 12, color: '#555' }}>{detailRecord.moTa}</div>
						<div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8 }}>
							<strong>Hướng dẫn thực hiện:</strong>
							<pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{detailRecord.huongDan || 'Không có hướng dẫn'}</pre>
						</div>
					</div>
				)}
			</Modal>

			<Form record={record} edit={edit} visible={visibleForm} onClose={() => setVisibleForm(false)} onSave={handleSave} nhomCoOptions={NHOM_CO_OPTIONS} mucDoOptions={MUC_DO_OPTIONS} />
		</>
	);
};

export default ThuVienBaiTapPage;
