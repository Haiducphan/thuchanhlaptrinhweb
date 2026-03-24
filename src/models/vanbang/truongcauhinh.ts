import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<TruongCauHinh.IRecord>(
    'truong-cau-hinh',
    'condition',
    undefined,
    undefined,
    { thu_tu_hien_thi: 1 },
  );
  return {
    ...objInit,
  };
};
