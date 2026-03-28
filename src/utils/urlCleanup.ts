// Очистка строки от параметров 
export const cleanUrl = (url: string): string => 
  url.split('?')[0];

// Проверка на URL
const isUrlLike = (str: string): boolean => 
  /^https?:\/\//i.test(str.trim());

// очистка JSON
export const cleanUrlsInJson = <T>(data: T): T => {
  if (data == null || typeof data !== 'object') {
    return typeof data === 'string' && isUrlLike(data)
      ? (cleanUrl(data) as T)
      : data;
  }

  if (Array.isArray(data)) {
    return data.map(cleanUrlsInJson) as T;
  }

  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, cleanUrlsInJson(v)])
  ) as T;
};