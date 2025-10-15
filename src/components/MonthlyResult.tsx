/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import styles from "../css/Result.module.css";
import { addQueryParams } from "@/utils/navigation";
import { getFortuneInfo } from "@/utils/cookie";

// 쿠키에서 사용자 이름 가져오기
function getUserNameFromCookie(): string {
  if (typeof document === 'undefined') return '운세왕';

  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'fortuneInfo') {
        const decoded = JSON.parse(decodeURIComponent(value));
        return decoded.name || '운세왕';
      }
    }
  } catch (error) {
    console.error('쿠키 파싱 오류:', error);
  }
  return '운세왕';
}

// 3줄 미리보기 + 펼쳐보기 컴포넌트
function ExpandableText({
  text,
  expanded,
  onToggle,
}: {
  text: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    if (!expanded) {
      const isOverflow = el.scrollHeight > el.clientHeight + 1;
      setOverflow(isOverflow);
    } else {
      setOverflow(true);
    }
  }, [text, expanded]);

  return (
    <>
      <div className={styles.detailWrap}>
        <div
          ref={ref}
          className={`${styles.detailText} ${expanded ? "" : styles.clamp3}`}
        >
          {text}
        </div>

        {!expanded && overflow && <div className={styles.textFade} />}
      </div>

      <div className={styles.expandWrap}>
        {!expanded && overflow && (
          <button className={styles.outlineBtn} onClick={onToggle}>
            펼쳐보기
          </button>
        )}
      </div>

      {/* 구분선: 펼쳐진 상태에서만 표시 */}
      {expanded && (
        <div className={styles.divider} />
      )}
    </>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <section className={styles.card}>{children}</section>;
}

export default function MonthlyResult() {
  const router = useRouter();
  const [activeMonth, setActiveMonth] = useState<'thisMonth' | 'nextMonth'>('thisMonth');
  const [expandedMonthly, setExpandedMonthly] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'love' | 'health' | 'wisdom' | 'wish'>('love');
  const [activeWeek, setActiveWeek] = useState<'week1' | 'week2' | 'week3' | 'week4'>('week1');
  const [isLoading, setIsLoading] = useState(true);

  // 사주정보 변경하기 클릭 핸들러 - 쿠키 삭제 후 info로 이동
  const handleChangeBirthInfo = () => {
    document.cookie = 'fortuneInfo=; Path=/; Max-Age=0';
    router.push(addQueryParams('/info'));
  };

  // 데이터 상태 (API에서 받아옴)
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [themeData, setThemeData] = useState<any>(null);
  const [weekData, setWeekData] = useState<any>(null);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchFortuneData = async () => {
      try {
        const fortuneInfo = getFortuneInfo();
        if (!fortuneInfo) {
          console.error('사주 정보가 없습니다.');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/fortune/monthly', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fortuneInfo),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch monthly fortune data');
        }

        const result = await response.json();
        if (result.success && result.data) {
          setMonthlyData(result.data.monthlyData);
          setThemeData(result.data.themeData);
          setWeekData(result.data.weekData);
        }
      } catch (error) {
        console.error('월간 운세 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFortuneData();
  }, []);

  // 로딩 중이거나 데이터가 없을 때 하얀 화면 표시
  if (isLoading || !monthlyData || !themeData || !weekData) {
    return <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }} />;
  }

  const activeMonthlyData = monthlyData[activeMonth];
  const activeThemeData = themeData[activeTheme];
  const activeWeekData = weekData[activeWeek];

  return (
    <div className={styles.screen}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            className={styles.backBtn}
            aria-label="뒤로가기"
            onClick={() => history.back()}
          >
            ‹
          </button>
          <div className={styles.headerSpacer} />
        </div>
      </header>

      <main className={styles.body}>
        {/* 상단 히어로 */}
        <div className={styles.heroSection} style={{ paddingBottom: '40px' }}>
          <div className={styles.hero} style={{ gap: '0px', marginTop: '-40px' }}>
            <p className={styles.heroText} style={{ marginBottom: '-5px' }}>
              이번 달 나의 행운은<br />
              어디서 올까?
            </p>
            <div className={styles.heroIcon}>
              <img
                src="/icon/icon_calendar.png"
                alt="calendar icon"
                width={120}
                height={120}
              />
            </div>
          </div>
        </div>

        {/* 이번 달 운세 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>이번 달 운세</h2>

          <ExpandableText
            text={activeMonthlyData.text}
            expanded={expandedMonthly}
            onToggle={() => setExpandedMonthly(v => !v)}
          />

          {expandedMonthly && (
            <div className={styles.coupangBox}>
              <div className={styles.coupangHead}>
                {getUserNameFromCookie()}님을 위한 행운의 상품
                <span className={styles.coupangHeadArrow}>›</span>
              </div>
              <div
                className={styles.coupangItem}
                onClick={() => window.open('https://example.com/coupang-product', '_blank')}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.coupangThumb} />
                <div className={styles.coupangMeta}>
                  <span className={styles.coupangBadge}>쿠팡</span>
                  <div className={styles.coupangTitle}>
                    썸잇 점프 개구리 잡기 장난감 보드게임 세트, 그린, 1개
                  </div>
                  <div className={styles.coupangSub}>배송 · 가격 표시 영역</div>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* 다른 운세 보러가기 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>다른 운세 보러가기</h2>
          <div className={styles.moreCenter}>
            <div className={styles.moreList}>
              <div
                className={styles.moreItem}
                onClick={() => router.push(addQueryParams("/result"))}
              >
                <img
                  src="/icon/icon_sun.png"
                  alt="오늘의 운세"
                  className={styles.moreIcon}
                />
                <div>
                  <div className={styles.moreTitle}>오늘의 운세</div>
                  <div className={styles.moreDesc}>
                    오늘 하루, 나를 비추는 행운은?
                  </div>
                </div>
              </div>
              <div
                className={styles.moreItem}
                onClick={() => router.push(addQueryParams("/yearly-result"))}
              >
                <img
                  src="/icon/icon_clover.png"
                  alt="연간 운세"
                  className={styles.moreIcon}
                />
                <div>
                  <div className={styles.moreTitle}>연간 운세</div>
                  <div className={styles.moreDesc}>
                    올 한 해 나의 행운 포인트는?
                  </div>
                </div>
              </div>
              <div
                className={styles.moreItem}
                onClick={() => router.push(addQueryParams("/wealth-result"))}
              >
                <img
                  src="/icon/icon_coin.png"
                  alt="재물운"
                  className={styles.moreIcon}
                />
                <div>
                  <div className={styles.moreTitle}>재물운</div>
                  <div className={styles.moreDesc}>
                    나를 기다리는 재물의 기운은 어디에?
                  </div>
                </div>
              </div>
              <div
                className={styles.moreItem}
                onClick={() => router.push(addQueryParams("/love-result"))}
              >
                <img
                  src="/icon/icon_heart.png"
                  alt="애정운"
                  className={styles.moreIcon}
                />
                <div>
                  <div className={styles.moreTitle}>애정운</div>
                  <div className={styles.moreDesc}>
                    나의 인연은 어디에 있을까?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* CTA */}
        <section className={styles.card}>
          <div className={styles.ctaCenter}>
            <button className={styles.ctaBtn} onClick={handleChangeBirthInfo}>
              <img
                src="/changeButton.png"
                alt="사주정보 변경하기"
                className={styles.ctaImg}
              />
            </button>
          </div>
        </section>

        <div className={styles.bottomWhite} />
      </main>
    </div>
  );
}