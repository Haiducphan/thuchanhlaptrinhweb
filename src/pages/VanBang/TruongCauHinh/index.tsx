import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const TruongCauHinhPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('vanbang.truongcauhinh');

  const getKieuDuLieuColor = (kieu: TruongCauHinh.TKieuDuLieu) => {
    switch (kieu) {
      case 'String':
        return 'blue';
      case 'Number':
        return 'green';
      case 'Date':
        return 'purple';
      default:
        return 'default';
    }
  };

  const columns: IColumn<TruongCauHinh.IRecord>[] = [
    {
      title: 'Tên trường',
      dataIndex: 'ten_truong',
      width: 200,
      filterType: 'string',
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieu_du_lieu',
      width: 150,
      align: 'center',
      filterType: 'select',
      filterData: ['String', 'Number', 'Date'],
      render: (val: TruongCauHinh.TKieuDuLieu) => (
        <Tag color={getKieuDuLieuColor(val)}>
          {val === 'String' ? 'Văn bản' : val === 'Number' ? 'Số' : 'Ngày tháng'}
        </Tag>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'thu_tu_hien_thi',
      width: 80,
      align: 'center',
      sorter: true,
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'bat_buoc',
      width: 100,
      align: 'center',
      render: (val) => (val ? <Tag color="red">Có</Tag> : <Tag>Không</Tag>),
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
      render: (rec: TruongCauHinh.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(rec._id, getModel)}
              title="Bạn có chắc chắn muốn xóa trường này? Lưu ý: Dữ liệu văn bằng liên quan sẽ bị ảnh hưởng."
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
      modelName="vanbang.truongcauhinh"
      title="Cấu hình Biểu mẫu Phụ lục Văn bằng"
      Form={Form as any}
      buttons={{ import: false }}
    />
  );
};

export default TruongCauHinhPage;
