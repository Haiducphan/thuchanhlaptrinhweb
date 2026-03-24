import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ModalChiTiet from './components/ModalChiTiet';

const VanBangPage = () => {
  const {
    getModel,
    page,
    limit,
    deleteModel,
    handleEdit,
    getChiTietVanBangModel,
  } = useModel('vanbang.vanbang') as any;

  const [visibleChiTiet, setVisibleChiTiet] = useState(false);
  const [chiTietData, setChiTietData] = useState<any>(null);

  useEffect(() => {
    getModel();
  }, []);

  const handleViewChiTiet = async (rec: VanBang.IRecord) => {
    try {
      const data = await getChiTietVanBangModel(rec._id);
      setChiTietData({ vanBang: rec, chiTiet: data });
      setVisibleChiTiet(true);
    } catch (er) {
      console.log(er);
    }
  };

  const columns: IColumn<VanBang.IRecord>[] = [
    {
      title: 'Số vào sổ',
      dataIndex: 'so_vao_so',
      width: 100,
      align: 'center',
      filterType: 'number',
    },
    {
      title: 'Số hiệu VB',
      dataIndex: 'so_hieu_van_bang',
      width: 180,
      filterType: 'string',
      render: (val) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'ma_sinh_vien',
      width: 130,
      filterType: 'string',
    },
    {
      title: 'Họ tên',
      dataIndex: 'ho_ten',
      width: 200,
      filterType: 'string',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngay_sinh',
      width: 120,
      filterType: 'date',
      render: (val) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Quyết định',
      dataIndex: ['quyetDinh', 'so_quyet_dinh'],
      width: 160,
      render: (_, record) =>
        record?.quyetDinh ? (
          <Tag color="green">{record.quyetDinh.so_quyet_dinh}</Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      filterType: 'datetime',
      render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : '-'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 130,
      fixed: 'right',
      render: (rec: VanBang.IRecord) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Button onClick={() => handleViewChiTiet(rec)} type="link" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(rec._id, getModel)}
              title="Bạn có chắc chắn muốn xóa văn bằng này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        dependencies={[page, limit]}
        modelName="vanbang.vanbang"
        title="Quản lý Thông tin Văn bằng"
        Form={Form as any}
        buttons={{ import: false }}
      />
      {visibleChiTiet && chiTietData && (
        <ModalChiTiet
          visible={visibleChiTiet}
          onClose={() => setVisibleChiTiet(false)}
          data={chiTietData}
        />
      )}
    </>
  );
};

export default VanBangPage;
