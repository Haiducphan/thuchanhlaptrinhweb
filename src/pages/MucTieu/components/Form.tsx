import { Button, DatePicker, Drawer, Form, Input, InputNumber, Select } from 'antd';
import { useEffect } from 'react';
import moment from 'moment';

const FormMucTieu = (props: {
	record?: MucTieu.IRecord;
	edit: boolean;
	visible: boolean;
	onClose: () => void;
	onSave: (values: any) => void;
	loaiOptions: string[];
	trangThaiOptions: string[];
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (props.visible) {
			if (props.record?._id) {
				form.setFieldsValue({
					...props.record,
					deadline: props.record.deadline ? moment(props.record.deadline, 'YYYY-MM-DD') : null,
				});
			} else {
				form.resetFields();
				form.setFieldsValue({ trangThai: 'Đang thực hiện' });
			}
		}
	}, [props.visible, props.record?._id]);

	const onFinish = (values: any) => {
		props.onSave({
			...values,
			deadline: values.deadline?.format ? values.deadline.format('YYYY-MM-DD') : values.deadline,
		});
	};

	return (
		<Drawer
			visible={props.visible}
			title={props.edit ? 'Chỉnh sửa mục tiêu' : 'Thêm mục tiêu mới'}
			onClose={props.onClose}
			width={400}
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item name="ten" label="Tên mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}>
					<Input placeholder="VD: Giảm 5kg trong 2 tháng" />
				</Form.Item>
				<Form.Item name="loai" label="Loại mục tiêu" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
					<Select placeholder="Chọn loại mục tiêu">
						{props.loaiOptions.map((item) => (
							<Select.Option key={item} value={item}>{item}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name="giaTriMucTieu" label="Giá trị mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}>
					<InputNumber placeholder="VD: 5" style={{ width: '100%' }} min={0} />
				</Form.Item>
				<Form.Item name="giaTriHienTai" label="Giá trị hiện tại" rules={[{ required: true, message: 'Vui lòng nhập giá trị hiện tại' }]}>
					<InputNumber placeholder="VD: 0" style={{ width: '100%' }} min={0} />
				</Form.Item>
				<Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}>
					<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" popupStyle={{ zIndex: 3000 }} />
				</Form.Item>
				<Form.Item name="trangThai" label="Trạng thái">
					<Select>
						{props.trangThaiOptions.map((item) => (
							<Select.Option key={item} value={item}>{item}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<div style={{ display: 'flex', gap: 8 }}>
					<Button type="primary" htmlType="submit">{props.edit ? 'Lưu lại' : 'Thêm mới'}</Button>
					<Button onClick={props.onClose}>Hủy</Button>
				</div>
			</Form>
		</Drawer>
	);
};

export default FormMucTieu;
