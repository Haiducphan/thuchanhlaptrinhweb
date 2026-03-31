import request from '@/utils/axios';

export const CauLacBoServices = {
	getService: (params: any) => request.get('/cau-lac-bo/page', { params }),
	getAllService: (params: any) => request.get('/cau-lac-bo/all', { params }),
	getByIdService: (id: string | number) => request.get(`/cau-lac-bo/${id}`),
	postService: (data: any) => request.post('/cau-lac-bo', data),
	putService: (id: string | number, data: any) => request.put(`/cau-lac-bo/${id}`, data),
	putManyService: (ids: (string | number)[], data: any) =>
		request.put('/cau-lac-bo/many', { ids, ...data }),
	deleteService: (id: string | number) => request.delete(`/cau-lac-bo/${id}`),
	deleteManyService: (ids: (string | number)[]) => request.delete('/cau-lac-bo/many', { data: { ids } }),
	getImportHeaders: () => request.get('/cau-lac-bo/import-headers'),
	getImportTemplate: () => request.get('/cau-lac-bo/import-template', { responseType: 'blob' }),
	postValidateImport: (payload: any) => request.post('/cau-lac-bo/validate-import', payload),
	postExecuteImport: (payload: any) => request.post('/cau-lac-bo/execute-import', payload),
	getExportFields: () => request.get('/cau-lac-bo/export-fields'),
	postExport: (payload: any, params: any) =>
		request.post('/cau-lac-bo/export', payload, { params, responseType: 'blob' }),
};
