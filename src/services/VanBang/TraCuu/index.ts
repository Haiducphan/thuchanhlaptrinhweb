import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const useTraCuuService = () => {
  // Tra cứu văn bằng - trả về kết quả + tự động tăng lượt tra cứu
  const traCuuVanBang = (params: TraCuu.IParams) => {
    return axios.get(`${ip3}/tra-cuu`, { params });
  };

  // Lấy chi tiết văn bằng sau tra cứu
  const getChiTietVanBang = (id: string) => {
    return axios.get(`${ip3}/tra-cuu/${id}`);
  };

  return {
    traCuuVanBang,
    getChiTietVanBang,
  };
};

export default useTraCuuService;
