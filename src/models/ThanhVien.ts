import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<ThanhVien.IRecord>('thanh-vien');

	return {
		...objInit,
	};
};
