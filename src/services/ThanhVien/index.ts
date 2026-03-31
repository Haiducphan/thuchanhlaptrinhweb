import request from '@/utils/axios';

export const ThanhVienServices = {
	getService: (params: any) => request.get('/thanh-vien/page', { params }),
	getAllService: (params: any) => request.get('/thanh-vien/all', { params }),
	getByIdService: (id: string | number) => request.get(`/thanh-vien/${id}`),
	postService: (data: any) => request.post('/thanh-vien', data),
	putService: (id: string | number, data: any) => request.put(`/thanh-vien/${id}`, data),
	putManyService: (ids: (string | number)[], data: any) =>
		request.put('/thanh-vien/many', { ids, ...data }),
	deleteService: (id: string | number) => request.delete(`/thanh-vien/${id}`),
	deleteManyService: (ids: (string | number)[]) => request.delete('/thanh-vien/many', { data: { ids } }),
	getImportHeaders: () => request.get('/thanh-vien/import-headers'),
	getImportTemplate: () => request.get('/thanh-vien/import-template', { responseType: 'blob' }),
	postValidateImport: (payload: any) => request.post('/thanh-vien/validate-import', payload),
	postExecuteImport: (payload: any) => request.post('/thanh-vien/execute-import', payload),
	getExportFields: () => request.get('/thanh-vien/export-fields'),
	postExport: (payload: any, params: any) =>
		request.post('/thanh-vien/export', payload, { params, responseType: 'blob' }),
};
