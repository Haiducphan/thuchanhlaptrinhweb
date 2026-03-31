import request from '@/utils/axios';

export const LichSuThaoTacServices = {
	getService: (params: any) => request.get('/lich-su-thao-tac/page', { params }),
	getAllService: (params: any) => request.get('/lich-su-thao-tac/all', { params }),
	getByIdService: (id: string | number) => request.get(`/lich-su-thao-tac/${id}`),
	postService: (data: any) => request.post('/lich-su-thao-tac', data),
	putService: (id: string | number, data: any) => request.put(`/lich-su-thao-tac/${id}`, data),
	deleteService: (id: string | number) => request.delete(`/lich-su-thao-tac/${id}`),
};
