import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';

const FormBaiTap = (props: {
	record?: BaiTap.IRecord;
	edit: boolean;
	visible: boolean;
	onClose: () => void;
	onSave: (values: any) => void;
	nhomCoOptions: string[];
	mucDoOptions: string[];
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (props.visible) {
			if (props.record?._id) {
				form.setFieldsValue(props.record);
			} else {
				form.resetFields();
			}
		}
	}, [props.visible, props.record?._id]);

	const onFinish = (values: any) => {
		props.onSave(values);
	};

	return (
		<Modal
			visible={props.visible}
			title={props.edit ? 'Sửa bài tập' : 'Thêm bài tập mới'}
			onCancel={props.onClose}
			footer={null}
			width={500}
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item name="ten" label="Tên bài tập" rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
					<Input placeholder="VD: Hít đất" />
				</Form.Item>
				<Form.Item name="nhomCo" label="Nhóm cơ" rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}>
					<Select placeholder="Chọn nhóm cơ">
						{props.nhomCoOptions.map((item) => (
							<Select.Option key={item} value={item}>{item}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name="mucDo" label="Mức độ khó" rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}>
					<Select placeholder="Chọn mức độ">
						{props.mucDoOptions.map((item) => (
							<Select.Option key={item} value={item}>{item}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name="moTa" label="Mô tả ngắn" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
					<Input.TextArea rows={2} placeholder="Mô tả ngắn về bài tập" />
				</Form.Item>
				<Form.Item name="calo" label="Calo đốt/giờ" rules={[{ required: true, message: 'Vui lòng nhập calo' }]}>
					<InputNumber placeholder="VD: 300" style={{ width: '100%' }} min={0} />
				</Form.Item>
				<Form.Item name="huongDan" label="Hướng dẫn thực hiện">
					<Input.TextArea rows={5} placeholder="Hướng dẫn chi tiết các bước thực hiện bài tập" />
				</Form.Item>
				<div style={{ display: 'flex', gap: 8 }}>
					<Button type="primary" htmlType="submit">{props.edit ? 'Lưu lại' : 'Thêm mới'}</Button>
					<Button onClick={props.onClose}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormBaiTap;
