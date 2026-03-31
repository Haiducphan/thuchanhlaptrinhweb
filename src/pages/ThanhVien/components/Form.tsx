import { Button, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

const FormThanhVien = (props: {
	record?: ThanhVien.IRecord;
	edit: boolean;
	visible: boolean;
	onClose: () => void;
	onSave: (values: any) => void;
	danhSachCLB: any[];
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (props.visible) {
			setTimeout(() => {
				if (props.record?._id) {
					form.setFieldsValue(props.record);
				} else {
					form.resetFields();
				}
			}, 100);
		}
	}, [props.visible, props.record?._id]);

	const onFinish = (values: any) => {
		props.onSave(values);
	};

	const handleClose = () => {
		form.resetFields();
		props.onClose();
	};

	return (
		<Modal
			visible={props.visible}
			title={(props.edit ? 'Chỉnh sửa' : 'Thêm mới') + ' thành viên'}
			onCancel={handleClose}
			footer={null}
			width={550}
			zIndex={2000}
			maskClosable={false}
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item name="hoTen" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
					<Input placeholder="Họ tên thành viên" />
				</Form.Item>
				<Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
					<Input placeholder="Email" />
				</Form.Item>
				<Form.Item name="sdt" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
					<Input placeholder="Số điện thoại" />
				</Form.Item>
				<Form.Item name="gioiTinh" label="Giới tính">
					<Select placeholder="Chọn giới tính" dropdownStyle={{ zIndex: 3000 }}>
						<Select.Option value="Nam">Nam</Select.Option>
						<Select.Option value="Nữ">Nữ</Select.Option>
						<Select.Option value="Khác">Khác</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item name="diaChi" label="Địa chỉ">
					<Input.TextArea rows={2} placeholder="Địa chỉ" />
				</Form.Item>
				<Form.Item name="soTruong" label="Sở trường">
					<Input placeholder="Sở trường" />
				</Form.Item>
				<Form.Item name="cauLacBoId" label="Câu lạc bộ" rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}>
					<Select showSearch placeholder="Chọn câu lạc bộ" dropdownStyle={{ zIndex: 3000 }} filterOption={(input, option) =>
						(String((option as any)?.children) ?? '').toLowerCase().includes(input.toLowerCase())
					}>
						{props.danhSachCLB?.map((clb: any) => (
							<Select.Option key={clb._id} value={clb._id}>{clb.ten}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<div style={{ display: 'flex', gap: 8 }}>
					<Button type="primary" htmlType="submit">{props.edit ? 'Lưu lại' : 'Thêm mới'}</Button>
					<Button onClick={handleClose}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormThanhVien;
