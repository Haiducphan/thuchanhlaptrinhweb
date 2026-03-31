import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<CauLacBo.IRecord>('cau-lac-bo');

	return {
		...objInit,
	};
};
