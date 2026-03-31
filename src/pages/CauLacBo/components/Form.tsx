import { Button, DatePicker, Form, Input, Modal, Switch } from 'antd';
import { useEffect } from 'react';
import moment from 'moment';

const FormCauLacBo = (props: {
	record?: CauLacBo.IRecord;
	edit: boolean;
	visible: boolean;
	onClose: () => void;
	onSave: (values: any) => void;
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (props.visible) {
			if (props.record?._id) {
				form.setFieldsValue({
					...props.record,
					ngayThanhLap: props.record.ngayThanhLap ? moment(props.record.ngayThanhLap, 'YYYY-MM-DD') : null,
				});
			} else {
				form.resetFields();
			}
		}
	}, [props.visible, props.record?._id]);

	const onFinish = (values: any) => {
		props.onSave({
			...values,
			ngayThanhLap: values.ngayThanhLap?.format ? values.ngayThanhLap.format('YYYY-MM-DD') : values.ngayThanhLap,
		});
	};

	const handleClose = () => {
		form.resetFields();
		props.onClose();
	};

	return (
		<Modal
			visible={props.visible}
			title={(props.edit ? 'Chỉnh sửa' : 'Thêm mới') + ' câu lạc bộ'}
			onCancel={handleClose}
			footer={null}
			width={500}
			zIndex={2000}
			maskClosable={false}
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item name="ten" label="Tên câu lạc bộ" rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}>
					<Input placeholder="Tên câu lạc bộ" />
				</Form.Item>
				<Form.Item name="anhDaiDien" label="Ảnh đại diện">
					<Input placeholder="URL ảnh đại diện" />
				</Form.Item>
				<Form.Item name="ngayThanhLap" label="Ngày thành lập">
					<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" popupStyle={{ zIndex: 3000 }} />
				</Form.Item>
				<Form.Item name="moTa" label="Mô tả">
					<Input.TextArea rows={3} placeholder="Mô tả câu lạc bộ" />
				</Form.Item>
				<Form.Item name="chunhiemClb" label="Chủ nhiệm CLB">
					<Input placeholder="Tên chủ nhiệm" />
				</Form.Item>
				<Form.Item name="hoatDong" label="Hoạt động" valuePropName="checked" initialValue={true}>
					<Switch checkedChildren="Có" unCheckedChildren="Không" />
				</Form.Item>
				<div style={{ display: 'flex', gap: 8 }}>
					<Button type="primary" htmlType="submit">{props.edit ? 'Lưu lại' : 'Thêm mới'}</Button>
					<Button onClick={handleClose}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormCauLacBo;
