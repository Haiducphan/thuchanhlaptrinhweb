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

	// --- BÀI THỰC HÀNH 02  ---
	{
		path: '/oan-tu-ti',
		name: 'TH02 - Bài 1: Oẳn Tù Tì',
		icon: 'PlayCircleOutlined',
		component: './GameOanTuTi',
	},
	{
		path: '/ngan-hang-de',
		name: 'TH02 - Bài 2: Ngân hàng đề thi',
		icon: 'DatabaseOutlined',
		component: './BankManager',
	},
	// ------------------------------

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

	// ĐIỀU HƯỚNG VÀ NGOẠI LỆ 
	{ path: '/', redirect: '/dashboard' },
	{ path: '/403', component: './exception/403/403Page', layout: false },
	{ path: '/hold-on', component: './exception/DangCapNhat', layout: false },

	{ component: './exception/404' },
];