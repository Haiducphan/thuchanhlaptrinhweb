import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<QuyetDinh.IRecord>('quyet-dinh', 'condition', undefined, undefined, { ngay_ban_hanh: -1 });
  return {
    ...objInit,
  };
};
