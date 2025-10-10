import FortuneLandingClient from '../../components/FortuneLandingClient';
import { Suspense } from 'react';

export const metadata = { title: '운세 분석 중' };

function SearchParamsWrapper() {
  if (typeof window === 'undefined') {
    return <FortuneLandingClient type="daily" />;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const type = searchParams.get('type') || 'daily';

  return <FortuneLandingClient type={type} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper />
    </Suspense>
  );
}