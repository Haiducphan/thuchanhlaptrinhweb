/**
 * Mock Interceptor cho QLVB (Bài thực hành)
 * Dùng request interceptor để trả mock data trực tiếp.
 *
 * LUÔN mock các route /slink/{van-bang,so-van-bang,quyet-dinh,truong-cau-hinh,tra-cuu}/*
 * để bài thực hành hoạt động mà không cần backend thật.
 *
 * Khi backend thật có sẵn, chỉ cần đổi cờ MOCK_ENABLED = false bên dưới.
 */

import axios, { type AxiosRequestConfig } from 'axios';

// ===== Cờ bật/tắt mock =====
const MOCK_ENABLED = true; // Đổi thành false khi có backend thật

// ===== Entities cần mock =====
const MOCKED_ENTITIES = ['van-bang', 'so-van-bang', 'quyet-dinh', 'truong-cau-hinh', 'tra-cuu'];
import {
  soVanBangCrud,
  quyetDinhCrud,
  truongCauHinhCrud,
  vanBangCrud,
  traCuuCrud,
} from './vanbangStore';

// ===== Helpers =====
const getPathParts = (url: string) => {
  try {
    // Works for: https://gw.ript.vn/slink/tra-cuu?params
    const parsed = new URL(url);
    const rawPath = parsed.pathname; // e.g. "/slink/so-van-bang/page"
    const parts = rawPath.split('/').filter(Boolean);
    return parts;
  } catch {
    // Fallback: handles relative paths like /tra-cuu or slink/tra-cuu
    const [rawPath] = url.split('?');
    const parts = rawPath.split('/').filter(Boolean);
    return parts; // e.g. ['slink', 'tra-cuu'] or ['tra-cuu']
  }
};

// Parse query params từ URL string (dùng khi axios chưa serialize params)
const parseQueryParams = (url: string): Record<string, string> => {
  try {
    const parsed = new URL(url);
    const result: Record<string, string> = {};
    parsed.searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  } catch {
    // Fallback: lấy query string từ url
    const qIdx = url.indexOf('?');
    if (qIdx === -1) return {};
    const qs = url.substring(qIdx + 1);
    const result: Record<string, string> = {};
    qs.split('&').forEach((pair) => {
      const [k, v] = pair.split('=');
      if (k) result[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return result;
  }
};

const parseParams = (params: any): any => {
  if (!params) return {};
  let p = { ...params };
  if (typeof p.sort === 'string') {
    try { p = { ...p, sort: JSON.parse(p.sort) }; } catch {}
  }
  if (typeof p.condition === 'string') {
    try { p = { ...p, condition: JSON.parse(p.condition) }; } catch {}
  }
  if (typeof p.filters === 'string') {
    try { p = { ...p, filters: JSON.parse(p.filters) }; } catch {}
  }
  return p;
};

const parseData = (config: AxiosRequestConfig): any => {
  if (!config.data) return {};
  try {
    return typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  } catch {
    return {};
  }
};

// ===== Mock Logic Dispatcher =====
const handleMock = (config: AxiosRequestConfig): any => {
  const url = config.url || '';
  const parts = getPathParts(url);
  // Lấy params: ưu tiên config.params, fallback từ URL query string
  const params = Object.keys(config.params || {}).length > 0
    ? parseParams(config.params)
    : parseQueryParams(url);
  const data = parseData(config);

  // parts: absolute → ['slink', 'quyet-dinh', 'page'] OR relative → ['quyet-dinh', 'page']
  // entity = first non-slink part, rest = remaining parts
  let entity: string, remaining: string[];
  if (parts[0] === 'slink') {
    [, entity, ...remaining] = parts;
  } else {
    [entity, ...remaining] = parts;
  }
  // remaining = ['page'] or ['many'] or ['id123'] or ['id123', 'chi-tiet']
  const lastAction = remaining[remaining.length - 1] || '';
  const idAction = remaining[0] || '';

  // Helper: check if a string looks like an ID (not a known action word)
  const isId = (s: string) =>
    s.length > 8 && !['page', 'many', 'ids', 'one', 'get', 'tao', 'chi-tiet'].includes(s);

  switch (`${entity}/${lastAction}`) {
    // --- SO VAN BANG ---
    case 'so-van-bang/page':
    case 'so-van-bang/':
      return soVanBangCrud.page(params);
    case 'so-van-bang/many':
      return soVanBangCrud.many(params);
    case 'so-van-bang/ids':
      return soVanBangCrud.many(params);

    // --- QUYET DINH ---
    case 'quyet-dinh/page':
    case 'quyet-dinh/':
      return quyetDinhCrud.page(params);
    case 'quyet-dinh/many':
      return quyetDinhCrud.many(params);
    case 'quyet-dinh/ids':
      return quyetDinhCrud.many(params);

    // --- TRUONG CAU HINH ---
    case 'truong-cau-hinh/page':
    case 'truong-cau-hinh/':
      return truongCauHinhCrud.page(params);
    case 'truong-cau-hinh/many':
      return truongCauHinhCrud.many(params);
    case 'truong-cau-hinh/ids':
      return truongCauHinhCrud.many(params);

    // --- VAN BANG ---
    case 'van-bang/page':
    case 'van-bang/':
      return vanBangCrud.page(params);
    case 'van-bang/chi-tiet':
      return vanBangCrud.chiTiet(idAction);
    case 'van-bang/tao':
      return vanBangCrud.tao(data);

    // --- TRA CUU ---
    case 'tra-cuu':
      return traCuuCrud.get(params);
    case 'tra-cuu/get':
      return traCuuCrud.get(params);

    default: {
      // Generic ID-based routes: /entity/id or /slink/entity/id
      if (isId(idAction)) {
        switch (entity) {
          case 'so-van-bang':
            return soVanBangCrud.getById(idAction);
          case 'quyet-dinh':
            return quyetDinhCrud.getById(idAction);
          case 'truong-cau-hinh':
            return truongCauHinhCrud.getById(idAction);
          case 'van-bang':
            if (remaining[1] === 'chi-tiet') {
              return vanBangCrud.putChiTiet(idAction, data);
            }
            return vanBangCrud.getById(idAction);
          default:
            break;
        }
      }
      // /van-bang/:id/chi-tiet PUT (e.g. ['van-bang', 'abc123', 'chi-tiet'])
      if (entity === 'van-bang' && remaining[1] === 'chi-tiet') {
        return vanBangCrud.putChiTiet(idAction, data);
      }
      // Unknown route → empty success
      return { data: { data: [] } };
    }
  }
};

// ===== Register Interceptor =====
export const registerMockInterceptor = () => {
  if ((window as any).__mockInterceptorRegistered__) return;
  (window as any).__mockInterceptorRegistered__ = true;

  console.log('[Mock] Interceptor registered ✅');

  axios.interceptors.request.use(
    (config) => {
      const url = config.url || '';
      console.log('[Mock] 📡 Incoming request:', config.method?.toUpperCase(), url);

      // Bắt cả absolute URL (/slink/...) lẫn relative URL (/quyet-dinh, /so-van-bang, ...)
      if (!MOCK_ENABLED) return config;

      const parts = getPathParts(url);
      // parts có thể là ['slink', 'quyet-dinh', 'page'] hoặc ['quyet-dinh', 'page']
      const entity = parts[0] === 'slink' ? parts[1] : parts[0];

      console.log('[Mock] URL:', url, '→ entity:', entity, '→ matched:', MOCKED_ENTITIES.includes(entity));

      if (!MOCKED_ENTITIES.includes(entity)) return config;

      try {
        const result = handleMock(config);
        console.log('[Mock] ✅ Serving mock data for', entity, '/', parts[parts.length - 1]);
        // Trả mock response thay vì gọi network
        return Promise.resolve({
          ...config,
          adapter: () => Promise.resolve({ data: result.data, status: 200, statusText: 'OK', headers: {}, config }),
        } as any);
      } catch (err: any) {
        console.error('[Mock] ❌ Error:', err.message);
        if (err.message === 'Not found') {
          const mockError: any = new Error('Not found');
          mockError.response = {
            status: 404,
            data: { detail: { errorCode: '040', message: 'Không tìm thấy dữ liệu' } },
          };
          return Promise.reject(mockError);
        }
        return Promise.reject(err);
      }
    },
    (error) => Promise.reject(error),
  );
};
