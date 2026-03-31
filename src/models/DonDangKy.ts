import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DonDangKy.IRecord>('don-dang-ky');

	return {
		...objInit,
	};
};
