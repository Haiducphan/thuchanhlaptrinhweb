import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<LichSuThaoTac.IRecord>('lich-su-thao-tac');

	return {
		...objInit,
	};
};
