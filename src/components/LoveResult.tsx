'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import styles from "../css/Result.module.css";

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

export default function LoveResult() {
  const router = useRouter();
  const [expandedBornLove, setExpandedBornLove] = useState(false);
  const [expandedYearlyLove, setExpandedYearlyLove] = useState(false);
  const [expandedTodayLove, setExpandedTodayLove] = useState(false);
  const [expandedYearlyChart, setExpandedYearlyChart] = useState(false);

  // 타고난 애정운 데이터
  const bornLoveData = {
    score: 70,
    text: "타고난 (★☆★) 남성의 애정운을 예상하면, 매력과 관계 맺기에 강한 기운을 가지고 있습니다. 자신이 좋아하는 사람에게는 적극적으로 다가가고 자신의 호의를 잘 전달합니다. 이들은 사랑에 빠지면 깊이 몰입하며 상대방에게 헌신적인 모습을 보입니다. 또한, 이들은 대화를 즐기고 상대방의 말을 잘 들어주어, 관계에서 긍정적인 분위기를 만듭니다."
  };

  // 올해의 애정운 데이터
  const yearlyLoveData = {
    score: 70,
    text: "부일일 (★☆★) 남성의 애정운을 예상하면, 매력과 관계 맺기에 강한 기운을 가지고 있습니다. 자신이 좋아하는 사람에게는 적극적으로 다가가고 자신의 호의를 잘 전달합니다. 이들은 사랑에 빠지면 깊이 몰입하며 상대방에게 헌신적인 모습을 보입니다. 또한, 이들은 대화를 즐기고 상대방의 말을 잘 들어주어, 관계에서 긍정적인 분위기를 만듭니다."
  };

  // 오늘의 애정운 데이터
  const todayLoveData = {
    score: 82,
    text: "한밤 예정운을 오늘에 발고나봐 단순한 말 잘 듣기는 더욱 심화되며 기능에선 일부러 막습니다. 상대방이 기쁨과 슬픔을 공유할 수 있는 이해심도 높고, 배려 있는 태도를 보이기 때문에 관계가 오래 지속되는 경향이 강합니다. 사랑하는 사람과 갈등이 있을 때도 감정적으로 치우치기보다는 조리 있게 해결하려는 자세가 돋보입니다."
  };

  // 연도별 호감/연애 확률 데이터
  const yearlyChartData = [
    { year: 2002, age: 19, percent: 34 },
    { year: 2003, age: 20, percent: 49 },
    { year: 2007, age: 24, percent: 39 },
    { year: 2008, age: 25, percent: 39 },
    { year: 2012, age: 29, percent: 44 },
    { year: 2013, age: 30, percent: 49 },
    { year: 2019, age: 36, percent: 39 },
    { year: 2020, age: 37, percent: 46 },
    { year: 2022, age: 39, percent: 34 },
    { year: 2023, age: 40, percent: 49 }
  ];

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
              나의 인연은<br />
              어디에 있을까?
            </p>
            <div className={styles.heroIcon}>
              <img
                src="/icon/icon_heart.png"
                alt="heart icon"
                width={120}
                height={120}
              />
            </div>
          </div>
        </div>

        {/* 타고난 애정운 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>타고난 애정운</h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#8D55E8' }}>{bornLoveData.score}점</div>
          </div>

          <ExpandableText
            text={bornLoveData.text}
            expanded={expandedBornLove}
            onToggle={() => setExpandedBornLove(true)}
          />

          {expandedBornLove && (
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
                  <div className={styles.coupangTitle}>
                    석양 정포 개구리 잡기 장난감 보드게임 세트, 그린, 1개
                  </div>
                  <div className={styles.coupangSub}>배송 · 가격 표시 영역</div>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* 올해의 애정운 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>올해의 애정운</h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#8D55E8' }}>{yearlyLoveData.score}점</div>
          </div>

          <ExpandableText
            text={yearlyLoveData.text}
            expanded={expandedYearlyLove}
            onToggle={() => setExpandedYearlyLove(true)}
          />

          {expandedYearlyLove && (
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
                  <div className={styles.coupangTitle}>
                    석양 정포 개구리 잡기 장난감 보드게임 세트, 그린, 1개
                  </div>
                  <div className={styles.coupangSub}>배송 · 가격 표시 영역</div>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* 오늘의 애정운 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>오늘의 애정운</h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#8D55E8' }}>{todayLoveData.score}점</div>
          </div>

          <ExpandableText
            text={todayLoveData.text}
            expanded={expandedTodayLove}
            onToggle={() => setExpandedTodayLove(true)}
          />

          {expandedTodayLove && (
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
                  <div className={styles.coupangTitle}>
                    석양 정포 개구리 잡기 장난감 보드게임 세트, 그린, 1개
                  </div>
                  <div className={styles.coupangSub}>배송 · 가격 표시 영역</div>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* 연도별 호감/연애 확률 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>연도별 혼인/연애 확률</h2>

          <div style={{ marginTop: '20px', marginBottom: '10px', position: 'relative', overflow: 'hidden', maxHeight: !expandedYearlyChart ? '165px' : 'none' }}>
            <div style={{ fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '12px', color: '#707070', fontWeight: '400', paddingLeft: '8px' }}>
                <span style={{ width: '120px', textAlign: 'center' }}>년도(나이)</span>
                <span style={{ flex: '1', textAlign: 'center' }}>혼인/연애 확률</span>
              </div>

              {/* 펼쳐보기 전에는 처음 2개만 명확하게 표시 */}
              <div style={{ position: 'relative' }}>
                {yearlyChartData.slice(0, 2).map((item, index) => (
                  <div key={index} style={{ marginBottom: '18px', paddingLeft: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        width: '120px',
                        color: '#404040',
                        fontSize: '12px',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}>
                        {item.year}년({item.age}세)
                      </span>
                      <div style={{
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: `${item.percent}%`,
                          maxWidth: '100%',
                          height: '10px',
                          background: '#8D55E840',
                          borderRadius: '5px'
                        }} />
                        <span style={{
                          color: '#404040',
                          fontWeight: '500',
                          fontSize: '12px',
                          minWidth: '45px',
                          textAlign: 'left'
                        }}>
                          {item.percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 펼쳐보기 전에만 보이는 항목 - 3번째만 명확하게 */}
                {!expandedYearlyChart && yearlyChartData.slice(2, 3).map((item, index) => (
                  <div key={`third-${index}`} style={{ marginBottom: '18px', paddingLeft: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        width: '120px',
                        color: '#404040',
                        fontSize: '12px',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}>
                        {item.year}년({item.age}세)
                      </span>
                      <div style={{
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: `${item.percent}%`,
                          maxWidth: '100%',
                          height: '10px',
                          background: '#8D55E840',
                          borderRadius: '5px'
                        }} />
                        <span style={{
                          color: '#404040',
                          fontWeight: '500',
                          fontSize: '12px',
                          minWidth: '45px',
                          textAlign: 'left'
                        }}>
                          {item.percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 펼쳐진 후 3번째 이후 항목들 */}
                {expandedYearlyChart && yearlyChartData.slice(2).map((item, index) => (
                  <div key={`expanded-${index}`} style={{ marginBottom: '18px', paddingLeft: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        width: '120px',
                        color: '#404040',
                        fontSize: '12px',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}>
                        {item.year}년({item.age}세)
                      </span>
                      <div style={{
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: `${item.percent}%`,
                          maxWidth: '100%',
                          height: '10px',
                          background: '#8D55E840',
                          borderRadius: '5px'
                        }} />
                        <span style={{
                          color: '#404040',
                          fontWeight: '500',
                          fontSize: '12px',
                          minWidth: '45px',
                          textAlign: 'left'
                        }}>
                          {item.percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 펼쳐보기 전 화이트 오버레이 (3번째 줄 아래부터 가리기) */}
            {!expandedYearlyChart && (
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '70px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,1) 80%)',
                pointerEvents: 'none'
              }} />
            )}
          </div>

          {/* 펼쳐보기 버튼 */}
          <div className={styles.expandWrap} style={{ marginTop: '0px' }}>
            {!expandedYearlyChart && (
              <button className={styles.outlineBtn} onClick={() => setExpandedYearlyChart(true)}>
                펼쳐보기
              </button>
            )}
          </div>

          {/* 펼쳐진 상태에서만 구분선 표시 */}
          {expandedYearlyChart && (
            <>
              <div className={styles.divider} />
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
                    <div className={styles.coupangTitle}>
                      석양 정포 개구리 잡기 장난감 보드게임 세트, 그린, 1개
                    </div>
                    <div className={styles.coupangSub}>배송 · 가격 표시 영역</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SectionCard>

        {/* 다른 운세 보러가기 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>다른 운세 보러가기</h2>
          <div className={styles.moreCenter}>
            <div className={styles.moreList}>
              <div
                className={styles.moreItem}
                onClick={() => router.push("/result")}
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
                onClick={() => router.push("/monthly-result")}
              >
                <img
                  src="/icon/icon_calendar.png"
                  alt="월간 운세"
                  className={styles.moreIcon}
                />
                <div>
                  <div className={styles.moreTitle}>월간 운세</div>
                  <div className={styles.moreDesc}>
                    이번 달 나의 행운은 어디서 올까?
                  </div>
                </div>
              </div>
              <div
                className={styles.moreItem}
                onClick={() => router.push("/yearly-result")}
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
                onClick={() => router.push("/wealth-result")}
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
            </div>
          </div>
        </SectionCard>

        {/* CTA */}
        <section className={styles.card}>
          <div className={styles.ctaCenter}>
            <button className={styles.ctaBtn} onClick={() => router.push('/info')}>
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