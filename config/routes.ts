export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	// --- BÀI THỰC HÀNH 02 ---
	{
		path: '/oan-tu-ti',
		name: 'TH02 - Bài 1: Oẳn Tù Tì',
		icon: 'PlayCircleOutlined',
		component: './GameOanTuTi',
	},

	// =============================================
	// BÀI THỰC HÀNH - QUẢN LÝ CÂU LẠC BỘ
	// =============================================
	{
		path: '/cau-lac-bo',
		name: 'Quản lý Câu lạc bộ',
		icon: 'TeamOutlined',
		routes: [
			{
				path: '/cau-lac-bo',
				name: 'Danh sách CLB',
				component: './CauLacBo',
			},
			{
				path: '/cau-lac-bo/don-dang-ky',
				name: 'Đơn đăng ký',
				component: './DonDangKy',
			},
			{
				path: '/cau-lac-bo/thanh-vien',
				name: 'Thành viên CLB',
				component: './ThanhVien',
			},
			{
				path: '/cau-lac-bo/thong-ke',
				name: 'Báo cáo & Thống kê',
				component: './ThongKe',
			},
			{
				path: '/cau-lac-bo/lich-su',
				name: 'Lịch sử thao tác',
				component: './LichSuThaoTac',
			},
		],
	},
	{
		path: '/ngan-hang-de',
		name: 'TH02 - Bài 2: Ngân hàng đề thi',
		icon: 'DatabaseOutlined',
		component: './BankManager',
	},

	// --- BÀI THỰC HÀNH 03  ---
	{
		path: '/booking-manager',
		name: 'TH03 - Quản lý Đặt lịch',
		icon: 'CalendarOutlined',
		component: './BookingManager',
	},


	{
		path: '/guess-number',
		name: 'Bài 1: Đoán số',
		icon: 'QuestionCircleOutlined',
		component: './GuessNumber',
	},
	{
		path: '/study-manager',
		name: 'Bài 2: Quản lý học tập',
		icon: 'BookOutlined',
		component: './StudyManager',
	},
	{
		path: '/dashboard',
		name: 'Thống kê tổng quan',
		component: './Dashboard',
		icon: 'DashboardOutlined',
	},
	{
		path: '/product',
		name: 'Quản lý Sản phẩm',
		icon: 'ShopOutlined',
		component: './Product',
	},
	{
		path: '/order',
		name: 'Quản lý Đơn hàng',
		icon: 'OrderedListOutlined',
		component: './Order',
	},

	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'CheckSquareOutlined',
		component: './TodoList',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	{
		path: '/notification',
		routes: [
			{ path: './subscribe', exact: true, component: './ThongBao/Subscribe' },
			{ path: './check', exact: true, component: './ThongBao/Check' },
			{ path: './', exact: true, component: './ThongBao/NotifOneSignal' },
		],
		layout: false,
		hideInMenu: true,
	},

	// =============================================
	// BÀI THỰC HÀNH - QUẢN LÝ VĂN BẰNG
	// =============================================
	{
		path: '/van-bang',
		name: 'menu.QLVB',
		icon: 'FileTextOutlined',
		routes: [
			{
				path: '/van-bang/tra-cuu',
				name: 'menu.QLVB.TraCuuVB',
				component: './VanBang/TraCuu',
				layout: false,
			},
			{
				path: '/van-bang/so-van-bang',
				name: 'menu.QLVB.SoVanBang',
				component: './VanBang/SoVanBang',
			},
			{
				path: '/van-bang/quyet-dinh',
				name: 'menu.QLVB.QDTotNghiep',
				component: './VanBang/QuyetDinh',
			},
			{
				path: '/van-bang/cau-hinh-bieu-mau',
				name: 'menu.QLVB.CauHinhBieuMau',
				component: './VanBang/TruongCauHinh',
			},
			{
				path: '/van-bang/thong-tin-van-bang',
				name: 'menu.QLVB.ThongTinVanBang',
				component: './VanBang/VanBang',
			},
		],
	},

	// ĐIỀU HƯỚNG VÀ NGOẠI LỆ
	{ path: '/', redirect: '/dashboard' },
	{ path: '/403', component: './exception/403/403Page', layout: false },
	{ path: '/hold-on', component: './exception/DangCapNhat', layout: false },

	// === TRAVEL PLANNING ===
	{
		path: '/travel',
		name: 'Du Lịch',
		icon: 'CarryOutOutlined',
		layout: false,
		routes: [
			{
				path: '/travel',
				component: './Travel/index',
			},
			{
				path: '/travel/lich-trinh',
				component: './Travel/LichTrinh',
			},
			{
				path: '/travel/ngan-sach',
				component: './Travel/NganSach',
			},
			{
				path: '/travel/quan-tri',
				component: './Travel/QuanTri',
			},
		],
	},

	{ component: './exception/404' },
];