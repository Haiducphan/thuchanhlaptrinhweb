import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, SnippetsOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const SoVanBangPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit, setRecord, setVisibleForm } =
    useModel('vanbang.sovanbang');

  const columns: IColumn<SoVanBang.IRecord>[] = [
    {
      title: 'Năm',
      dataIndex: 'nam',
      width: 120,
      filterType: 'select',
      render: (val) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Tên sổ',
      dataIndex: 'ten_so',
      width: 250,
      filterType: 'string',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghi_chu',
      width: 200,
      filterType: 'string',
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
      width: 120,
      fixed: 'right',
      render: (rec: SoVanBang.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xem quyết định">
            <Button
              onClick={() => {
                setRecord(rec);
                setVisibleForm(true);
              }}
              type="link"
              icon={<SnippetsOutlined />}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(rec._id, getModel)}
              title="Bạn có chắc chắn muốn xóa sổ văn bằng này?"
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
      modelName="vanbang.sovanbang"
      title="Quản lý Sổ Văn Bằng"
      Form={Form as any}
      buttons={{ import: false }}
    />
  );
};

export default SoVanBangPage;
