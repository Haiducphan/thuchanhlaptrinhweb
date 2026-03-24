import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, InputNumber, Select, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormVanBang = (props: { title?: string }) => {
  const [form] = Form.useForm();
  const {
    record,
    setVisibleForm,
    edit,
    postModel,
    putModel,
    formSubmiting,
    visibleForm,
    getChiTietVanBangModel,
  } = useModel('vanbang.vanbang') as any;

  const [soVaoSo, setSoVaoSo] = useState<number | null>(null);
  const [loadingChiTiet, setLoadingChiTiet] = useState(false);
  const [chiTietList, setChiTietList] = useState<
    Array<{ truong_cau_hinh_id: string; gia_tri?: string; _id?: string }>
  >([]);

  const title = props?.title ?? 'Văn bằng';

  // Lấy danh sách quyết định
  const { getAllModel: getAllQD } = useModel('vanbang.quyetdinh') as any;
  const { danhSach: dsQuyetDinh } = useModel('vanbang.quyetdinh') as any;

  // Lấy danh sách trường cấu hình
  const { getAllModel: getAllTCD, danhSach: dsTruongCauHinh } = useModel('vanbang.truongcauhinh') as any;

  useEffect(() => {
    getAllQD();
    getAllTCD();
  }, []);

  // Reset form when closing
  useEffect(() => {
    if (!visibleForm) {
      resetFieldsForm(form);
      setChiTietList([]);
      setSoVaoSo(null);
    }
  }, [visibleForm]);

  // Khi edit, load chi tiết
  useEffect(() => {
    if (visibleForm && edit && record?._id) {
      setLoadingChiTiet(true);
      getChiTietVanBangModel(record._id)
        .then((data: any) => {
          // Set giá trị form chính
          form.setFieldsValue({
            ...record,
            ngay_sinh: record?.ngay_sinh ? moment(record.ngay_sinh) : undefined,
          });

          // Set số vào sổ (readonly)
          setSoVaoSo(record.so_vao_so);

          // Set chi tiết động
          if (data?.chiTietList) {
            const details = data.chiTietList.map((ct: any) => ({
              truong_cau_hinh_id: ct.truongCauHinh?._id,
              gia_tri: ct.gia_tri,
              _id: ct._id,
            }));
            setChiTietList(details);

            // Set giá trị vào form
            const dynamicValues: any = {};
            details.forEach((ct: any) => {
              const truong = dsTruongCauHinh?.find((t: any) => t._id === ct.truong_cau_hinh_id);
              if (truong) {
                if (truong.kieu_du_lieu === 'Date' && ct.gia_tri) {
                  dynamicValues[`dynamic_${ct.truong_cau_hinh_id}`] = moment(ct.gia_tri);
                } else {
                  dynamicValues[`dynamic_${ct.truong_cau_hinh_id}`] = ct.gia_tri;
                }
              }
            });
            form.setFieldsValue(dynamicValues);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingChiTiet(false));
    } else if (visibleForm && !edit) {
      // Thêm mới - reset
      setChiTietList([]);
      setSoVaoSo(null);
    }
  }, [record?._id, visibleForm, edit]);

  const handleQuyetDinhChange = (qdId: string) => {
    if (!edit) {
      // Khi chọn quyết định mới (thêm mới), lấy số vào sổ tiếp theo
      const selectedQD = dsQuyetDinh?.find((qd: any) => qd._id === qdId);
      if (selectedQD) {
        // Số vào sổ sẽ được server tự động gán khi tạo
        // Client hiển thị placeholder
        setSoVaoSo(null);
      }
    }
  };

  const onFinish = async (values: any) => {
    try {
      // Tách giá trị động
      const dynamicFields: Array<{ truong_cau_hinh_id: string; gia_tri?: string; _id?: string }> = [];

      (dsTruongCauHinh as TruongCauHinh.IRecord[])?.forEach((truong: TruongCauHinh.IRecord) => {
        const key = `dynamic_${truong._id}`;
        let giaTri = values[key];

        // Chuyển đổi giá trị theo kiểu dữ liệu
        if (truong.kieu_du_lieu === 'Date' && giaTri) {
          giaTri = moment(giaTri).format('YYYY-MM-DD');
        } else if (truong.kieu_du_lieu === 'Number' && giaTri) {
          giaTri = String(giaTri);
        }

        if (giaTri !== undefined && giaTri !== null && giaTri !== '') {
          // Tìm chi tiết cũ (nếu edit)
          const existingChiTiet = chiTietList.find((ct) => ct.truong_cau_hinh_id === truong._id);
          dynamicFields.push({
            truong_cau_hinh_id: truong._id,
            gia_tri: giaTri,
            _id: existingChiTiet?._id,
          });
        }
      });

      // Loại bỏ giá trị động khỏi form chính
      const vanBangData: any = { ...values };
      (dsTruongCauHinh as any)?.forEach((truong: any) => {
        delete vanBangData[`dynamic_${truong._id}`];
      });

      // Chuyển đổi ngày sinh
      if (vanBangData.ngay_sinh) {
        vanBangData.ngay_sinh = moment(vanBangData.ngay_sinh).format('YYYY-MM-DD');
      }

      const payload = {
        vanBang: vanBangData,
        chiTietList: dynamicFields,
      };

      if (edit) {
        await putModel(record._id, payload);
      } else {
        await postModel(payload);
      }
    } catch (er) {
      console.log(er);
    }
  };

  const renderDynamicField = (truong: TruongCauHinh.IRecord) => {
    const key = `dynamic_${truong._id}`;
    const rulesDynamic = truong.bat_buoc ? [...rules.required] : [];

    switch (truong.kieu_du_lieu) {
      case 'String':
        return (
          <Form.Item
            key={truong._id}
            name={key}
            label={truong.ten_truong}
            rules={rulesDynamic}
          >
            <Input placeholder={`Nhập ${truong.ten_truong.toLowerCase()}`} />
          </Form.Item>
        );
      case 'Number':
        return (
          <Form.Item
            key={truong._id}
            name={key}
            label={truong.ten_truong}
            rules={rulesDynamic}
          >
            <InputNumber
              placeholder={`Nhập ${truong.ten_truong.toLowerCase()}`}
              style={{ width: '100%' }}
            />
          </Form.Item>
        );
      case 'Date':
        return (
          <Form.Item
            key={truong._id}
            name={key}
            label={truong.ten_truong}
            rules={rulesDynamic}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              style={{ width: '100%' }}
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title.toLowerCase()}>
      <Spin spinning={loadingChiTiet}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          {/* Thông tin cố định */}
          <Form.Item
            name="quyet_dinh_id"
            label="Quyết định tốt nghiệp"
            rules={[...rules.required]}
          >
            <Select
              placeholder="Chọn quyết định tốt nghiệp"
              showSearch
              optionFilterProp="children"
              onChange={handleQuyetDinhChange}
              disabled={edit}
            >
              {(dsQuyetDinh as QuyetDinh.IRecord[])?.map((qd) => (
                <Select.Option key={qd._id} value={qd._id}>
                  {qd.so_quyet_dinh} - {moment(qd.ngay_ban_hanh).format('DD/MM/YYYY')}
                  {qd.soVanBang ? ` (Sổ năm ${qd.soVanBang.nam})` : ''}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="so_vao_so"
            label="Số vào sổ"
            extra={
              soVaoSo
                ? undefined
                : 'Số vào sổ sẽ được tự động tăng khi lưu'
            }
          >
            {edit ? (
              <InputNumber value={soVaoSo} disabled style={{ width: '100%' }} />
            ) : (
              <Input value={soVaoSo ? `Sẽ được gán tự động` : ''} disabled placeholder="Sẽ được gán tự động khi lưu" />
            )}
          </Form.Item>

          <Form.Item
            name="so_hieu_van_bang"
            label="Số hiệu văn bằng"
            rules={[...rules.required, ...rules.text]}
          >
            <Input placeholder="Ví dụ: YD-2025-001234" />
          </Form.Item>

          <Form.Item
            name="ma_sinh_vien"
            label="Mã sinh viên"
            rules={[...rules.required, ...rules.text]}
          >
            <Input placeholder="Ví dụ: B2200001" />
          </Form.Item>

          <Form.Item
            name="ho_ten"
            label="Họ tên"
            rules={[...rules.required, ...rules.text]}
          >
            <Input placeholder="Họ và tên sinh viên" />
          </Form.Item>

          <Form.Item
            name="ngay_sinh"
            label="Ngày sinh"
            rules={[...rules.required]}
          >
            <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày sinh" style={{ width: '100%' }} />
          </Form.Item>

          {/* Separator */}
          <div style={{ margin: '24px 0 16px', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#999', fontSize: 14 }}>
              --- Thông tin bổ sung (theo cấu hình biểu mẫu) ---
            </span>
          </div>

          {/* Render các trường động */}
          {(dsTruongCauHinh as TruongCauHinh.IRecord[])?.map((truong) =>
            renderDynamicField(truong)
          )}

          <div className="form-footer">
            <Button loading={formSubmiting} htmlType="submit" type="primary">
              {!edit ? 'Thêm mới' : 'Lưu lại'}
            </Button>
            <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
          </div>
        </Form>
      </Spin>
    </Card>
  );
};

export default FormVanBang;
