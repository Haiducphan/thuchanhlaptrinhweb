import useInitService from '@/hooks/useInitService';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<VanBang.IRecord[]>([]);
  const [record, setRecord] = useState<VanBang.IRecord>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[] | undefined>(undefined);
  const initFilter: any[] = [];

  const { getService, deleteService } = useInitService('van-bang');

  const getModel = async (
    paramCondition?: any,
    paramPage?: number,
    paramLimit?: number,
  ): Promise<VanBang.IRecord[]> => {
    setLoading(true);
    try {
      const payload = {
        page: paramPage || page,
        limit: paramLimit || limit,
        condition: paramCondition || {},
        poplates: ['quyetDinh'],
        sort: { so_vao_so: -1 },
      };
      const response = await getService(payload, 'page');
      const tempData: VanBang.IRecord[] = response?.data?.data?.result ?? [];
      const tempTotal: number = response?.data?.data?.total ?? 0;
      setDanhSach(tempData);
      setTotal(tempTotal);
      return tempData;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getChiTietVanBangModel = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ip3}/van-bang/${id}/chi-tiet`);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const postModel = async (
    payload: {
      vanBang: Partial<VanBang.IRecord>;
      chiTietList: Array<{ truong_cau_hinh_id: string; gia_tri?: string }>;
    },
    getData?: () => void,
  ) => {
    if (formSubmiting) return Promise.reject('Form submitting');
    setFormSubmiting(true);
    try {
      const res = await axios.post(`${ip3}/van-bang/tao`, payload);
      setVisibleForm(false);
      if (getData) getData();
      else getModel();
      return res.data?.data;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setFormSubmiting(false);
    }
  };

  const putModel = async (
    id: string,
    payload: {
      vanBang: Partial<VanBang.IRecord>;
      chiTietList: Array<{ truong_cau_hinh_id: string; gia_tri?: string; _id?: string }>;
    },
    getData?: () => void,
  ) => {
    if (formSubmiting) return Promise.reject('Form submitting');
    setFormSubmiting(true);
    try {
      const res = await axios.put(`${ip3}/van-bang/${id}/chi-tiet`, payload);
      setVisibleForm(false);
      if (getData) getData();
      else getModel();
      return res.data?.data;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setFormSubmiting(false);
    }
  };

  const deleteModel = async (id: string, getData?: () => void) => {
    setLoading(true);
    try {
      await deleteService(id);
      const maxPage = Math.ceil((total - 1) / limit) || 1;
      let newPage = page;
      if (newPage > maxPage) {
        newPage = maxPage;
        setPage(newPage);
      } else if (getData) {
        getData();
      } else {
        getModel(undefined, newPage);
      }
      return undefined;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rec?: VanBang.IRecord) => {
    if (rec) setRecord(rec);
    setEdit(true);
    setVisibleForm(true);
  };

  const deleteManyModel = async (ids: string[], getData?: () => void) => {
    await Promise.all(ids.map((id) => deleteService(id)));
    if (getData) getData();
    else getModel();
  };

  return {
    danhSach,
    record,
    setRecord,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    setLoading,
    edit,
    setEdit,
    isView,
    setIsView,
    visibleForm,
    setVisibleForm,
    total,
    formSubmiting,
    setFormSubmiting,
    filters,
    setFilters,
    selectedIds,
    setSelectedIds,
    initFilter,
    getModel,
    getChiTietVanBangModel,
    postModel,
    putModel,
    deleteModel,
    deleteManyModel,
    handleEdit,
  };
};
