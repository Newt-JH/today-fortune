'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function LandingClient() {
  const router = useRouter();

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

  // 광고: 5초 뒤 X 노출
  const [showAd, setShowAd] = useState(true);
  const [canCloseAd, setCanCloseAd] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setCanCloseAd(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // CTA X 클릭 시 숨김
  const [hideCta, setHideCta] = useState(false);

  const cloverSrc = CLOVERS[frame];

  return (
    <div className={styles.screen}>
      <button className={styles.back} aria-label="뒤로가기" onClick={() => history.back()}>
        ‹
      </button>

      {/* ① 이미지 (상단) */}
      <section className={styles.hero}>
        {!isComplete ? (
          <Image
            src={cloverSrc}
            alt="행운 클로버"
            width={256}
            height={256}
            priority
            className={styles.heroImg}
          />
        ) : (
          <Image
            src={FULL_CLOVER}
            alt="행운 클로버"
            width={256}
            height={256}
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

      {/* ③ 쿠팡 광고 (문구 아래) + 고지문 */}
      <section className={styles.adSection}>
        {showAd && (
          <>
            <div className={styles.adCard}>
              <div className={styles.adLeft}>
                <span className={styles.adBadge}>쿠팡</span>
                <div className={styles.adTitle}>
                  3세이상 부모자식 놀이 확산용 미니농구 게임, 1개
                </div>
                <div className={styles.adThumb} aria-hidden />
              </div>

              {canCloseAd && (
                <button
                  className={styles.adClose}
                  aria-label="광고 닫기"
                  onClick={() => setShowAd(false)}
                >
                  ×
                </button>
              )}
            </div>

            <footer className={styles.partnerNote}>
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, <br />
              이에 따른 일정액의 수수료를 제공받습니다.
            </footer>
          </>
        )}
      </section>

      {/* ④ 하단 CTA (+ X 버튼) */}
      {isComplete && !hideCta && (
        <div className={styles.ctaWrap}>
          <button className={styles.ctaBtn} onClick={() => router.push('/result')}>
            상품 보고 결과 보기
          </button>
          <button
            className={styles.ctaClose}
            aria-label="하단 버튼 닫기"
            onClick={() => setHideCta(true)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
