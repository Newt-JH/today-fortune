// 쿠키에서 사주 정보 가져오기
export function getFortuneInfo() {
  if (typeof document === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'fortuneInfo') {
        const decoded = JSON.parse(decodeURIComponent(value));
        return decoded;
      }
    }
  } catch (error) {
    console.error('쿠키 파싱 오류:', error);
  }
  return null;
}

// 쿠키에서 사용자 이름만 가져오기
export function getUserNameFromCookie(): string {
  const fortuneInfo = getFortuneInfo();
  return fortuneInfo?.name || '운세왕';
}
