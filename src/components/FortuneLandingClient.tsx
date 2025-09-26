'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/css/ResultLanding.module.css';

const CLOVERS = [
  '/fortune/clover1.png',
  '/fortune/clover2.png',
  '/fortune/clover3.png',
  '/fortune/clover4.png',
];
const FULL_CLOVER = '/fortune/fullClover.png';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const pairs = document.cookie?.split(';') ?? [];
  for (const p of pairs) {
    const [k, ...rest] = p.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

export default function FortuneLandingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'daily'; // 기본값은 일간

  // 쿠키 없으면 알럿 후 /info로
  useEffect(() => {
    const saved = getCookie('fortuneInfo');
    if (!saved) {
      alert('정보 입력 후 이용이 가능합니다.');
      router.replace('/info');
    }
  }, [router]);

  // 바디 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const [frame, setFrame] = useState(0);
  const [percent, setPercent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // 네잎클로버 프레임(300ms)
  useEffect(() => {
    if (isComplete) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % CLOVERS.length), 300);
    return () => clearInterval(t);
  }, [isComplete]);

  // 0 → 100 진행 (~7.5s)
  useEffect(() => {
    if (isComplete) return;
    const step = 1, intervalMs = 75;
    const t = setInterval(() => {
      setPercent((p) => {
        const np = Math.min(100, p + step);
        if (np >= 100) {
          clearInterval(t);
          setIsComplete(true);
        }
        return np;
      });
    }, intervalMs);
    return () => clearInterval(t);
  }, [isComplete]);

  // 광고: 카운트다운(5→1) 후 X 표시, X만 클릭 가능
  const [showAd, setShowAd] = useState(true);
  const [canCloseAd, setCanCloseAd] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [hideCta, setHideCta] = useState(false);

  useEffect(() => {
    if (!showAd) return;
    setCountdown(5);
    setCanCloseAd(false);
    const it = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(it);
          setCanCloseAd(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(it);
  }, [showAd]);

  // 포춘쿠키 광고 클릭 핸들러
  const handleFortuneAdClick = () => {
    window.open('https://example.com/fortune-ad', '_blank');
    // type에 따라 다른 결과 페이지로 이동
    const resultRoutes = {
      monthly: '/monthly-result',
      yearly: '/yearly-result',
      wealth: '/wealth-result',
      love: '/love-result',
      daily: '/result'
    };
    router.push(resultRoutes[type as keyof typeof resultRoutes] || '/result');
  };

  // CTA 버튼 클릭 핸들러
  const handleCtaButtonClick = () => {
    window.open('https://example.com/fortune-ad', '_blank');
    const resultRoutes = {
      monthly: '/monthly-result',
      yearly: '/yearly-result',
      wealth: '/wealth-result',
      love: '/love-result',
      daily: '/result'
    };
    router.push(resultRoutes[type as keyof typeof resultRoutes] || '/result');
  };

  const cloverSrc = CLOVERS[frame];

  return (
    <div className={styles.screen}>
      <button
        className={styles.back}
        aria-label="뒤로가기"
        onClick={() => history.back()}
      >
        ‹
      </button>

      {/* ① 이미지 (상단, 영역 고정) */}
      <section className={styles.hero}>
        {!isComplete ? (
          <Image
            src={cloverSrc}
            alt="행운 클로버"
            width={110}
            height={110}
            priority
            className={styles.heroImg}
          />
        ) : (
          <Image
            src={FULL_CLOVER}
            alt="행운 클로버"
            width={110}
            height={110}
            priority
            className={styles.heroImg}
          />
        )}
      </section>

      {/* ② 문구 블록 (이미지와 광고 사이) */}
      <section className={styles.copy}>
        {!isComplete && <div className={styles.percent}>{percent}%</div>}
        <h2 className={styles.captionTitle}>
          {isComplete ? '운세 분석 완료!' : '운세를 분석 중입니다'}
        </h2>
        <p className={styles.captionDesc}>
          {isComplete
            ? <>입력하신 사주 정보를 기반으로<br />운세 분석을 완료하였습니다.</>
            : <>사주의 명리학을 기반으로 AI를 적용하여<br />운세를 산출하고 있습니다</>}
        </p>
      </section>

      {/* ③ 포춘쿠키 광고 (항상 표시) */}
      <section className={styles.adSection}>
        {showAd && (
          <>
            <div className={styles.fortuneContainer}>
              <div
                className={styles.fortuneAdCard}
                style={{ cursor: 'pointer' }}
                onClick={handleFortuneAdClick}
              >
                <div className={styles.fortuneAdHeader}>
                  <h3 className={styles.fortuneAdTitle}>행운의 포춘쿠키!</h3>
                  <p className={styles.fortuneAdSubtitle}>포춘쿠키 속 행운을 확인하세요 <br />( 이 부분은 이미지로 변경 예정 )</p>
                </div>
                <div className={styles.fortuneAdImageContainer}>
                  <div className={styles.fortuneAdImage} />
                </div>
                <div className={styles.fortuneAdSize}>360 X 160</div>
              </div>
            </div>

            {/* X 버튼 */}
            {!canCloseAd ? (
              <div className={styles.adCloseCountdown} aria-hidden="true">
                {countdown}
              </div>
            ) : (
              <button
                className={styles.adClose}
                aria-label="광고 닫기"
                onClick={() => router.push('/info')}
              >
                ×
              </button>
            )}

            <footer className={styles.partnerNote}>
              해당 링크 5초 이상 체류 후 <br />운세 결과 확인이 가능합니다.
            </footer>
          </>
        )}
      </section>

      {/* ④ 하단 CTA (+ X 버튼) */}
      {isComplete && !hideCta && (
        <div className={styles.ctaWrap}>
          <button
            className={styles.ctaBtn}
            onClick={handleCtaButtonClick}
          >
            광고 보고 결과 보기
          </button>
          <button
            className={styles.ctaClose}
            aria-label="하단 버튼 닫기"
            onClick={() => router.push('/info')}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}