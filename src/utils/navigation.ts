// 현재 URL의 쿼리 파라미터를 가져오는 함수
export function getQueryParams(): string {
  if (typeof window === 'undefined') return '';

  const searchParams = new URLSearchParams(window.location.search);
  const params = searchParams.toString();

  return params ? `?${params}` : '';
}

// 경로에 현재 쿼리 파라미터를 추가하는 함수
export function addQueryParams(path: string): string {
  const params = getQueryParams();

  // 이미 쿼리 파라미터가 있는 경우
  if (path.includes('?')) {
    return params ? `${path}&${params.slice(1)}` : path;
  }

  // 쿼리 파라미터가 없는 경우
  return `${path}${params}`;
}
