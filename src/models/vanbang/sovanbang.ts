import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<SoVanBang.IRecord>('so-van-bang', 'condition', undefined, undefined, { nam: -1 });
  return {
    ...objInit,
  };
};
