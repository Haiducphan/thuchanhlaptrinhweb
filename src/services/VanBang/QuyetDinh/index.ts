import useInitService from '@/hooks/useInitService';

export default () => {
  const objInit = useInitService('quyet-dinh');
  return { ...objInit };
};
