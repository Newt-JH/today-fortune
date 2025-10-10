'use client';

import FortuneLandingClient from '../../components/FortuneLandingClient';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchParamsWrapper() {
  const searchParams = useSearchParams();
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