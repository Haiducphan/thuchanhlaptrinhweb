import { Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Result, Row, Table, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalChiTiet from '../VanBang/components/ModalChiTiet';

const TraCuuVanBangPage = () => {
  const [form] = Form.useForm();
  const { traCuuVanBang, getChiTietVanBang, ketQua, loading, resetKetQua, setFilters, setSelectedIds } = useModel(
    'vanbang.tracuuvanbang',
  ) as any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void setFilters; // Stub for TableBase compatibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void setSelectedIds; // Stub for TableBase compatibility

  const [chiTietData, setChiTietData] = useState<any>(null);
  const [visibleChiTiet, setVisibleChiTiet] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Count filled fields
  const getFilledCount = () => {
    const values = form.getFieldsValue();
    let count = 0;
    if (values.so_hieu_van_bang) count++;
    if (values.so_vao_so) count++;
    if (values.ma_sinh_vien) count++;
    if (values.ho_ten) count++;
    if (values.ngay_sinh) count++;
    return count;
  };

  const handleTraCuu = async () => {
    const values = form.getFieldsValue();
    const filledCount = getFilledCount();

    if (filledCount < 2) {
      message.warning('Vui lòng nhập ít nhất 2 thông tin để tra cứu!');
      return;
    }

    const params: any = {};
    if (values.so_hieu_van_bang) params.so_hieu_van_bang = values.so_hieu_van_bang.trim();
    if (values.so_vao_so) params.so_vao_so = values.so_vao_so;
    if (values.ma_sinh_vien) params.ma_sinh_vien = values.ma_sinh_vien.trim();
    if (values.ho_ten) params.ho_ten = values.ho_ten.trim();
    if (values.ngay_sinh) params.ngay_sinh = moment(values.ngay_sinh).format('YYYY-MM-DD');

    try {
      await traCuuVanBang(params);
    } catch (er) {
      console.log(er);
    }
  };

  const handleReset = () => {
    form.resetFields();
    resetKetQua();
  };

  const handleViewDetail = async (record: any) => {
    setDetailLoading(true);
    try {
      const data = await getChiTietVanBang(record._id);
      setChiTietData(data);
      setVisibleChiTiet(true);
    } catch (er) {
      console.log(er);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: 'Số vào sổ',
      dataIndex: 'so_vao_so',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Số hiệu VB',
      dataIndex: 'so_hieu_van_bang',
      width: 180,
      render: (val: string) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'ma_sinh_vien',
      width: 130,
    },
    {
      title: 'Họ tên',
      dataIndex: 'ho_ten',
      width: 200,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngay_sinh',
      width: 120,
      render: (val: string) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Quyết định',
      dataIndex: ['quyetDinh', 'so_quyet_dinh'],
      width: 160,
      render: (_: any, record: any) =>
        record?.quyetDinh ? <Tag color="green">{record.quyetDinh.so_quyet_dinh}</Tag> : '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleViewDetail(record)} loading={detailLoading}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Card title="TRA CỨU VĂN BẰNG TỐT NGHIỆP" style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="so_hieu_van_bang" label="Số hiệu văn bằng">
                <Input placeholder="Ví dụ: YD-2025-001234" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="so_vao_so" label="Số vào sổ">
                <InputNumber placeholder="Số thứ tự trong sổ" style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="ma_sinh_vien" label="Mã sinh viên">
                <Input placeholder="Ví dụ: B2200001" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="ho_ten" label="Họ tên">
                <Input placeholder="Họ và tên sinh viên" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="ngay_sinh" label="Ngày sinh">
                <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày sinh" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center" gutter={16}>
            <Col>
              <Button type="primary" onClick={handleTraCuu} loading={loading}>
                Tra cứu
              </Button>
            </Col>
            <Col>
              <Button onClick={handleReset}>Nhập lại</Button>
            </Col>
          </Row>

          <div style={{ marginTop: 16, color: '#999', textAlign: 'center' }}>
            <small>
              <i>
                Vui lòng nhập ít nhất <strong>2 thông tin</strong> để tra cứu
              </i>
            </small>
          </div>
        </Form>
      </Card>

      {/* Kết quả tra cứu */}
      {ketQua.length > 0 && (
        <Card title={`Kết quả tra cứu (${ketQua.length} văn bằng)`} style={{ marginBottom: 24 }}>
          <Table
            dataSource={ketQua}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            bordered
          />
        </Card>
      )}

      {/* Không có kết quả */}
      {ketQua.length === 0 && form.isFieldsTouched() && !loading && (
        <Result
          status="info"
          title="Không tìm thấy văn bằng"
          subTitle="Vui lòng kiểm tra lại thông tin tra cứu hoặc thử với các thông tin khác."
        />
      )}

      {/* Modal chi tiết */}
      {visibleChiTiet && chiTietData && (
        <ModalChiTiet
          visible={visibleChiTiet}
          onClose={() => setVisibleChiTiet(false)}
          data={chiTietData}
        />
      )}
    </div>
  );
};

export default TraCuuVanBangPage;
