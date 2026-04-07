import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Rate, Button, Tag, Space, Statistic, Input, Badge, Tooltip } from 'antd';
import {
  EnvironmentOutlined, StarFilled, PlusOutlined, SearchOutlined,
  HeartOutlined, FireOutlined, ClockCircleOutlined, DeleteOutlined
} from '@ant-design/icons';
import { store } from './store';
import Navbar from './components/Navbar';

const { Meta } = Card;
const { Option } = Select;

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const typeLabel: Record<string, string> = { bien: 'Biển', nui: 'Núi', thanh_pho: 'Thành phố' };
const typeColor: Record<string, string> = { bien: '#1890ff', nui: '#52c41a', thanh_pho: '#722ed1' };

const TrangChu: React.FC = () => {
  const [destinations, setDestinations] = useState([...store.destinations]);
  const [itinerary, setItinerary] = useState([...store.itinerary]);
  const [budget, setBudget] = useState({ ...store.budget });
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setDestinations([...store.destinations]);
      setItinerary([...store.itinerary]);
      setBudget({ ...store.budget });
    });
    return unsub;
  }, []);

  const totalCost = (d: any) => d.foodCost + d.stayCost + d.transportCost;

  let filtered = destinations.filter((d: any) => {
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;
    if (d.rating < ratingFilter) return false;
    if (priceFilter === 're' && totalCost(d) > 2000000) return false;
    else if (priceFilter === 'me' && (totalCost(d) < 2000000 || totalCost(d) > 3000000)) return false;
    else if (priceFilter === 'ca' && totalCost(d) < 3000000) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sortBy === 'rating') filtered = [...filtered].sort((a: any, b: any) => b.rating - a.rating);
  else if (sortBy === 'price_asc') filtered = [...filtered].sort((a: any, b: any) => totalCost(a) - totalCost(b));
  else if (sortBy === 'price_desc') filtered = [...filtered].sort((a: any, b: any) => totalCost(b) - totalCost(a));
  else if (sortBy === 'popular') filtered = [...filtered].sort((a: any, b: any) => b.popular - a.popular);

  const featured = [...destinations].sort((a: any, b: any) => b.rating - a.rating)[0];

  const addToItinerary = (dest: any) => {
    if (itinerary.length === 0) {
      store.setItinerary([{ day: 1, places: [dest] }]);
    } else {
      const last = itinerary[itinerary.length - 1];
      if (last.places.length < 4) {
        const updated = [...itinerary];
        updated[updated.length - 1] = { ...last, places: [...last.places, dest] };
        store.setItinerary(updated);
      } else {
        store.setItinerary([...itinerary, { day: itinerary.length + 1, places: [dest] }]);
      }
    }
    store.setBudget({
      total: store.budget.total + totalCost(dest),
      anUong: store.budget.anUong + dest.foodCost,
      luuTru: store.budget.luuTru + dest.stayCost,
      diChuyen: store.budget.diChuyen + dest.transportCost,
      khac: store.budget.khac,
    });
    store.notify();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar />

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 16px 32px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>✈️ Lập kế hoạch du lịch dễ dàng</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', color: '#fff' }}>Khám Phá Việt Nam</h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: 16 }}>Chọn điểm đến, tạo lịch trình, quản lý ngân sách — tất cả trong một</p>
        </div>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
      </div>

      <div style={{ padding: '24px 16px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Featured Destinations */}
        {featured && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8 }}>
              <FireOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
              <h3 style={{ margin: 0, fontSize: 16 }}>Điểm đến nổi bật nhất</h3>
            </div>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
              bodyStyle={{ padding: 0 }}
              cover={
                <div style={{ position: 'relative' }}>
                  <img src={featured.image} alt={featured.name} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    background: '#fff', borderRadius: 20, padding: '4px 12px',
                    fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <StarFilled style={{ color: '#faad14', fontSize: 11 }} /> {featured.rating} · Được yêu thích
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    padding: '20px 16px 12px',
                    color: '#fff',
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{featured.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.9 }}><EnvironmentOutlined /> {featured.location} · {featured.visitTime}</div>
                  </div>
                </div>
              }
            >
              <div style={{ padding: 16 }}>
                <p style={{ margin: '0 0 12px', color: '#666', fontSize: 14 }}>{featured.description}</p>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13 }}>
                  <span style={{ color: '#888' }}>Ăn: <b style={{ color: '#333' }}>{formatVND(featured.foodCost)}</b></span>
                  <span style={{ color: '#888' }}>Lưu trú: <b style={{ color: '#333' }}>{formatVND(featured.stayCost)}</b></span>
                  <span style={{ color: '#888' }}>Di chuyển: <b style={{ color: '#333' }}>{formatVND(featured.transportCost)}</b></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#e74c3c' }}>{formatVND(totalCost(featured))}</span>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => addToItinerary(featured)}>Thêm vào lịch trình</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Stats Row */}
        <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 10, textAlign: 'center' }} bodyStyle={{ padding: '16px 12px' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff' }}>{destinations.length}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Điểm đến</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 10, textAlign: 'center' }} bodyStyle={{ padding: '16px 12px' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#52c41a' }}>{itinerary.reduce((s: number, d: any) => s + d.places.length, 0)}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Đã chọn</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 10, textAlign: 'center' }} bodyStyle={{ padding: '16px 12px' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fa8c16' }}>{itinerary.length || '-'}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Ngày đi</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 10, textAlign: 'center' }} bodyStyle={{ padding: '16px 12px' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#e74c3c' }}>{formatVND(budget.total)}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Chi phí dự kiến</div>
            </Card>
          </Col>
        </Row>

        {/* Filter Row */}
        <Card style={{ borderRadius: 10, marginBottom: 24 }} bodyStyle={{ padding: '16px' }}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Tìm kiếm điểm đến..."
                allowClear
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select value={typeFilter} style={{ width: '100%' }} onChange={setTypeFilter}>
                <Option value="all">🏷️ Tất cả loại</Option>
                <Option value="bien">🌊 Biển</Option>
                <Option value="nui">🏔️ Núi</Option>
                <Option value="thanh_pho">🏙️ Thành phố</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select value={priceFilter} style={{ width: '100%' }} onChange={setPriceFilter}>
                <Option value="all">💰 Mọi giá</Option>
                <Option value="re">💵 Dưới 2 triệu</Option>
                <Option value="me">💸 2-3 triệu</Option>
                <Option value="ca">💎 Trên 3 triệu</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select value={sortBy} style={{ width: '100%' }} onChange={setSortBy}>
                <Option value="rating">⭐ Đánh giá cao</Option>
                <Option value="price_asc">📈 Giá tăng dần</Option>
                <Option value="price_desc">📉 Giá giảm dần</Option>
                <Option value="popular">🔥 Phổ biến nhất</Option>
              </Select>
            </Col>
            <Col xs={24} sm={6} md={6}>
              <Space>
                <span style={{ fontSize: 13, color: '#666' }}>Rating:</span>
                <Rate allowHalf value={ratingFilter} onChange={setRatingFilter} style={{ fontSize: 14 }} />
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Destination Cards */}
        <div style={{ marginBottom: 8 }}>
          <h3 style={{ margin: '0 0 16px' }}>📍 Tất cả điểm đến ({filtered.length})</h3>
        </div>

        <Row gutter={[16, 16]}>
          {filtered.map((dest: any) => (
            <Col key={dest.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ borderRadius: 12, overflow: 'hidden', transition: 'all 0.3s' }}
                cover={
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={dest.name}
                      src={dest.image}
                      style={{ height: 180, objectFit: 'cover', width: '100%' }}
                      onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'; }}
                    />
                    <Tag style={{
                      position: 'absolute', top: 8, right: 8,
                      background: typeColor[dest.type],
                      color: '#fff', border: 'none', borderRadius: 12,
                      fontSize: 11, fontWeight: 600,
                    }}>
                      {typeLabel[dest.type]}
                    </Tag>
                    <Tooltip title={`${dest.popular} lượt xem`}>
                      <div style={{
                        position: 'absolute', top: 8, left: 8,
                        background: 'rgba(0,0,0,0.5)', borderRadius: 12,
                        padding: '2px 8px', color: '#fff', fontSize: 11,
                      }}>
                        👁 {dest.popular}
                      </div>
                    </Tooltip>
                  </div>
                }
                actions={[
                  <Button type="text" icon={<PlusOutlined />} onClick={() => addToItinerary(dest)} style={{ color: '#e74c3c', fontWeight: 600 }}>
                    Thêm vào lịch trình
                  </Button>
                ]}
              >
                <Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{dest.name}</span>
                      <span style={{ color: '#faad14', fontSize: 13 }}>★ {dest.rating}</span>
                    </div>
                  }
                  description={
                    <div style={{ marginTop: 4 }}>
                      <div style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <EnvironmentOutlined /> {dest.location}
                        <span style={{ margin: '0 4px' }}>·</span>
                        <ClockCircleOutlined /> {dest.visitTime}
                      </div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 2, lineHeight: 1.4 }}>{dest.description}</div>
                      <div style={{ marginTop: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#e74c3c' }}>{formatVND(totalCost(dest))}</span>
                        <span style={{ fontSize: 11, color: '#aaa', marginLeft: 4 }}>/người</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>
                        Ăn: {formatVND(dest.foodCost)} · Lưu trú: {formatVND(dest.stayCost)} · Di chuyển: {formatVND(dest.transportCost)}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {filtered.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 40, borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, color: '#999' }}>Không tìm thấy điểm đến phù hợp.</div>
            <Button style={{ marginTop: 12 }} onClick={() => { setTypeFilter('all'); setRatingFilter(0); setPriceFilter('all'); setSearch(''); }}>
              Xóa bộ lọc
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrangChu;
