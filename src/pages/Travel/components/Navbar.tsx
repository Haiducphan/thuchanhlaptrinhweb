import React from 'react';
import { Menu } from 'antd';
import { BankOutlined, HomeOutlined, InboxOutlined, AppstoreOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';

const Navbar: React.FC = () => {
  const location = useLocation();

  const activeKey = location.pathname.includes('ngan-sach')
    ? 'ngan-sach'
    : location.pathname.includes('lich-trinh')
    ? 'lich-trinh'
    : location.pathname.includes('quan-tri')
    ? 'quan-tri'
    : 'trang-chu';

  return (
    <div style={{ background: 'linear-gradient(90deg, #001529 0%, #003a70 100%)', padding: '0 16px' }}>
      <div
        style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', float: 'left', lineHeight: '60px', paddingRight: 32, cursor: 'pointer' }}
        onClick={() => history.push('/travel')}
      >
        ✈️ Du Lịch Việt
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[activeKey]}
        onClick={({ key }) => {
          const map: Record<string, string> = {
            'trang-chu': '/travel',
            'lich-trinh': '/travel/lich-trinh',
            'ngan-sach': '/travel/ngan-sach',
            'quan-tri': '/travel/quan-tri',
          };
          history.push(map[key] || '/travel');
        }}
        items={[
          { key: 'trang-chu', icon: <HomeOutlined />, label: 'Trang Chủ' },
          { key: 'lich-trinh', icon: <InboxOutlined />, label: 'Lịch Trình' },
          { key: 'ngan-sach', icon: <BankOutlined />, label: 'Ngân Sách' },
          { key: 'quan-tri', icon: <AppstoreOutlined />, label: 'Quản Trị' },
        ]}
      />
    </div>
  );
};

export default Navbar;
