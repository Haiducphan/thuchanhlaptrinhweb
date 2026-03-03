import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, message, Space, Alert, List, Typography } from 'antd';

const { Text } = Typography;

const GuessNumber = () => {
    const [soBiMat, setSoBiMat] = useState(0);
    const [soNguoiDungNhap, setSoNguoiDungNhap] = useState<number | null>(null);
    const [soLuotConLai, setSoLuotConLai] = useState(10);
    const [nhatKyDoan, setNhatKyDoan] = useState<string[]>([]);
    const [ketThuc, setKetThuc] = useState(false);

    const resetGame = () => {
        const soMoi = Math.floor(Math.random() * 100) + 1;
        setSoBiMat(soMoi);
        setSoLuotConLai(10);
        setNhatKyDoan([]);
        setKetThuc(false);
        setSoNguoiDungNhap(null);
    };

    useEffect(() => { resetGame(); }, []);

    const nutBamDoan = () => {
        if (soNguoiDungNhap === null || ketThuc) return;

        const luotMoi = soLuotConLai - 1;
        setSoLuotConLai(luotMoi);

        if (soNguoiDungNhap === soBiMat) {
            setKetThuc(true);
            message.success('Chúc mừng! Bạn đã đoán đúng rồi!');
        } else if (luotMoi === 0) {
            setKetThuc(true);
            message.error(`Tiếc quá, bạn hết lượt rồi! Số đúng là: ${soBiMat}`);
        } else {
            let thongBao = '';
            if (soNguoiDungNhap < soBiMat) {
                thongBao = 'Bạn đoán quá thấp!';
            } else {
                thongBao = 'Bạn đoán quá cao!';
            }
            setNhatKyDoan([`Lượt ${10 - luotMoi}: Bạn chọn ${soNguoiDungNhap} -> ${thongBao}`, ...nhatKyDoan]);
            message.warning(thongBao);
        }
        setSoNguoiDungNhap(null);
    };

    return (
        <Card
            title={<Text strong style={{ color: '#1890ff' }}>BÀI 1: TRÒ CHƠI ĐOÁN SỐ (1-100)</Text>}
            style={{ maxWidth: 600, margin: '20px auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                {/* Thay đổi màu sắc thông báo lượt đoán sang màu xanh lá (green) */}
                <Alert
                    message={<Text style={{ color: 'green', fontWeight: 'bold' }}>Số lượt còn lại của bạn: {soLuotConLai}</Text>}
                    type="info"
                    showIcon
                />

                <div style={{ textAlign: 'center', padding: '30px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <InputNumber
                        min={1} max={100}
                        placeholder="Nhập số..."
                        style={{ width: 160, marginRight: 10 }}
                        value={soNguoiDungNhap}
                        onChange={v => setSoNguoiDungNhap(v)}
                        disabled={ketThuc}
                    />
                    {/* Đổi tên nút bấm thành "Kiểm tra kết quả" */}
                    <Button
                        type="primary"
                        onClick={nutBamDoan}
                        disabled={ketThuc}
                        style={{ borderRadius: '4px' }}
                    >
                        Kiểm tra kết quả
                    </Button>
                </div>

                <Button block onClick={resetGame} danger ghost style={{ marginTop: 10 }}>
                    Làm mới trò chơi
                </Button>

                <List
                    header={<Text strong style={{ color: 'blue' }}>Lịch sử dự đoán:</Text>}
                    bordered
                    dataSource={nhatKyDoan}
                    renderItem={item => (
                        <List.Item>
                            <Text code>{item}</Text>
                        </List.Item>
                    )}
                    style={{ marginTop: 20, backgroundColor: '#fff' }}
                />
            </Space>
        </Card>
    );
};
export default GuessNumber;