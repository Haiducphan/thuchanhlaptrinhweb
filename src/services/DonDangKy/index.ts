import request from '@/utils/axios';

export const DonDangKyServices = {
	getService: (params: any) => request.get('/don-dang-ky/page', { params }),
	getAllService: (params: any) => request.get('/don-dang-ky/all', { params }),
	getByIdService: (id: string | number) => request.get(`/don-dang-ky/${id}`),
	postService: (data: any) => request.post('/don-dang-ky', data),
	putService: (id: string | number, data: any) => request.put(`/don-dang-ky/${id}`, data),
	putManyService: (ids: (string | number)[], data: any) =>
		request.put('/don-dang-ky/many', { ids, ...data }),
	deleteService: (id: string | number) => request.delete(`/don-dang-ky/${id}`),
	deleteManyService: (ids: (string | number)[]) => request.delete('/don-dang-ky/many', { data: { ids } }),
	getImportHeaders: () => request.get('/don-dang-ky/import-headers'),
	getImportTemplate: () => request.get('/don-dang-ky/import-template', { responseType: 'blob' }),
	postValidateImport: (payload: any) => request.post('/don-dang-ky/validate-import', payload),
	postExecuteImport: (payload: any) => request.post('/don-dang-ky/execute-import', payload),
	getExportFields: () => request.get('/don-dang-ky/export-fields'),
	postExport: (payload: any, params: any) =>
		request.post('/don-dang-ky/export', payload, { params, responseType: 'blob' }),
};
