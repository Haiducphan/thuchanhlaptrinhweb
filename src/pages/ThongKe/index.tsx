import { Card, Col, Row, Statistic } from 'antd';
import Chart from 'react-apexcharts';
import { useMemo } from 'react';

const ThongKePage = () => {
	const clbData = useMemo(() => {
		const saved = localStorage.getItem('clb_data');
		if (!saved) return [];
		try { return JSON.parse(saved); } catch { return []; }
	}, []);

	const donData = useMemo(() => {
		const saved = localStorage.getItem('don_dang_ky_data');
		if (!saved) return [];
		try { return JSON.parse(saved); } catch { return []; }
	}, []);

	const stats = useMemo(() => ({
		soCLB: clbData.length,
		soDon: donData.length,
		pending: donData.filter((d: any) => d.trangThai === 'Pending').length,
		approved: donData.filter((d: any) => d.trangThai === 'Approved').length,
		rejected: donData.filter((d: any) => d.trangThai === 'Rejected').length,
	}), [clbData, donData]);

	const chartData = useMemo(() => {
		const cats: string[] = [];
		const pendingArr: number[] = [];
		const approvedArr: number[] = [];
		const rejectedArr: number[] = [];

		for (const clb of clbData) {
			cats.push(clb.ten);
			const donsOfClb = donData.filter((d: any) => d.cauLacBoId === clb._id);
			pendingArr.push(donsOfClb.filter((d: any) => d.trangThai === 'Pending').length);
			approvedArr.push(donsOfClb.filter((d: any) => d.trangThai === 'Approved').length);
			rejectedArr.push(donsOfClb.filter((d: any) => d.trangThai === 'Rejected').length);
		}

		return {
			series: [
				{ name: 'Chờ duyệt', data: pendingArr },
				{ name: 'Đã duyệt', data: approvedArr },
				{ name: 'Từ chối', data: rejectedArr },
			],
			categories: cats,
		};
	}, [clbData, donData]);

	const chartOptions = useMemo(() => ({
		chart: { type: 'bar' as const, grouped: true, toolbar: { show: false } },
		colors: ['#faad14', '#52c41a', '#ff4d4f'],
		xaxis: { categories: chartData.categories },
		plotOptions: { bar: { columnWidth: '60%' } },
		legend: { position: 'top' as const },
		dataLabels: { enabled: false },
	}), [chartData.categories]);

	return (
		<div style={{ padding: 24 }}>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={6}>
					<Card><Statistic title="Tổng số Câu lạc bộ" value={stats.soCLB} /></Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card><Statistic title="Tổng số Đơn đăng ký" value={stats.soDon} /></Card>
				</Col>
				<Col xs={24} sm={8} md={4}>
					<Card><Statistic title="Chờ duyệt" value={stats.pending} valueStyle={{ color: '#faad14' }} /></Card>
				</Col>
				<Col xs={24} sm={8} md={4}>
					<Card><Statistic title="Đã duyệt" value={stats.approved} valueStyle={{ color: '#52c41a' }} /></Card>
				</Col>
				<Col xs={24} sm={8} md={4}>
					<Card><Statistic title="Từ chối" value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} /></Card>
				</Col>
			</Row>

			<Card title="Số đơn đăng ký theo từng Câu lạc bộ" style={{ marginTop: 24 }}>
				<Chart options={chartOptions} series={chartData.series} type="bar" height={350} />
			</Card>
		</div>
	);
};

export default ThongKePage;
