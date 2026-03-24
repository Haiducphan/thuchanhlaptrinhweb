import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  const [ketQua, setKetQua] = useState<TraCuu.IKetQua[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const traCuuVanBang = async (params: TraCuu.IParams) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ip3}/tra-cuu`, { params });
      const data = response?.data?.data ?? [];
      setKetQua(data);
      return data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getChiTietVanBang = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ip3}/tra-cuu/${id}`);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const resetKetQua = () => {
    setKetQua([]);
  };

  // Stub functions for TableBase compatibility (TraCuu page doesn't use TableBase)
  const setFilters = () => {};
  const setSelectedIds = () => {};

  return {
    ketQua,
    setKetQua,
    loading,
    traCuuVanBang,
    getChiTietVanBang,
    resetKetQua,
    setFilters,
    setSelectedIds,
  };
};
