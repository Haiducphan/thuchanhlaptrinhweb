import React, { useState, useMemo, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, Tag, message, Card, Typography, Popconfirm, Row, Col, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useKhoaHocModel } from '../../models/khoahoc';

const { Title, Text, Paragraph } = Typography;

const KhoaHocPage = () => {
  const { danhSachKhoaHoc, giangVienList, trangThaiList, trangThaiLabel, trangThaiColor, themKhoaHoc, suaKhoaHoc, xoaKhoaHoc, kiemTraTenTrung } = useKhoaHocModel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalChiTiet, setIsModalChiTiet] = useState(false);
  const [khoaHocChiTiet, setKhoaHocChiTiet] = useState<any>(null);
  const [dangSua, setDangSua] = useState<any>(null);
  const [form] = Form.useForm();
  const [animId, setAnimId] = useState<string | null>(null);
  const [fadeId, setFadeId] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [filterGiangVien, setFilterGiangVien] = useState<string | null>(null);
  const [filterTrangThai, setFilterTrangThai] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);

  const danhSachLoc = useMemo(() => {
    let ketQua = [...danhSachKhoaHoc];

    if (searchText) {
      ketQua = ketQua.filter(k => k.tenKhoaHoc.toLowerCase().includes(searchText.toLowerCase()));
    }

    if (filterGiangVien) {
      ketQua = ketQua.filter(k => k.giangVien === filterGiangVien);
    }

    if (filterTrangThai) {
      ketQua = ketQua.filter(k => k.trangThai === filterTrangThai);
    }

    if (sortOrder) {
      ketQua = [...ketQua].sort((a, b) => {
        return sortOrder === 'ascend' ? a.soLuongHocVien - b.soLuongHocVien : b.soLuongHocVien - a.soLuongHocVien;
      });
    }

    return ketQua;
  }, [danhSachKhoaHoc, searchText, filterGiangVien, filterTrangThai, sortOrder]);

  const openModalThem = () => {
    setDangSua(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openModalSua = (record: any) => {
    setDangSua(record);
    form.setFieldsValue({
      tenKhoaHoc: record.tenKhoaHoc,
      giangVien: record.giangVien,
      soLuongHocVien: record.soLuongHocVien,
      moTa: record.moTa,
      trangThai: record.trangThai,
    });
    setIsModalOpen(true);
  };

  const xuLyLuu = (values: any) => {
    if (kiemTraTenTrung(values.tenKhoaHoc, dangSua?.id)) {
      message.error('Tên khóa học đã tồn tại, vui lòng chọn tên khác!');
      return;
    }

    if (dangSua) {
      suaKhoaHoc(dangSua.id, values);
      message.success('Cập nhật khóa học thành công!');
    } else {
      const moi = themKhoaHoc(values);
      setAnimId(moi.id);
      message.success('Thêm khóa học mới thành công!');
    }

    setIsModalOpen(false);
    form.resetFields();
    setDangSua(null);
  };

  const xuLyXoa = (record: any) => {
    if (record.soLuongHocVien > 0) {
      message.error('Không thể xóa khóa học đã có học viên!');
      return;
    }
    setFadeId(record.id);
    setTimeout(() => {
      xoaKhoaHoc(record.id);
      message.success('Xóa khóa học thành công!');
    }, 400);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVien',
      key: 'giangVien',
    },
    {
      title: 'Số học viên',
      dataIndex: 'soLuongHocVien',
      key: 'soLuongHocVien',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string) => (
        <Tag color={trangThaiColor[trangThai]}>{trangThaiLabel[trangThai]}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      width: 150,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'ngayCapNhat',
      key: 'ngayCapNhat',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      render: (_: any, record: any) => {
        const isFading = fadeId === record.id;
        const isAnim = animId === record.id;
        return (
          <div style={{
            transition: 'opacity 0.4s ease',
            opacity: isFading ? 0.2 : 1,
            background: isAnim ? '#e6f7ff' : 'transparent',
            borderRadius: 4,
            border: isAnim ? '1px solid #1890ff' : 'none',
            padding: isAnim ? '4px' : '0',
          }}>
            <Space size="middle">
              <Button type="link" icon={<EyeOutlined />} onClick={() => { setKhoaHocChiTiet(record); setIsModalChiTiet(true); }}>Chi tiết</Button>
              <Button type="link" icon={<EditOutlined />} onClick={() => openModalSua(record)}>Sửa</Button>
              <Popconfirm
                title="Bạn có chắc muốn xóa khóa học này?"
                onConfirm={() => xuLyXoa(record)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card bordered={false} title={<Title level={4} style={{ margin: 0, color: '#1890ff' }}>QUẢN LÝ KHÓA HỌC ONLINE</Title>}>
        <div style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên khóa học..."
            style={{ width: 300, marginRight: 16 }}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            placeholder="Lọc theo giảng viên"
            style={{ width: 200, marginRight: 16 }}
            allowClear
            onChange={(value) => setFilterGiangVien(value)}
          >
            {giangVienList.map(gv => (
              <Select.Option key={gv} value={gv}>{gv}</Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 180, marginRight: 16 }}
            allowClear
            onChange={(value) => setFilterTrangThai(value)}
          >
            {trangThaiList.map(tt => (
              <Select.Option key={tt} value={tt}>{trangThaiLabel[tt]}</Select.Option>
            ))}
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={openModalThem}>Thêm khóa học</Button>
        </div>

        <Table
          dataSource={danhSachLoc}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          onChange={(pagination, filters, sorter: any) => {
            const order = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;
            if (order) {
              setSortOrder(order);
            } else {
              setSortOrder(null);
            }
          }}
        />
      </Card>

      <Modal
        title={dangSua ? 'Sửa thông tin khóa học' : 'Thêm khóa học mới'}
        visible={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setDangSua(null); }}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={xuLyLuu}>
          <Form.Item
            name="tenKhoaHoc"
            label="Tên khóa học"
            rules={[
              { required: true, message: 'Vui lòng nhập tên khóa học!' },
              { max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự!' },
            ]}
          >
            <Input placeholder="Nhập tên khóa học (tối đa 100 ký tự)" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="giangVien"
            label="Giảng viên"
            rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
          >
            <Select placeholder="Chọn giảng viên">
              {giangVienList.map(gv => (
                <Select.Option key={gv} value={gv}>{gv}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="soLuongHocVien"
            label="Số lượng học viên"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số học viên" />
          </Form.Item>

          <Form.Item
            name="moTa"
            label="Mô tả khóa học (HTML)"
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả khóa học (hỗ trợ HTML)" />
          </Form.Item>

          <Form.Item
            name="trangThai"
            label="Trạng thái khóa học"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              {trangThaiList.map(tt => (
                <Select.Option key={tt} value={tt}>{trangThaiLabel[tt]}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<span style={{ color: '#1890ff' }}>📖 Chi tiết khóa học</span>}
        visible={isModalChiTiet}
        onCancel={() => { setIsModalChiTiet(false); setKhoaHocChiTiet(null); }}
        footer={<Button type="primary" onClick={() => { setIsModalChiTiet(false); openModalSua(khoaHocChiTiet); }} icon={<EditOutlined />}>Chỉnh sửa</Button>}
        width={700}
      >
        {khoaHocChiTiet && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={4}>{khoaHocChiTiet.tenKhoaHoc}</Title>
                <Tag color={trangThaiColor[khoaHocChiTiet.trangThai]} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {trangThaiLabel[khoaHocChiTiet.trangThai]}
                </Tag>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" bordered={false} style={{ background: '#f0f2f5' }}>
                  <Text type="secondary"><UserOutlined /> Giảng viên</Text>
                  <div style={{ fontWeight: 600, fontSize: 16, marginTop: 4 }}>{khoaHocChiTiet.giangVien}</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" bordered={false} style={{ background: '#f0f2f5' }}>
                  <Text type="secondary"><TeamOutlined /> Số học viên</Text>
                  <div style={{ fontWeight: 600, fontSize: 16, marginTop: 4, color: '#1890ff' }}>{khoaHocChiTiet.soLuongHocVien} học viên</div>
                </Card>
              </Col>
            </Row>

            <Divider orientation="left">Mô tả khóa học</Divider>

            <Card bordered style={{ background: '#fafafa' }}>
              <Paragraph>
                {khoaHocChiTiet.moTa ? (
                  <span dangerouslySetInnerHTML={{ __html: khoaHocChiTiet.moTa }} />
                ) : (
                  <Text type="secondary">Khóa học chưa có mô tả.</Text>
                )}
              </Paragraph>
            </Card>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Text type="secondary">ID: </Text><Text strong>{khoaHocChiTiet.id}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Ngày tạo: </Text><Text strong>{khoaHocChiTiet.ngayTao}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Ngày cập nhật: </Text><Text strong>{khoaHocChiTiet.ngayCapNhat}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KhoaHocPage;
