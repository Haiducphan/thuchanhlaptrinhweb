import { Card, Descriptions, Modal } from 'antd';
import moment from 'moment';
import React from 'react';

interface ModalChiTietProps {
  visible: boolean;
  onClose: () => void;
  data: {
    vanBang: VanBang.IRecord;
    chiTiet: any;
  };
}

const ModalChiTiet: React.FC<ModalChiTietProps> = ({ visible, onClose, data }) => {
  if (!data) return null;

  const { vanBang, chiTiet } = data;
  const chiTietList = chiTiet?.chiTietList || [];

  return (
    <Modal
      title={`Chi tiết Văn bằng - Số vào sổ: ${vanBang.so_vao_so}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {/* Thông tin văn bằng */}
      <Card title="Thông tin Văn bằng" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="Số vào sổ">{vanBang.so_vao_so}</Descriptions.Item>
          <Descriptions.Item label="Số hiệu VB">
            <strong>{vanBang.so_hieu_van_bang}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Mã sinh viên">{vanBang.ma_sinh_vien}</Descriptions.Item>
          <Descriptions.Item label="Họ tên">
            <strong>{vanBang.ho_ten}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {vanBang.ngay_sinh ? moment(vanBang.ngay_sinh).format('DD/MM/YYYY') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cấp">
            {vanBang.createdAt ? moment(vanBang.createdAt).format('DD/MM/YYYY') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Thông tin quyết định */}
      {vanBang.quyetDinh && (
        <Card title="Quyết định Tốt nghiệp" size="small" style={{ marginBottom: 16 }}>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Số QĐ">
              <strong>{vanBang.quyetDinh.so_quyet_dinh}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày ban hành">
              {vanBang.quyetDinh.ngay_ban_hanh
                ? moment(vanBang.quyetDinh.ngay_ban_hanh).format('DD/MM/YYYY')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Trích yếu" span={2}>
              {vanBang.quyetDinh.trich_yeu}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Thông tin động */}
      {chiTietList.length > 0 && (
        <Card title="Thông tin bổ sung" size="small">
          <Descriptions column={2} bordered size="small">
            {chiTietList.map((ct: any) => (
              <Descriptions.Item
                key={ct._id}
                label={ct.truongCauHinh?.ten_truong || 'Trường'}
              >
                {ct.gia_tri
                  ? ct.truongCauHinh?.kieu_du_lieu === 'Date'
                    ? moment(ct.gia_tri).format('DD/MM/YYYY')
                    : ct.gia_tri
                  : '-'}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      )}
    </Modal>
  );
};

export default ModalChiTiet;
