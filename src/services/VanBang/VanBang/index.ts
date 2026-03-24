import useInitService from '@/hooks/useInitService';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const useVanBangService = () => {
  const objInit = useInitService('van-bang');

  // Lấy chi tiết văn bằng kèm giá trị trường động
  const getChiTietVanBang = (id: string) => {
    return axios.get(`${ip3}/van-bang/${id}/chi-tiet`);
  };

  // Tạo văn bằng kèm chi tiết (1 request)
  const taoVanBang = (payload: {
    vanBang: Partial<VanBang.IRecord>;
    chiTietList: Array<{ truong_cau_hinh_id: string; gia_tri?: string }>;
  }) => {
    return axios.post(`${ip3}/van-bang/tao`, payload);
  };

  // Cập nhật văn bằng kèm chi tiết (1 request)
  const capNhatVanBang = (
    id: string,
    payload: {
      vanBang: Partial<VanBang.IRecord>;
      chiTietList: Array<{ truong_cau_hinh_id: string; gia_tri?: string; _id?: string }>;
    },
  ) => {
    return axios.put(`${ip3}/van-bang/${id}/chi-tiet`, payload);
  };

  return {
    ...objInit,
    getChiTietVanBang,
    taoVanBang,
    capNhatVanBang,
  };
};

export default useVanBangService;
