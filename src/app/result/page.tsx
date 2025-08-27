'use client';

import { useEffect, useState } from 'react';

type Saved = {
  name: string;
  calendar: 'SOLAR' | 'LUNAR_PLAIN' | 'LUNAR_LEAP';
  birth: string;
  time: string;
  gender: 'M' | 'F';
  ts?: number;
} | null;

function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

export default function ResultPage() {
  const [saved, setSaved] = useState<Saved>(null);

  useEffect(() => {
    try {
      const raw = readCookie('fortuneInfo');
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      setSaved(null);
    }
  }, []);

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>입력 확인</h1>
      {saved ? (
        <pre style={{ background: '#fafafa', padding: 12, borderRadius: 8, border: '1px solid #eee', overflowX: 'auto' }}>
{JSON.stringify(saved, null, 2)}
        </pre>
      ) : (
        <p style={{ color: '#6B7280' }}>
          저장된 정보가 없습니다. <a href="/info">/info</a>에서 정보를 입력해 주세요.
        </p>
      )}
    </div>
  );
}
