import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, Popconfirm, Select, Empty, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined, CarOutlined } from '@ant-design/icons';
import { store } from './store';
import Navbar from './components/Navbar';
import { Destination } from './mockData';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const moveCost = (from: Destination | null, to: Destination | null) => {
  if (!from || !to) return 0;
  return from.location === to.location ? 50000 : 200000;
};

const totalPlaceCost = (place: Destination) => place.foodCost + place.stayCost + place.transportCost;

const LichTrinh: React.FC = () => {
  const [itinerary, setItinerary] = useState(store.itinerary);
  const [destinations, setDestinations] = useState(store.destinations);
  const [budget, setBudget] = useState(store.budget);
  const [addDayVisible, setAddDayVisible] = useState(false);
  const [addPlaceDay, setAddPlaceDay] = useState(1);
  const [selectedPlace, setSelectedPlace] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setItinerary([...store.itinerary]);
      setDestinations([...store.destinations]);
      setBudget({ ...store.budget });
    });
    return unsub;
  }, []);

  const removePlace = (dayIdx: number, placeIdx: number) => {
    const place = itinerary[dayIdx].places[placeIdx];
    const updated = itinerary.map((d, i) => {
      if (i !== dayIdx) return d;
      return { ...d, places: d.places.filter((_: any, pi: number) => pi !== placeIdx) };
    }).filter((d) => d.places.length > 0);
    store.setBudget({
      total: store.budget.total - totalPlaceCost(place),
      anUong: store.budget.anUong - place.foodCost,
      luuTru: store.budget.luuTru - place.stayCost,
      diChuyen: store.budget.diChuyen - place.transportCost,
      khac: store.budget.khac,
    });
    store.setItinerary(updated);
    store.notify();
  };

  const addDay = () => {
    store.setItinerary([...itinerary, { day: itinerary.length + 1, places: [] }]);
    store.notify();
  };

  const confirmAddPlace = () => {
    const dest = destinations.find((d) => d.id === selectedPlace);
    if (!dest) return;
    const updated = itinerary.map((d, i) => i + 1 === addPlaceDay ? { ...d, places: [...d.places, dest] } : d);
    store.setItinerary(updated);
    store.setBudget({
      total: store.budget.total + totalPlaceCost(dest),
      anUong: store.budget.anUong + dest.foodCost,
      luuTru: store.budget.luuTru + dest.stayCost,
      diChuyen: store.budget.diChuyen + dest.transportCost,
      khac: store.budget.khac,
    });
    store.notify();
    setAddDayVisible(false);
  };

  const dayTotalCost = (dayIdx: number) => {
    if (!itinerary[dayIdx]) return 0;
    let sum = 0;
    const places = itinerary[dayIdx].places;
    for (let i = 0; i < places.length; i++) {
      sum += totalPlaceCost(places[i]) + moveCost(places[i - 1] || null, places[i]);
    }
    return sum;
  };

  const grandTotal = itinerary.reduce((s, _, i) => s + dayTotalCost(i), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar />
      <div style={{ padding: '24px 16px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0 }}>📅 Lịch Trình Du Lịch</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={addDay}>Thêm Ngày</Button>
        </div>

        {itinerary.length === 0 ? (
          <Card><Empty description="Chưa có lịch trình nào"><Button type="primary" onClick={addDay}>Tạo ngày đầu tiên</Button></Empty></Card>
        ) : (
          <Row gutter={[16, 16]}>
            {itinerary.map((day: any, dayIdx: number) => (
              <Col key={dayIdx} xs={24} md={12}>
                <Card
                  title={<><Tag color="blue">Ngày {day.day}</Tag> <span style={{ fontSize: 13, color: '#e74c3c' }}>{formatVND(dayTotalCost(dayIdx))}</span></>}
                  extra={<Button size="small" icon={<PlusOutlined />} onClick={() => { setAddPlaceDay(day.day); setSelectedPlace(''); setAddDayVisible(true); }}>Thêm điểm</Button>}
                  style={{ marginBottom: 16 }}
                >
                  {day.places.length === 0 ? <Empty description="Chưa có điểm đến nào" /> : day.places.map((place: any, placeIdx: number) => (
                    <div key={placeIdx}>
                      {placeIdx > 0 && <div style={{ display: 'flex', alignItems: 'center', marginLeft: 24, color: '#888', fontSize: 12 }}><CarOutlined /> Di chuyển: {formatVND(moveCost(day.places[placeIdx - 1], place))}</div>}
                      <div style={{ display: 'flex', alignItems: 'flex-start', background: '#fafafa', padding: 10, borderRadius: 6, marginBottom: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold' }}>{place.name} - {place.location}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>⏱ {place.visitTime}</div>
                          <div style={{ fontSize: 12, color: '#999' }}>Ăn: {formatVND(place.foodCost)} | Lưu trú: {formatVND(place.stayCost)} | Di chuyển: {formatVND(place.transportCost)}</div>
                          <div style={{ fontSize: 13, fontWeight: 'bold', color: '#e74c3c' }}>{formatVND(totalPlaceCost(place))}</div>
                        </div>
                        <Popconfirm title="Xóa điểm này?" onConfirm={() => removePlace(dayIdx, placeIdx)}>
                          <Button type="link" danger icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                      </div>
                    </div>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Card style={{ marginTop: 16, background: '#fff8e1' }}>
          <Row gutter={16}>
            <Col xs={12} sm={6}><div style={{ fontSize: 12, color: '#888' }}>Số ngày</div><div style={{ fontSize: 18, fontWeight: 'bold' }}>{itinerary.length}</div></Col>
            <Col xs={12} sm={6}><div style={{ fontSize: 12, color: '#888' }}>Tổng điểm đến</div><div style={{ fontSize: 18, fontWeight: 'bold' }}>{itinerary.reduce((s: number, d: any) => s + d.places.length, 0)}</div></Col>
            <Col xs={12} sm={6}><div style={{ fontSize: 12, color: '#888' }}>Chi phí di chuyển</div><div style={{ fontSize: 18, fontWeight: 'bold' }}>{formatVND(budget.diChuyen)}</div></Col>
            <Col xs={12} sm={6}><div style={{ fontSize: 12, color: '#888' }}>Tổng chi phí</div><div style={{ fontSize: 20, fontWeight: 'bold', color: '#e74c3c' }}>{formatVND(grandTotal)}</div></Col>
          </Row>
        </Card>
      </div>

      <Modal
        title={`➕ Thêm điểm đến - Ngày ${addPlaceDay}`}
        visible={addDayVisible}
        footer={null}
        onCancel={() => setAddDayVisible(false)}
      >
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Chọn điểm đến:</label>
        </div>
        <Select
          style={{ width: '100%', marginBottom: 16 }}
          placeholder="-- Chọn một điểm đến --"
          value={selectedPlace || undefined}
          onChange={setSelectedPlace}
          size="large"
        >
          {destinations.map((d: any) => (
            <Select.Option key={d.id} value={d.id}>
              <div><b>{d.name}</b> - {d.location}</div>
              <div style={{ fontSize: 11, color: '#888' }}>
                Ăn: {formatVND(d.foodCost)} | Lưu trú: {formatVND(d.stayCost)} | Di chuyển: {formatVND(d.transportCost)}
              </div>
            </Select.Option>
          ))}
        </Select>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={() => setAddDayVisible(false)}>Hủy</Button>
          <Button
            type="primary"
            onClick={confirmAddPlace}
            disabled={!selectedPlace}
            icon={<PlusOutlined />}
          >
            Thêm vào Ngày {addPlaceDay}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LichTrinh;