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

export default function WealthResult() {
  const router = useRouter();
  const [expandedBorn, setExpandedBorn] = useState(false);
  const [expandedCurrent, setExpandedCurrent] = useState(false);
  const [activeManagement, setActiveManagement] = useState<'gain' | 'loss'>('gain');
  const [expandedManagement, setExpandedManagement] = useState(false);
  const [expandedInvest, setExpandedInvest] = useState(false);

  // 타고난 재물운
  const bornWealthData = {
    score: 72,
    text: "타고난 재물운을 기반으로 사주 차원의 기운을 봤을 때 꾸준한 수입이 가능하며, 특히 노력에 비례해서 성과가 따라오는 운을 타고났습니다. 기본적으로 기저에 깔린 사주의 흐름이 재물을 꺼려하지 않는 편이므로 금전적인 기회들이 찾아올 때 막히지 않을 것이니, 그 순간의 행운이 찾아온다 다다를 수 있을 거예요. 젊었을때는 저축력이 떨어질 수 있지만 나이가 들수록 금전에 대한 감각이 발달하는 성향이 있어서 재무관리 능력이 향상될 것입니다. 특히 협력과 파트너십을 통한 재물운이 좋아 함께 일하거나 투자할 때 더 큰 성과를 거둘 수 있습니다. 다만 지나친 욕심은 오히려 독이 될 수 있으니 적절한 선에서 만족하고 감사하는 마음을 갖는 것이 중요합니다."
  };

  // 현재 재물운
  const currentWealthData = {
    text: "이 운에는 첫은 손에 쥔 재물의 기운을 아직까지 못 받고 있다면 약속되어 있는 시간이 막힐 수 있지만 시간이 지나갈수록 처레에 따라 수입이 안정화될 것입니다. 지혜롭게 자신의 시야를 바라보며 어딘가를 청하지마라 대체로 종견에 이러한 방향으로 해야하되 실적적인 사이의 허실에 바라지는 않기를 것을 묻더라도 아니더니 막힌 기를 받힐 좋게 이어지지 않음을 인건 자사의 것을 지을러고 볼러가는 비용은 몫을 다나지 마십시오. 투자를 고려하고 있다면 충분한 조사와 분석을 통해 결정하되, 전문가의 조언을 구하는 것도 좋겠습니다. 부동산이나 주식 등 자산 투자에 대한 기회가 찾아올 수 있으니 신중하게 검토해보시기 바랍니다."
  };

  // 재물 관리
  const managementData = {
    gain: {
      text: "재물을 모으는 방법은 계획적인 관리와 꾸준한 실천이 핵심입니다. 기존의 저축 습관을 더욱 체계화하고 목표 금액을 설정해서 달성해 나가시기 바랍니다. 정기적금이나 적금 상품을 알아보고 자신에게 맞는 상품을 선택하는 것도 좋겠습니다. 가계부 작성을 통해 불필요한 지출을 줄이고 저축할 수 있는 여력을 늘려보세요. 자동이체를 활용해서 저축을 우선순위에 두는 시스템을 만드는 것이 효과적입니다. 비상금도 별도로 마련해두시고, 단기 목표와 장기 목표를 나누어 저축 계획을 세우시면 더욱 좋은 결과를 얻을 수 있을 것입니다. 수입이 생길 때마다 일정 비율을 먼저 저축하는 습관을 들이는 것이 재물을 모으는 가장 확실한 방법입니다."
    },
    loss: {
      text: "재물 손실을 막기 위해서는 신중한 판단과 계획적인 소비가 필요합니다. 큰 금액의 지출을 고려하고 있다면 충분한 검토와 비교를 통해 결정하시기 바랍니다. 충동적인 구매나 감정적인 소비는 가장 큰 재물 손실의 원인이 되므로 반드시 피해야 합니다. 투자나 대출을 할 때는 본인의 재정 상태를 정확히 파악하고 감당할 수 있는 범위 내에서 결정하세요. 사기나 피싱 등 금융 범죄에 주의하고, 너무 좋은 조건의 투자 제안은 의심해보는 것이 좋습니다. 정기적인 고정비를 점검하고 불필요한 구독이나 서비스는 정리하는 것도 중요합니다. 보험이나 비상금을 통해 예상치 못한 손실에 대비하는 것도 재물을 지키는 현명한 방법입니다."
    }
  };

  // 재테크 재물운
  const investData = {
    text: "재테크 재물운은 다양한 방법으로 자산을 불릴 수 있는 좋은 흐름을 보이고 있습니다. 주식이나 펀드 등 금융 투자에서 안정적인 수익을 기대할 수 있으며, 부동산 투자를 고려한다면 좋은 물건을 찾을 수 있는 시기입니다. 다만 높은 수익률만을 쫓지 말고 위험도와 안정성을 함께 고려해서 분산 투자하는 것이 현명합니다. 새로운 투자 상품이나 기회가 찾아올 수 있으니 충분히 공부하고 조사한 후 결정하세요. 장기적인 관점에서 꾸준히 투자하는 것이 단기 수익보다 더 큰 성과를 가져다줄 것입니다. 전문가의 조언을 구하거나 재테크 스터디에 참여하는 것도 도움이 될 것입니다."
  };

  const activeManagementData = managementData[activeManagement];

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
              나를 기다리는<br />
              재물의 기운은 어디에?
            </p>
            <div className={styles.heroIcon}>
              <img
                src="/icon/icon_coin.png"
                alt="coin icon"
                width={120}
                height={120}
              />
            </div>
          </div>
        </div>

        {/* 타고난 재물운 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>타고난 재물운</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#8D55E8' }}>{bornWealthData.score}점</div>
          </div>

          <ExpandableText
            text={bornWealthData.text}
            expanded={expandedBorn}
            onToggle={() => setExpandedBorn(true)}
          />

          {expandedBorn && (
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
                    행운의 황금 두꺼비 장식품
                  </div>
                  <div className={styles.coupangSub}>배송 · 가격 표시 영역</div>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* 현재 재물운 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>현재 재물운</h2>

          <ExpandableText
            text={currentWealthData.text}
            expanded={expandedCurrent}
            onToggle={() => setExpandedCurrent(true)}
          />

          {expandedCurrent && (
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
                    재물 복주머니 세트
                  </div>
                  <div className={styles.coupangSub}>배송 · 가격 표시 영역</div>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* 재물 관리 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>재물 관리</h2>

          {/* 재물 모으기/손실 막기 탭 */}
          <div className={`${styles.tabRow} ${styles.tabRow2}`}>
            <button
              className={`${styles.tab} ${activeManagement === 'gain' ? styles.tabActive : ''}`}
              onClick={() => setActiveManagement('gain')}
            >
              재물 모으는 법
            </button>
            <button
              className={`${styles.tab} ${activeManagement === 'loss' ? styles.tabActive : ''}`}
              onClick={() => setActiveManagement('loss')}
            >
              재물 손실 막는 법
            </button>
          </div>

          <ExpandableText
            text={activeManagementData.text}
            expanded={expandedManagement}
            onToggle={() => setExpandedManagement(true)}
          />

          {expandedManagement && (
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
                    가계부 & 재테크 플래너
                  </div>
                  <div className={styles.coupangSub}>배송 · 가격 표시 영역</div>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* 재테크 재물운 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>재테크 재물운</h2>

          <ExpandableText
            text={investData.text}
            expanded={expandedInvest}
            onToggle={() => setExpandedInvest(true)}
          />

          {expandedInvest && (
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
                    재테크 입문서 & 투자 가이드북
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
                onClick={() => router.push("/love-result")}
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