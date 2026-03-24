import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, InputNumber } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSoVanBang = (props: { title?: string }) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('vanbang.sovanbang');
  const title = props?.title ?? 'Sổ văn bằng';

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) form.setFieldsValue(record);
  }, [record?._id, visibleForm]);

  const onFinish = async (values: SoVanBang.IRecord) => {
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
          name="nam"
          label="Năm"
          rules={[...rules.required]}
          extra="Mỗi năm chỉ có một sổ văn bằng"
        >
          <InputNumber
            placeholder="Ví dụ: 2025"
            min={2000}
            max={2100}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item name="ten_so" label="Tên sổ">
          <Input placeholder="Ví dụ: Sổ văn bằng năm 2025" />
        </Form.Item>

        <Form.Item name="ghi_chu" label="Ghi chú">
          <Input.TextArea placeholder="Ghi chú thêm (không bắt buộc)" rows={3} />
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

export default FormSoVanBang;
