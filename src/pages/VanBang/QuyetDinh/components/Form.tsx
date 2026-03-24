import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormQuyetDinh = (props: { title?: string }) => {
  const [form] = Form.useForm();
  const {
    record,
    setVisibleForm,
    edit,
    postModel,
    putModel,
    formSubmiting,
    visibleForm,
  } = useModel('vanbang.quyetdinh');

  // Lấy danh sách sổ văn bằng
  const { getAllModel: getAllSoVanBangService } = useModel('vanbang.sovanbang') as any;

  const title = props?.title ?? 'Quyết định tốt nghiệp';

  useEffect(() => {
    // Lấy danh sách sổ văn bằng khi mở form
    (getAllSoVanBangService as any)(undefined, undefined, undefined, 'many');
  }, []);

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) {
      form.setFieldsValue({
        ...record,
        ngay_ban_hanh: record?.ngay_ban_hanh ? moment(record.ngay_ban_hanh) : undefined,
      });
    }
  }, [record?._id, visibleForm]);

  const onFinish = async (values: QuyetDinh.IRecord) => {
    try {
      const payload = {
        ...values,
        ngay_ban_hanh: values?.ngay_ban_hanh
          ? moment(values.ngay_ban_hanh).format('YYYY-MM-DD')
          : undefined,
      };
      if (edit) {
        await putModel(record?._id ?? '', payload);
      } else {
        await postModel(payload);
        form.resetFields();
      }
    } catch (er) {
      console.log(er);
    }
  };

  // Lấy danh sách sổ văn bằng từ model sovanbang
  const { danhSach: dsSoVanBang } = useModel('vanbang.sovanbang') as any;

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title.toLowerCase()}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          name="so_quyet_dinh"
          label="Số quyết định"
          rules={[...rules.required, ...rules.text]}
        >
          <Input placeholder="Ví dụ: 1234/QĐ-ĐHCN" />
        </Form.Item>

        <Form.Item
          name="ngay_ban_hanh"
          label="Ngày ban hành"
          rules={[...rules.required]}
        >
          <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày ban hành" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="trich_yeu"
          label="Trích yếu"
          rules={[...rules.required]}
        >
          <Input.TextArea placeholder="Nội dung trích yếu quyết định" rows={3} />
        </Form.Item>

        <Form.Item
          name="so_van_bang_id"
          label="Sổ văn bằng"
          rules={[...rules.required]}
        >
          <Select
            placeholder="Chọn sổ văn bằng"
            showSearch
            optionFilterProp="children"
          >
            {(dsSoVanBang as SoVanBang.IRecord[])?.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                Sổ năm {item.nam} {item.ten_so ? `- ${item.ten_so}` : ''}
              </Select.Option>
            ))}
          </Select>
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

export default FormQuyetDinh;
