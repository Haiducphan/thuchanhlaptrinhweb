import React, { useEffect, useMemo, useState } from 'react';
import {
	Avatar,
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	Layout,
	Menu,
	Modal,
	Pagination,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Typography,
	message,
} from 'antd';
import {
	BookOutlined,
	GithubOutlined,
	HomeOutlined,
	LeftOutlined,
	PlusOutlined,
	SettingOutlined,
	TagOutlined,
	UserOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text, Paragraph, Link } = Typography;

interface BaiViet {
	id: number;
	tieuDe: string;
	slug: string;
	moTauNgan: string;
	noiDung: string;
	anhNen: string;
	danhSachTag: string[];
	trangThai: 'Nháp' | 'Đã đăng';
	luotXem: number;
	ngayTao: string;
	tacGia: string;
}

interface TheLoai {
	id: number;
	ten: string;
}

const TAG_KEY = 'th07_tag_data';
const POST_KEY = 'th07_blog_data';
const OLD_NAME = 'Nguyễn Hải Đức';
const CURRENT_NAME = 'Phan Hải Đức';
const DEFAULT_AVATAR = 'https://i.pravatar.cc/240?img=12';
const cardShadow = '0 8px 24px rgba(15, 23, 42, 0.06)';

const theLoaiMacDinh: TheLoai[] = [
	{ id: 1, ten: 'Công nghệ' },
	{ id: 2, ten: 'Đời sống' },
	{ id: 3, ten: 'Lập trình' },
	{ id: 4, ten: 'Học tập' },
	{ id: 5, ten: 'Kinh nghiệm' },
];

const danhSachMacDinh: BaiViet[] = [
	{
		id: 1,
		tieuDe: 'Hướng dẫn React Hooks cho người mới',
		slug: 'react-hooks-cho-nguoi-moi',
		moTauNgan: 'Tóm tắt nhanh các hook phổ biến để làm dự án React hiệu quả.',
		noiDung:
			'# React Hooks cơ bản\n\nHooks giúp code gọn hơn và dễ quản lý state.\n\n- useState\n- useEffect\n- useMemo\n\n## Kết luận\nNên chia component nhỏ và đặt logic rõ ràng.',
		anhNen: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
		danhSachTag: ['Công nghệ', 'Lập trình'],
		trangThai: 'Đã đăng',
		luotXem: 104,
		ngayTao: '2026-04-10',
		tacGia: 'Phan Hải Đức',
	},
	{
		id: 2,
		tieuDe: 'Checklist trước khi nộp đồ án môn web',
		slug: 'checklist-nop-do-an-web',
		moTauNgan: 'Danh sách các bước cần kiểm tra trước deadline nộp bài.',
		noiDung:
			'# Checklist\n\n1. Kiểm tra CRUD\n2. Kiểm tra UI responsive\n3. Test localStorage\n\n> Đừng để lỗi nhỏ mất điểm.',
		anhNen: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200',
		danhSachTag: ['Học tập', 'Kinh nghiệm', 'Lập trình'],
		trangThai: 'Đã đăng',
		luotXem: 57,
		ngayTao: '2026-04-14',
		tacGia: 'Phan Hải Đức',
	},
	{
		id: 3,
		tieuDe: 'Một ngày code và đi học của sinh viên IT',
		slug: 'mot-ngay-cua-sinh-vien-it',
		moTauNgan: 'Lịch học, lịch code và cách chia thời gian đỡ stress.',
		noiDung:
			'# Một ngày của mình\n\nBuổi sáng đi học, chiều lab, tối code side project.\n\n## Mẹo\nGiữ lịch đều và ngủ đủ.',
		anhNen: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200',
		danhSachTag: ['Đời sống', 'Kinh nghiệm'],
		trangThai: 'Đã đăng',
		luotXem: 89,
		ngayTao: '2026-04-18',
		tacGia: 'Phan Hải Đức',
	},
	{
		id: 4,
		tieuDe: 'Bài nháp: Tổng hợp tài liệu TypeScript',
		slug: 'tong-hop-tai-lieu-typescript',
		moTauNgan: 'Danh sách link học TypeScript miễn phí.',
		noiDung: '# TypeScript\n\nBài này đang soạn nên để trạng thái nháp.',
		anhNen: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1200',
		danhSachTag: ['Công nghệ', 'Học tập'],
		trangThai: 'Nháp',
		luotXem: 0,
		ngayTao: '2026-04-21',
		tacGia: 'Phan Hải Đức',
	},
];

const renderMarkdownSimple = (content: string) => {
	const lines = content.split('\n');
	const items: React.ReactNode[] = [];
	let bulletList: string[] = [];

	const flushBullet = () => {
		if (!bulletList.length) return;
		items.push(
			<ul key={`ul-${items.length}`} style={{ paddingLeft: 20, marginBottom: 12 }}>
				{bulletList.map((text, i) => (
					<li key={`${text}-${i}`}>{text}</li>
				))}
			</ul>,
		);
		bulletList = [];
	};

	lines.forEach((line, index) => {
		const text = line.trim();
		if (!text) {
			flushBullet();
			items.push(<div key={`space-${index}`} style={{ height: 6 }} />);
			return;
		}
		if (text.startsWith('- ')) {
			bulletList.push(text.replace('- ', ''));
			return;
		}
		flushBullet();
		if (text.startsWith('### ')) {
			items.push(
				<Title level={4} key={index} style={{ marginBottom: 8 }}>
					{text.replace('### ', '')}
				</Title>,
			);
			return;
		}
		if (text.startsWith('## ')) {
			items.push(
				<Title level={3} key={index} style={{ marginBottom: 10 }}>
					{text.replace('## ', '')}
				</Title>,
			);
			return;
		}
		if (text.startsWith('# ')) {
			items.push(
				<Title level={2} key={index} style={{ marginBottom: 12 }}>
					{text.replace('# ', '')}
				</Title>,
			);
			return;
		}
		items.push(
			<Paragraph key={index} style={{ marginBottom: 10 }}>
				{text}
			</Paragraph>,
		);
	});

	flushBullet();
	return items;
};

const BlogManager: React.FC = () => {
	const [view, setView] = useState('home');
	const [selectedPost, setSelectedPost] = useState<BaiViet | null>(null);
	const [posts, setPosts] = useState<BaiViet[]>(() => {
		const saved = localStorage.getItem(POST_KEY);
		const data: BaiViet[] = saved ? JSON.parse(saved) : danhSachMacDinh;
		return data.map((item) => ({
			...item,
			danhSachTag: Array.isArray(item.danhSachTag) ? item.danhSachTag : [],
			luotXem: Number.isFinite(item.luotXem) ? item.luotXem : 0,
			trangThai: item.trangThai === 'Nháp' || item.trangThai === 'Đã đăng' ? item.trangThai : 'Nháp',
			moTauNgan: item.moTauNgan || item.noiDung?.slice(0, 90) || '',
			tacGia: item.tacGia === OLD_NAME || !item.tacGia ? CURRENT_NAME : item.tacGia,
		}));
	});
	const [tags, setTags] = useState<TheLoai[]>(() => {
		const saved = localStorage.getItem(TAG_KEY);
		return saved ? JSON.parse(saved) : theLoaiMacDinh;
	});

	const [search, setSearch] = useState('');
	const [keyword, setKeyword] = useState('');
	const [tagFilter, setTagFilter] = useState('');
	const [page, setPage] = useState(1);

	const [adminSearch, setAdminSearch] = useState('');
	const [adminKeyword, setAdminKeyword] = useState('');
	const [adminStatus, setAdminStatus] = useState<'all' | 'Nháp' | 'Đã đăng'>('all');

	const [isModalPost, setIsModalPost] = useState(false);
	const [isModalTag, setIsModalTag] = useState(false);
	const [editPost, setEditPost] = useState<BaiViet | null>(null);
	const [editTag, setEditTag] = useState<TheLoai | null>(null);
	const [formPost] = Form.useForm();
	const [formTag] = Form.useForm();

	useEffect(() => {
		localStorage.setItem(POST_KEY, JSON.stringify(posts));
	}, [posts]);

	useEffect(() => {
		localStorage.setItem(TAG_KEY, JSON.stringify(tags));
	}, [tags]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setKeyword(search.trim());
			setPage(1);
		}, 300);
		return () => clearTimeout(timer);
	}, [search]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setAdminKeyword(adminSearch.trim());
		}, 300);
		return () => clearTimeout(timer);
	}, [adminSearch]);

	useEffect(() => {
		setPage(1);
	}, [tagFilter]);

	const dataHome = useMemo(() => {
		const key = keyword.toLowerCase();
		return posts
			.filter((p) => p.trangThai === 'Đã đăng')
			.filter((p) => {
				if (!key) return true;
				return (
					p.tieuDe.toLowerCase().includes(key) ||
					p.moTauNgan.toLowerCase().includes(key) ||
					p.noiDung.toLowerCase().includes(key)
				);
			})
			.filter((p) => (tagFilter ? p.danhSachTag.includes(tagFilter) : true));
	}, [posts, keyword, tagFilter]);

	const pagedData = useMemo(() => {
		return dataHome.slice((page - 1) * 9, page * 9);
	}, [dataHome, page]);

	const relatedPosts = useMemo(() => {
		if (!selectedPost) return [];
		const published = posts.filter((p) => p.id !== selectedPost.id && p.trangThai === 'Đã đăng');
		const sameTag = published.filter((p) => p.danhSachTag.some((t) => selectedPost.danhSachTag.includes(t)));
		if (sameTag.length) return sameTag.slice(0, 3);
		return published.slice(0, 3);
	}, [posts, selectedPost]);

	const adminPosts = useMemo(() => {
		return posts
			.filter((p) => p.tieuDe.toLowerCase().includes(adminKeyword.toLowerCase()))
			.filter((p) => (adminStatus === 'all' ? true : p.trangThai === adminStatus));
	}, [posts, adminKeyword, adminStatus]);

	const tagUseCount = useMemo(() => {
		const map: Record<string, number> = {};
		tags.forEach((t) => {
			map[t.ten] = 0;
		});
		posts.forEach((p) => {
			p.danhSachTag.forEach((t) => {
				map[t] = (map[t] || 0) + 1;
			});
		});
		return map;
	}, [posts, tags]);

	const handleRead = (item: BaiViet) => {
		const next = posts.map((p) => (p.id === item.id ? { ...p, luotXem: p.luotXem + 1 } : p));
		setPosts(next);
		setSelectedPost({ ...item, luotXem: item.luotXem + 1 });
		setView('detail');
	};

	const onSavePost = (values: Omit<BaiViet, 'id' | 'luotXem' | 'ngayTao' | 'tacGia'>) => {
		const slug = values.slug.trim();
		const isDuplicateSlug = posts.some((p) => p.slug === slug && (!editPost || p.id !== editPost.id));
		if (isDuplicateSlug) {
			message.error('Slug đã tồn tại');
			return;
		}

		if (editPost) {
			setPosts(posts.map((p) => (p.id === editPost.id ? { ...p, ...values, slug } : p)));
			message.success('Đã cập nhật bài viết');
		} else {
			const newPost: BaiViet = {
				id: Date.now(),
				tieuDe: values.tieuDe,
				slug,
				moTauNgan: values.moTauNgan,
				noiDung: values.noiDung,
				anhNen: values.anhNen,
				danhSachTag: values.danhSachTag,
				trangThai: values.trangThai,
				luotXem: 0,
				ngayTao: new Date().toISOString().slice(0, 10),
				tacGia: CURRENT_NAME,
			};
			setPosts([newPost, ...posts]);
			message.success('Đã thêm bài viết mới');
		}
		setIsModalPost(false);
		setEditPost(null);
		formPost.resetFields();
	};

	const onDeletePost = (id: number) => {
		setPosts(posts.filter((p) => p.id !== id));
		message.success('Đã xóa bài viết');
	};

	const openCreatePost = () => {
		setEditPost(null);
		formPost.resetFields();
		formPost.setFieldsValue({ trangThai: 'Nháp', danhSachTag: [] });
		setIsModalPost(true);
	};

	const openEditPost = (record: BaiViet) => {
		setEditPost(record);
		formPost.setFieldsValue(record);
		setIsModalPost(true);
	};

	const onSaveTag = (values: { ten: string }) => {
		const tenMoi = values.ten.trim();
		if (!tenMoi) return;

		if (editTag) {
			if (tags.some((t) => t.id !== editTag.id && t.ten.toLowerCase() === tenMoi.toLowerCase())) {
				message.error('Tên thẻ đã tồn tại');
				return;
			}
			setTags(tags.map((t) => (t.id === editTag.id ? { ...t, ten: tenMoi } : t)));
			setPosts(
				posts.map((p) => ({
					...p,
					danhSachTag: p.danhSachTag.map((t) => (t === editTag.ten ? tenMoi : t)),
				})),
			);
			message.success('Đã cập nhật thẻ');
		} else {
			if (tags.some((t) => t.ten.toLowerCase() === tenMoi.toLowerCase())) {
				message.error('Tên thẻ đã tồn tại');
				return;
			}
			setTags([{ id: Date.now(), ten: tenMoi }, ...tags]);
			message.success('Đã thêm thẻ');
		}

		setIsModalTag(false);
		setEditTag(null);
		formTag.resetFields();
	};

	const onDeleteTag = (tag: TheLoai) => {
		setTags(tags.filter((t) => t.id !== tag.id));
		setPosts(
			posts.map((p) => ({
				...p,
				danhSachTag: p.danhSachTag.filter((x) => x !== tag.ten),
			})),
		);
		if (tagFilter === tag.ten) {
			setTagFilter('');
		}
		message.success('Đã xóa thẻ');
	};

	const openCreateTag = () => {
		setEditTag(null);
		formTag.resetFields();
		setIsModalTag(true);
	};

	const openEditTag = (tag: TheLoai) => {
		setEditTag(tag);
		formTag.setFieldsValue(tag);
		setIsModalTag(true);
	};

	return (
		<Layout
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(180deg, #f3f4f6 0%, #eceff3 100%)',
			}}
		>
			<Header
				style={{
					background: '#fff',
					padding: '0 24px',
					display: 'flex',
					alignItems: 'center',
					borderBottom: '1px solid #e8e8e8',
					boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
				}}
			>
				<div style={{ fontSize: 20, fontWeight: 700, color: '#1677ff', marginRight: 24 }}>BLOG APP</div>
				<Menu
					mode='horizontal'
					selectedKeys={[view]}
					style={{ flex: 1, border: 'none' }}
					onClick={(e) => setView(e.key)}
					items={[
						{ key: 'home', icon: <HomeOutlined />, label: 'Trang chủ' },
						{ key: 'about', icon: <UserOutlined />, label: 'Giới thiệu' },
						{ key: 'admin-p', icon: <SettingOutlined />, label: 'Quản lý bài viết' },
						{ key: 'admin-t', icon: <TagOutlined />, label: 'Quản lý thẻ' },
					]}
				/>
			</Header>

			<Content style={{ padding: 24 }}>
				<div style={{ maxWidth: 1320, margin: '0 auto' }}>
					{view === 'home' && (
						<>
							<Card style={{ marginBottom: 20, borderRadius: 12, boxShadow: cardShadow }}>
								<Space direction='vertical' size={12} style={{ width: '100%' }}>
									<Input.Search
										placeholder='Tìm kiếm bài viết theo tiêu đề...'
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										allowClear
									/>
									<Space wrap>
										<Text strong>Lọc theo thẻ:</Text>
										<Tag
											color={!tagFilter ? 'blue' : 'default'}
											style={{ cursor: 'pointer' }}
											onClick={() => setTagFilter('')}
										>
											Tất cả
										</Tag>
										{tags.map((tag) => (
											<Tag
												key={tag.id}
												color={tagFilter === tag.ten ? 'blue' : 'default'}
												style={{ cursor: 'pointer' }}
												onClick={() => setTagFilter(tag.ten)}
											>
												{tag.ten}
											</Tag>
										))}
									</Space>
								</Space>
							</Card>

							<Row gutter={[16, 16]}>
								{pagedData.map((item) => (
									<Col xs={24} sm={12} md={8} key={item.id}>
										<Card
											hoverable
											cover={<img src={item.anhNen} alt={item.tieuDe} style={{ height: 180, objectFit: 'cover' }} />}
											onClick={() => handleRead(item)}
											style={{ height: '100%', borderRadius: 12, overflow: 'hidden', boxShadow: cardShadow }}
											bodyStyle={{ display: 'flex', flexDirection: 'column', minHeight: 220 }}
										>
											<Card.Meta
												title={item.tieuDe}
												description={<Paragraph ellipsis={{ rows: 2 }}>{item.moTauNgan}</Paragraph>}
											/>
											<Space wrap style={{ marginTop: 12 }}>
												{item.danhSachTag.map((tag) => (
													<Tag key={tag}>{tag}</Tag>
												))}
											</Space>
											<div
												style={{
													fontSize: 12,
													color: '#666',
													display: 'flex',
													justifyContent: 'space-between',
													marginTop: 'auto',
												}}
											>
												<span>{item.ngayTao}</span>
												<span>{item.tacGia}</span>
											</div>
										</Card>
									</Col>
								))}
							</Row>

							<div style={{ marginTop: 20, textAlign: 'center' }}>
								<Pagination current={page} pageSize={9} total={dataHome.length} onChange={setPage} />
							</div>
						</>
					)}

					{view === 'detail' && selectedPost && (
						<Card style={{ maxWidth: 980, margin: '0 auto', borderRadius: 14, boxShadow: cardShadow }}>
							<Button icon={<LeftOutlined />} onClick={() => setView('home')} style={{ marginBottom: 16 }}>
								Quay lại danh sách
							</Button>
							<img
								src={selectedPost.anhNen}
								alt={selectedPost.tieuDe}
								style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }}
							/>
							<Title level={2}>{selectedPost.tieuDe}</Title>
							<Space split={<Divider type='vertical' />} style={{ color: '#777', marginBottom: 12 }}>
								<Text>Tác giả: {selectedPost.tacGia}</Text>
								<Text>Ngày đăng: {selectedPost.ngayTao}</Text>
								<Text>Lượt xem: {selectedPost.luotXem}</Text>
							</Space>
							<div style={{ marginBottom: 12 }}>
								<Space wrap>
									{selectedPost.danhSachTag.map((tag) => (
										<Tag color='blue' key={tag}>
											{tag}
										</Tag>
									))}
								</Space>
							</div>
							<div>{renderMarkdownSimple(selectedPost.noiDung)}</div>

							<Divider />
							<Title level={4}>Bài viết liên quan</Title>
							<Row gutter={[12, 12]}>
								{relatedPosts.map((p) => (
									<Col xs={24} md={8} key={p.id}>
										<Card
											size='small'
											hoverable
											onClick={() => handleRead(p)}
											style={{ borderRadius: 10, minHeight: 108 }}
										>
											<Card.Meta title={p.tieuDe} description={p.ngayTao} />
										</Card>
									</Col>
								))}
								{!relatedPosts.length && (
									<Col span={24}>
										<Text type='secondary'>Chưa có bài viết liên quan.</Text>
									</Col>
								)}
							</Row>
						</Card>
					)}

					{view === 'about' && (
						<Card style={{ maxWidth: 760, margin: '0 auto', borderRadius: 14, boxShadow: cardShadow }}>
							<Space direction='vertical' align='center' style={{ width: '100%' }}>
								<Avatar size={110} src={DEFAULT_AVATAR} />
								<Title level={2} style={{ marginBottom: 0 }}>
									{CURRENT_NAME}
								</Title>
								<Text type='secondary'>Sinh viên CNTT - Frontend Developer</Text>
								<Paragraph style={{ textAlign: 'center', maxWidth: 560 }}>
									Mình thích xây dựng giao diện ReactJS, làm app CRUD với Ant Design và đang học thêm TypeScript.
								</Paragraph>
								<Space wrap>
									<Tag color='blue'>ReactJS</Tag>
									<Tag color='green'>TypeScript</Tag>
									<Tag color='gold'>Ant Design</Tag>
									<Tag color='purple'>NodeJS</Tag>
								</Space>
								<Space>
									<Button icon={<GithubOutlined />}>
										<Link href='https://github.com' target='_blank'>
											Github
										</Link>
									</Button>
									<Button icon={<BookOutlined />}>
										<Link href='https://www.linkedin.com' target='_blank'>
											LinkedIn
										</Link>
									</Button>
								</Space>
							</Space>
						</Card>
					)}

					{view === 'admin-p' && (
						<Card style={{ borderRadius: 12, boxShadow: cardShadow }}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									gap: 12,
									marginBottom: 16,
									flexWrap: 'wrap',
								}}
							>
								<Space wrap>
									<Input
										placeholder='Tìm theo tiêu đề...'
										value={adminSearch}
										onChange={(e) => setAdminSearch(e.target.value)}
										allowClear
										style={{ width: 260 }}
									/>
									<Select
										value={adminStatus}
										onChange={setAdminStatus}
										style={{ width: 180 }}
										options={[
											{ value: 'all', label: 'Tất cả trạng thái' },
											{ value: 'Nháp', label: 'Nháp' },
											{ value: 'Đã đăng', label: 'Đã đăng' },
										]}
									/>
								</Space>
								<Button type='primary' icon={<PlusOutlined />} onClick={openCreatePost}>
									Thêm bài viết
								</Button>
							</div>

							<Table
								rowKey='id'
								dataSource={adminPosts}
								columns={[
									{ title: 'Tiêu đề', dataIndex: 'tieuDe' },
									{
										title: 'Trạng thái',
										dataIndex: 'trangThai',
										render: (value: BaiViet['trangThai']) => (
											<Tag color={value === 'Đã đăng' ? 'green' : 'orange'}>{value}</Tag>
										),
									},
									{
										title: 'Thẻ',
										dataIndex: 'danhSachTag',
										render: (arr: string[]) => (
											<Space wrap>
												{arr.map((item) => (
													<Tag key={item}>{item}</Tag>
												))}
											</Space>
										),
									},
									{ title: 'Lượt xem', dataIndex: 'luotXem' },
									{ title: 'Ngày tạo', dataIndex: 'ngayTao' },
									{
										title: 'Thao tác',
										render: (_, record: BaiViet) => (
											<Space>
												<Button type='link' onClick={() => openEditPost(record)}>
													Sửa
												</Button>
												<Popconfirm title='Bạn chắc chắn muốn xóa?' onConfirm={() => onDeletePost(record.id)}>
													<Button type='link' danger>
														Xóa
													</Button>
												</Popconfirm>
											</Space>
										),
									},
								]}
							/>
						</Card>
					)}

					{view === 'admin-t' && (
						<Card style={{ borderRadius: 12, boxShadow: cardShadow }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
								<Title level={4} style={{ marginBottom: 0 }}>
									Quản lý thẻ
								</Title>
								<Button type='primary' onClick={openCreateTag}>
									Thêm thẻ
								</Button>
							</div>
							<Table
								rowKey='id'
								pagination={false}
								dataSource={tags}
								columns={[
									{ title: 'Tên thẻ', dataIndex: 'ten' },
									{
										title: 'Số bài viết đang dùng',
										render: (_, record: TheLoai) => tagUseCount[record.ten] || 0,
									},
									{
										title: 'Thao tác',
										render: (_, record: TheLoai) => (
											<Space>
												<Button type='link' onClick={() => openEditTag(record)}>
													Sửa
												</Button>
												<Popconfirm title='Bạn chắc chắn muốn xóa thẻ?' onConfirm={() => onDeleteTag(record)}>
													<Button type='link' danger>
														Xóa
													</Button>
												</Popconfirm>
											</Space>
										),
									},
								]}
							/>
						</Card>
					)}
				</div>
			</Content>

			<Modal
				title={editPost ? 'Cập nhật bài viết' : 'Thêm bài viết'}
				visible={isModalPost}
				onCancel={() => {
					setIsModalPost(false);
					setEditPost(null);
					formPost.resetFields();
				}}
				onOk={() => formPost.submit()}
				width={760}
			>
				<Form form={formPost} layout='vertical' onFinish={onSavePost}>
					<Form.Item name='tieuDe' label='Tiêu đề' rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Nhập slug' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='anhNen' label='Ảnh đại diện (URL)' rules={[{ required: true, message: 'Nhập URL ảnh' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='moTauNgan' label='Tóm tắt' rules={[{ required: true, message: 'Nhập tóm tắt' }]}>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item name='noiDung' label='Nội dung (Markdown)' rules={[{ required: true, message: 'Nhập nội dung' }]}>
						<Input.TextArea rows={7} />
					</Form.Item>
					<Form.Item name='danhSachTag' label='Thẻ' rules={[{ required: true, message: 'Chọn ít nhất 1 thẻ' }]}>
						<Select mode='multiple' options={tags.map((t) => ({ label: t.ten, value: t.ten }))} />
					</Form.Item>
					<Form.Item name='trangThai' label='Trạng thái' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
						<Select
							options={[
								{ label: 'Nháp', value: 'Nháp' },
								{ label: 'Đã đăng', value: 'Đã đăng' },
							]}
						/>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editTag ? 'Sửa thẻ' : 'Thêm thẻ'}
				visible={isModalTag}
				onCancel={() => {
					setIsModalTag(false);
					setEditTag(null);
					formTag.resetFields();
				}}
				onOk={() => formTag.submit()}
			>
				<Form form={formTag} layout='vertical' onFinish={onSaveTag}>
					<Form.Item name='ten' label='Tên thẻ' rules={[{ required: true, message: 'Nhập tên thẻ' }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</Layout>
	);
};

export default BlogManager;
