import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const QuyetDinhPage = () => {
  const {
    getModel,
    page,
    limit,
    deleteModel,
    handleEdit,
  } = useModel('vanbang.quyetdinh');

  // Load danh sách sổ văn bằng khi mount (cho Form QuyetDinh)
  const { getAllModel: getAllSVB } = useModel('vanbang.sovanbang') as any;

  useEffect(() => {
    getAllSVB();
  }, []);

  const columns: IColumn<QuyetDinh.IRecord>[] = [
    {
      title: 'Số QĐ',
      dataIndex: 'so_quyet_dinh',
      width: 150,
      filterType: 'string',
      render: (val) => <Tag color="green">{val}</Tag>,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngay_ban_hanh',
      width: 130,
      filterType: 'date',
      render: (val) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Trích yếu',
      dataIndex: 'trich_yeu',
      width: 300,
      filterType: 'string',
    },
    {
      title: 'Sổ VB năm',
      dataIndex: ['soVanBang', 'nam'],
      width: 100,
      align: 'center',
      render: (val, record) => (
        <Tag color="blue">{record?.soVanBang ? `Năm ${record.soVanBang.nam}` : '-'}</Tag>
      ),
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'so_luot_tra_cuu',
      width: 120,
      align: 'center',
      render: (val) => val ?? 0,
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
      width: 100,
      fixed: 'right',
      render: (rec: QuyetDinh.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(rec._id, getModel)}
              title="Bạn có chắc chắn muốn xóa quyết định này?"
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
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="vanbang.quyetdinh"
      title="Quản lý Quyết định Tốt nghiệp"
      Form={Form as any}
      buttons={{ import: false }}
    />
  );
};

export default QuyetDinhPage;
