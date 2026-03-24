import useInitService from '@/hooks/useInitService';

export default () => {
  const objInit = useInitService('so-van-bang');
  return { ...objInit };
};
