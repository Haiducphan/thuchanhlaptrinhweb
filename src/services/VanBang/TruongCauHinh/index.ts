import useInitService from '@/hooks/useInitService';

export default () => {
  const objInit = useInitService('truong-cau-hinh');
  return { ...objInit };
};
