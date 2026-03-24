import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, InputNumber, Select, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormTruongCauHinh = (props: { title?: string }) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('vanbang.truongcauhinh');
  const title = props?.title ?? 'Trường cấu hình';

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) form.setFieldsValue(record);
  }, [record?._id, visibleForm]);

  const onFinish = async (values: TruongCauHinh.IRecord) => {
    try {
      if (edit) {
        await putModel(record?._id ?? '', values);
      } else {
        await postModel(values);
        form.resetFields();
      }
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title.toLowerCase()}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          name="ten_truong"
          label="Tên trường"
          rules={[...rules.required, ...rules.text]}
          extra="Tên hiển thị trên biểu mẫu văn bằng"
        >
          <Input placeholder="Ví dụ: Điểm trung bình, Dân tộc, Nơi sinh" />
        </Form.Item>

        <Form.Item
          name="kieu_du_lieu"
          label="Kiểu dữ liệu"
          rules={[...rules.required]}
          extra="Quyết định control nhập liệu trên biểu mẫu"
        >
          <Select placeholder="Chọn kiểu dữ liệu">
            <Select.Option value="String">
              <span>String (Văn bản)</span>
            </Select.Option>
            <Select.Option value="Number">
              <span>Number (Số)</span>
            </Select.Option>
            <Select.Option value="Date">
              <span>Date (Ngày tháng)</span>
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="thu_tu_hien_thi"
          label="Thứ tự hiển thị"
          extra="Số thứ tự để sắp xếp trường trên biểu mẫu"
        >
          <InputNumber min={1} max={100} placeholder="1" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="bat_buoc"
          label="Bắt buộc"
          valuePropName="checked"
          extra="Nếu bật, trường này sẽ bắt buộc nhập khi tạo văn bằng"
        >
          <Switch />
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormTruongCauHinh;
