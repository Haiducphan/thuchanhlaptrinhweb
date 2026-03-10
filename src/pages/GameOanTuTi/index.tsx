import React, { useState } from 'react';
import { Card, Button, Table, Tag, Typography, Row, Col, Alert, Statistic } from 'antd';

const { Title, Text } = Typography;

const OanTuTi = () => {

    const [lichSuChoi, setLichSuChoi] = useState<any[]>([]);
    const [ketQuaHienTai, setKetQuaHienTai] = useState<any>(null);

    const cacPhuongAn = ['Kéo', 'Búa', 'Bao'];

    const bamNutChoi = (nguoiDungChon: string) => {
        const mayChon = cacPhuongAn[Math.floor(Math.random() * 3)];
        let ketQuaCuoi = '';

        if (nguoiDungChon === mayChon) {
            ketQuaCuoi = 'Hòa';
        } else if (
            (nguoiDungChon === 'Kéo' && mayChon === 'Bao') ||
            (nguoiDungChon === 'Búa' && mayChon === 'Kéo') ||
            (nguoiDungChon === 'Bao' && mayChon === 'Búa')
        ) {
            ketQuaCuoi = 'Thắng';
        } else {
            ketQuaCuoi = 'Thua';
        }

        const chiTietVan = {
            id: Date.now(),
            nguoiDung: nguoiDungChon,
            mayTinh: mayChon,
            ketQua: ketQuaCuoi,
            thoiGian: new Date().toLocaleTimeString(),
        };

        setKetQuaHienTai(chiTietVan);
        setLichSuChoi([chiTietVan, ...lichSuChoi]);
    };

    return (
        <div style={{ padding: '20px' }}>

            <Card title={<Title level={3} style={{ color: '#722ed1', margin: 0 }}>🎮 TRÒ CHƠI OẲN TÙ TÌ - TH02</Title>}>

                <Alert
                    message="Lưu ý: Bạn chỉ cần chọn một trong ba quân bài dưới đây để tỉ thí với máy!"
                    type="info"
                    showIcon
                    style={{ marginBottom: 20, borderRadius: '8px' }}
                />

                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                    <Row gutter={24} justify="center">
                        {cacPhuongAn.map(item => (
                            <Col key={item}>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => bamNutChoi(item)}

                                    style={{
                                        width: 140,
                                        height: 70,
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        backgroundColor: '#722ed1',
                                        borderColor: '#722ed1',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 10px rgba(114, 46, 209, 0.3)'
                                    }}
                                >
                                    {item}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </div>

                {ketQuaHienTai && (
                    <Card style={{
                        background: '#f9f0ff',
                        borderRadius: '12px',
                        marginBottom: '30px',
                        border: '2px solid #efdbff'
                    }}>
                        <Row gutter={16} align="middle" justify="center">
                            <Col span={8}>
                                <Statistic title="Lựa chọn của bạn" value={ketQuaHienTai.nguoiDung} />
                            </Col>
                            <Col span={8} style={{ textAlign: 'center' }}>
                                <Title level={2} style={{
                                    margin: 0,
                                    color: ketQuaHienTai.ketQua === 'Thắng' ? '#52c41a' : ketQuaHienTai.ketQua === 'Thua' ? '#ff4d4f' : '#faad14'
                                }}>
                                    {ketQuaHienTai.ketQua.toUpperCase()}
                                </Title>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Statistic title="Máy tính bốc bài" value={ketQuaHienTai.mayTinh} />
                            </Col>
                        </Row>
                    </Card>
                )}

                <Title level={4}>Nhật ký thi đấu</Title>
                <Table
                    dataSource={lichSuChoi}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    columns={[
                        { title: 'Thời gian', dataIndex: 'thoiGian', key: 'thoiGian' },
                        { title: 'Bạn chọn', dataIndex: 'nguoiDung', key: 'nguoiDung' },
                        { title: 'Máy bốc', dataIndex: 'mayTinh', key: 'mayTinh' },
                        {
                            title: 'Kết quả',
                            dataIndex: 'ketQua',
                            key: 'ketQua',
                            render: (kq) => (
                                <Tag color={kq === 'Thắng' ? 'green' : kq === 'Hòa' ? 'gold' : 'volcano'} style={{ fontWeight: 'bold' }}>
                                    {kq}
                                </Tag>
                            )
                        }
                    ]}
                />
            </Card>
        </div>
    );
};

export default OanTuTi;