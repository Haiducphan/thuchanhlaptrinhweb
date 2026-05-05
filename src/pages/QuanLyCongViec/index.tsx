import { CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Empty, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Statistic, Table, Tabs, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';

type TrangThaiTask = 'todo' | 'doing' | 'done';
type MucDoUuTien = 'Cao' | 'Trung bình' | 'Thấp';

type TaskItem = {
	id: string;
	ten: string;
	moTa: string;
	deadline: string;
	uuTien: MucDoUuTien;
	tag: string;
	trangThai: TrangThaiTask;
};

const { Search, TextArea } = Input;
const { Text } = Typography;

const STORAGE_KEY = 'quan_ly_cong_viec_data';

const CAC_COT: { key: TrangThaiTask; ten: string; mau: string }[] = [
	{ key: 'todo', ten: 'Cần làm', mau: '#faad14' },
	{ key: 'doing', ten: 'Đang làm', mau: '#1890ff' },
	{ key: 'done', ten: 'Hoàn thành', mau: '#52c41a' },
];

const TEN_TRANG_THAI: Record<TrangThaiTask, string> = {
	todo: 'Cần làm',
	doing: 'Đang làm',
	done: 'Hoàn thành',
};

const MAU_TRANG_THAI: Record<TrangThaiTask, string> = {
	todo: 'orange',
	doing: 'blue',
	done: 'green',
};

const MAU_UU_TIEN: Record<MucDoUuTien, string> = {
	Cao: 'red',
	'Trung bình': 'gold',
	Thấp: 'green',
};

const TASK_MAU: TaskItem[] = [
	{
		id: '1',
		ten: 'Làm giao diện Dashboard',
		moTa: 'Hiển thị các thẻ thống kê task',
		deadline: '2026-05-12',
		uuTien: 'Cao',
		tag: 'Frontend',
		trangThai: 'todo',
	},
	{
		id: '2',
		ten: 'Kéo thả Kanban',
		moTa: 'Dùng react-beautiful-dnd để đổi trạng thái',
		deadline: '2026-05-15',
		uuTien: 'Cao',
		tag: 'React',
		trangThai: 'doing',
	},
	{
		id: '3',
		ten: 'Lưu dữ liệu localStorage',
		moTa: 'Refresh trang vẫn còn dữ liệu task',
		deadline: '2026-05-08',
		uuTien: 'Trung bình',
		tag: 'Storage',
		trangThai: 'done',
	},
	{
		id: '4',
		ten: 'Nộp bài thực hành',
		moTa: 'Kiểm tra lại form và bảng danh sách',
		deadline: '2026-06-15',
		uuTien: 'Thấp',
		tag: 'Bài tập',
		trangThai: 'todo',
	},
];

const layDuLieu = () => {
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? (JSON.parse(data) as TaskItem[]) : TASK_MAU;
	} catch {
		return TASK_MAU;
	}
};

const QuanLyCongViec = () => {
	const [dsTask, setDsTask] = useState<TaskItem[]>(layDuLieu);
	const [tab, setTab] = useState('dashboard');
	const [visible, setVisible] = useState(false);
	const [taskDangSua, setTaskDangSua] = useState<TaskItem>();
	const [tuKhoa, setTuKhoa] = useState('');
	const [locTrangThai, setLocTrangThai] = useState<TrangThaiTask | 'all'>('all');
	const [form] = Form.useForm();

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(dsTask));
	}, [dsTask]);

	const quaHan = (task: TaskItem) => task.trangThai !== 'done' && moment(task.deadline, 'YYYY-MM-DD').endOf('day').isBefore(moment());

	const thongKe = useMemo(() => {
		return {
			tong: dsTask.length,
			hoanThanh: dsTask.filter((item) => item.trangThai === 'done').length,
			quaHan: dsTask.filter((item) => quaHan(item)).length,
		};
	}, [dsTask]);

	const dsTaskDaLoc = useMemo(() => {
		return dsTask.filter((item) => {
			const dungTrangThai = locTrangThai === 'all' || item.trangThai === locTrangThai;
			const dungTuKhoa = item.ten.toLowerCase().includes(tuKhoa.toLowerCase());
			return dungTrangThai && dungTuKhoa;
		});
	}, [dsTask, locTrangThai, tuKhoa]);

	const moFormThem = (trangThai: TrangThaiTask = 'todo') => {
		setTaskDangSua(undefined);
		form.resetFields();
		form.setFieldsValue({
			uuTien: 'Trung bình',
			trangThai,
		});
		setVisible(true);
	};

	const moFormSua = (task: TaskItem) => {
		setTaskDangSua(task);
		form.setFieldsValue({
			...task,
			deadline: moment(task.deadline, 'YYYY-MM-DD'),
		});
		setVisible(true);
	};

	const xoaTask = (id: string) => {
		setDsTask(dsTask.filter((item) => item.id !== id));
		message.success('Đã xóa task');
	};

	const luuTask = (values: any) => {
		const data: TaskItem = {
			...values,
			id: taskDangSua ? taskDangSua.id : Date.now().toString(),
			deadline: values.deadline.format('YYYY-MM-DD'),
		};

		if (taskDangSua) {
			setDsTask(dsTask.map((item) => (item.id === taskDangSua.id ? data : item)));
			message.success('Đã cập nhật task');
		} else {
			setDsTask([data, ...dsTask]);
			message.success('Đã thêm task');
		}

		setVisible(false);
		form.resetFields();
	};

	const keoThaTask = (result: DropResult) => {
		if (!result.destination) return;

		const cotNguon = result.source.droppableId as TrangThaiTask;
		const cotDich = result.destination.droppableId as TrangThaiTask;
		const dsNguon = dsTask.filter((item) => item.trangThai === cotNguon);
		const dsDich = cotNguon === cotDich ? dsNguon : dsTask.filter((item) => item.trangThai === cotDich);
		const [taskKeo] = dsNguon.splice(result.source.index, 1);

		if (!taskKeo) return;

		dsDich.splice(result.destination.index, 0, { ...taskKeo, trangThai: cotDich });

		const dataMoi = CAC_COT.flatMap((cot) => {
			if (cot.key === cotNguon) return cotNguon === cotDich ? dsDich : dsNguon;
			if (cot.key === cotDich) return dsDich;
			return dsTask.filter((item) => item.trangThai === cot.key);
		});

		setDsTask(dataMoi);
	};

	const renderTagTask = (task: TaskItem) => (
		<Space size={4} wrap>
			<Tag color={MAU_UU_TIEN[task.uuTien]}>{task.uuTien}</Tag>
			<Tag>{task.tag}</Tag>
			{quaHan(task) && <Tag color="red">Quá hạn</Tag>}
		</Space>
	);

	const renderTaskCard = (task: TaskItem) => (
		<Card
			size="small"
			style={{ marginBottom: 10, borderRadius: 6 }}
			bodyStyle={{ padding: 12 }}
			actions={[
				<Button key="edit" type="text" size="small" icon={<EditOutlined />} onClick={() => moFormSua(task)}>
					Sửa
				</Button>,
				<Popconfirm key="delete" title="Bạn muốn xóa task này?" onConfirm={() => xoaTask(task.id)}>
					<Button type="text" size="small" danger icon={<DeleteOutlined />}>
						Xóa
					</Button>
				</Popconfirm>,
			]}
		>
			<div style={{ fontWeight: 600, marginBottom: 6 }}>{task.ten}</div>
			<div style={{ color: '#666', minHeight: 38, marginBottom: 8 }}>{task.moTa}</div>
			<div style={{ marginBottom: 8 }}>{renderTagTask(task)}</div>
			<Text type={quaHan(task) ? 'danger' : 'secondary'}>Deadline: {moment(task.deadline).format('DD/MM/YYYY')}</Text>
		</Card>
	);

	const cotTable: ColumnsType<TaskItem> = [
		{
			title: 'Tên task',
			dataIndex: 'ten',
			render: (value: string, record) => (
				<div>
					<Text strong>{value}</Text>
					<div style={{ color: '#777' }}>{record.moTa}</div>
				</div>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			render: (value: TrangThaiTask) => <Tag color={MAU_TRANG_THAI[value]}>{TEN_TRANG_THAI[value]}</Tag>,
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'uuTien',
			render: (value: MucDoUuTien) => <Tag color={MAU_UU_TIEN[value]}>{value}</Tag>,
		},
		{
			title: 'Tag',
			dataIndex: 'tag',
			render: (value: string) => <Tag>{value}</Tag>,
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			sorter: (a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf(),
			render: (value: string, record) => (
				<Text type={quaHan(record) ? 'danger' : undefined}>{moment(value).format('DD/MM/YYYY')}</Text>
			),
		},
		{
			title: 'Thao tác',
			width: 150,
			render: (_, record) => (
				<Space>
					<Button type="link" icon={<EditOutlined />} onClick={() => moFormSua(record)}>
						Sửa
					</Button>
					<Popconfirm title="Bạn muốn xóa task này?" onConfirm={() => xoaTask(record.id)}>
						<Button type="link" danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 20 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
				<h2 style={{ margin: 0 }}>Quản lý công việc cá nhân</h2>
				<Button type="primary" icon={<PlusOutlined />} onClick={() => moFormThem()}>
					Thêm task
				</Button>
			</div>

			<Tabs activeKey={tab} onChange={setTab} type="card">
				<Tabs.TabPane tab="Dashboard" key="dashboard">
					<Row gutter={[16, 16]}>
						<Col xs={24} md={8}>
							<Card>
								<Statistic title="Tổng số task" value={thongKe.tong} prefix={<ClockCircleOutlined />} />
							</Card>
						</Col>
						<Col xs={24} md={8}>
							<Card>
								<Statistic title="Task hoàn thành" value={thongKe.hoanThanh} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
							</Card>
						</Col>
						<Col xs={24} md={8}>
							<Card>
								<Statistic title="Task quá hạn" value={thongKe.quaHan} valueStyle={{ color: '#cf1322' }} prefix={<ExclamationCircleOutlined />} />
							</Card>
						</Col>
					</Row>
				</Tabs.TabPane>

				<Tabs.TabPane tab="Kanban Board" key="kanban">
					<DragDropContext onDragEnd={keoThaTask}>
						<Row gutter={[16, 16]}>
							{CAC_COT.map((cot) => {
								const taskTrongCot = dsTask.filter((item) => item.trangThai === cot.key);

								return (
									<Col xs={24} md={8} key={cot.key}>
										<div style={{ border: '1px solid #f0f0f0', borderRadius: 8, background: '#fafafa', padding: 12, minHeight: 520 }}>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
												<Space>
													<span style={{ width: 10, height: 10, background: cot.mau, borderRadius: 10, display: 'inline-block' }} />
													<Text strong>{cot.ten}</Text>
													<Tag>{taskTrongCot.length}</Tag>
												</Space>
												<Button size="small" icon={<PlusOutlined />} onClick={() => moFormThem(cot.key)} />
											</div>

											<Droppable droppableId={cot.key}>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.droppableProps}
														style={{
															minHeight: 430,
															padding: 4,
															borderRadius: 6,
															background: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent',
														}}
													>
														{taskTrongCot.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có task" />}
														{taskTrongCot.map((task, index) => (
															<Draggable key={task.id} draggableId={task.id} index={index}>
																{(dragProvided) => (
																	<div
																		ref={dragProvided.innerRef}
																		{...dragProvided.draggableProps}
																		{...dragProvided.dragHandleProps}
																		style={{
																			...dragProvided.draggableProps.style,
																		}}
																	>
																		{renderTaskCard(task)}
																	</div>
																)}
															</Draggable>
														))}
														{provided.placeholder}
													</div>
												)}
											</Droppable>
										</div>
									</Col>
								);
							})}
						</Row>
					</DragDropContext>
				</Tabs.TabPane>

				<Tabs.TabPane tab="Danh sách task" key="list">
					<Space style={{ marginBottom: 16 }} wrap>
						<Search
							allowClear
							placeholder="Tìm kiếm theo tên"
							value={tuKhoa}
							onChange={(e) => setTuKhoa(e.target.value)}
							style={{ width: 260 }}
						/>
						<Select value={locTrangThai} onChange={setLocTrangThai} style={{ width: 180 }}>
							<Select.Option value="all">Tất cả trạng thái</Select.Option>
							{CAC_COT.map((cot) => (
								<Select.Option key={cot.key} value={cot.key}>
									{cot.ten}
								</Select.Option>
							))}
						</Select>
					</Space>
					<Table<TaskItem> rowKey="id" columns={cotTable} dataSource={dsTaskDaLoc} pagination={{ pageSize: 6 }} />
				</Tabs.TabPane>
			</Tabs>

				<Modal
					visible={visible}
				title={taskDangSua ? 'Chỉnh sửa task' : 'Thêm task'}
				onCancel={() => setVisible(false)}
				onOk={() => form.submit()}
				okText="Lưu"
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical" onFinish={luuTask}>
					<Form.Item name="ten" label="Tên task" rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}>
						<Input placeholder="Nhập tên task" />
					</Form.Item>
					<Form.Item name="moTa" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
						<TextArea rows={3} placeholder="Nhập mô tả" />
					</Form.Item>
					<Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}>
						<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" showTime={false} />
					</Form.Item>
					<Form.Item name="uuTien" label="Mức độ ưu tiên" rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}>
						<Select>
							<Select.Option value="Cao">Cao</Select.Option>
							<Select.Option value="Trung bình">Trung bình</Select.Option>
							<Select.Option value="Thấp">Thấp</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item name="tag" label="Tag" rules={[{ required: true, message: 'Vui lòng nhập tag' }]}>
						<Input placeholder="VD: React, Bài tập" />
					</Form.Item>
					<Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
						<Select>
							{CAC_COT.map((cot) => (
								<Select.Option key={cot.key} value={cot.key}>
									{cot.ten}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyCongViec;
