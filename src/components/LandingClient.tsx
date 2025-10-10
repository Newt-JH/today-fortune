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

function setCookie(name: string, value: string, hours: number = 2) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + (hours * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function checkAdCooldown(): boolean {
  const lastShown = getCookie('coupangAdShown');
  if (!lastShown) return false;

  const lastTime = parseInt(lastShown);
  const now = Date.now();
  const twoHours = 2 * 60 * 60 * 1000; // 2시간을 밀리초로

  return (now - lastTime) < twoHours;
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

  // 광고: 카운트다운(5→1) 후 X 표시, X만 클릭 가능
  const [showAd, setShowAd] = useState(true);
  const [canCloseAd, setCanCloseAd] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showCoupangAd, setShowCoupangAd] = useState(false);

  // 쿠팡 광고 쿨다운 체크
  useEffect(() => {
    const shouldShowCoupang = !checkAdCooldown();
    setShowCoupangAd(shouldShowCoupang);

    if (shouldShowCoupang) {
      // 쿠팡 광고를 보여주는 경우 현재 시간 저장
      setCookie('coupangAdShown', Date.now().toString());
    }
  }, []);

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

  // CTA X 클릭 시 숨김
  const [hideCta, setHideCta] = useState(false);
  const [adClicked, setAdClicked] = useState(false);

  // 광고 클릭 후 포커스 복귀 시 결과 페이지 이동
  useEffect(() => {
    if (!adClicked) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // 페이지로 돌아왔을 때
        router.push('/result');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [adClicked, router]);

  // 수정 필요: 광고 클릭 핸들러 함수 (나중에 로직 변경 가능)
  const handleCoupangAdClick = () => {
    window.open('https://example.com/coupang-ad', '_blank');
    setAdClicked(true);
  };

  const handleFortuneAdClick = () => {
    window.open('https://example.com/fortune-ad', '_blank');
    setAdClicked(true);
  };

  // 수정 필요: CTA 버튼 클릭 핸들러 함수 (나중에 로직 변경 가능)
  const handleCtaButtonClick = () => {
    const adLink = showCoupangAd
      ? 'https://example.com/coupang-ad'  // 쿠팡 광고 링크
      : 'https://example.com/fortune-ad'; // 포춘쿠키 광고 링크

    window.open(adLink, '_blank');
    setAdClicked(true);
  };

  const cloverSrc = CLOVERS[frame];

  return (
    <div className={styles.screen}>
      <button
        className={styles.back}
        aria-label="뒤로가기"
        onClick={() => history.back()} // 수정 필요: 나중에 함수 변경 가능
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

      {/* ③ 쿠팡 광고 또는 포춘쿠키 이미지 (문구 아래) + 고지문 */}
      <section className={styles.adSection}>
        {showAd && (
          <>
            {showCoupangAd ? (
              // 쿠팡 광고 표시 (2시간 지났을 때)
              <>
                <div
                  className={styles.adCard}
                  style={{ cursor: 'pointer' }}
                  onClick={handleCoupangAdClick}
                >
                  <div className={styles.adLeft}>
                    <span className={styles.adBadge}>쿠팡</span>
                    <div className={styles.adTitle}>
                      3세이상 부모자식 놀이 확산용 미니농구 게임, 1개
                    </div>
                    <div className={styles.adThumb} aria-hidden />
                  </div>
                </div>

                {/* X 버튼은 별도로 위치 */}
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
                  이 포스팅은 쿠팡 파트너스 활동의 일환으로, <br />
                  이에 따른 일정액의 수수료를 제공받습니다.
                </footer>
              </>
            ) : (
              // 포춘쿠키 대체 콘텐츠 표시 (2시간 이내일 때)
              <>
                <div className={styles.fortuneContainer}>
                  {/* 수정 필요 부분: 실제 이미지와 링크로 교체 */}
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

                <footer className={styles.partnerNote}>
                  해당 링크 5초 이상 체류 후 <br />운세 결과 확인이 가능합니다.
                </footer>
              </>
            )}
          </>
        )}
      </section>

      {/* ④ 하단 CTA */}
      {isComplete && !hideCta && (
        <div className={styles.ctaWrap}>
          <button
            className={styles.ctaBtn}
            onClick={handleCtaButtonClick}
          >
            {showCoupangAd ? '상품 보고 결과 보기' : '광고 보고 결과 보기'}
          </button>
          {showCoupangAd && (
            <button
              className={styles.ctaClose}
              aria-label="하단 버튼 닫기"
              onClick={() => router.push('/info')}
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}
