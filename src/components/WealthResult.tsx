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
  const [activePeriod, setActivePeriod] = useState<'shortTerm' | 'longTerm'>('shortTerm');
  const [expandedWealth, setExpandedWealth] = useState(false);
  const [activeType, setActiveType] = useState<'income' | 'investment' | 'savings' | 'spending'>('income');
  const [expandedType, setExpandedType] = useState(false);
  const [activeMonth, setActiveMonth] = useState<'thisMonth' | 'nextMonth' | 'thirdMonth'>('thisMonth');
  const [expandedMonth, setExpandedMonth] = useState(false);

  // 재물운 데이터
  const wealthData = {
    shortTerm: {
      score: 88,
      text: "단기 재물운은 매우 밝은 전망을 보이고 있습니다. 앞으로 3개월 내에 예상치 못한 수입이나 보너스가 생길 가능성이 높으며, 투자나 부업에서도 좋은 성과를 기대할 수 있습니다. 특히 새로운 기회나 제안이 들어올 수 있으니 신중하게 검토해보시기 바랍니다. 다만 갑작스러운 큰 수입이 있더라도 계획적으로 관리하는 것이 중요하며, 충동적인 지출은 피하는 것이 좋겠습니다. 주변 사람들과의 금전적 거래는 신중하게 접근하되, 믿을 만한 사람의 조언은 귀담아들으시기 바랍니다. 현재 진행 중인 투자가 있다면 좋은 수익을 낼 수 있는 시기이니 적절한 타이밍을 잡는 것이 중요합니다. 작은 절약도 큰 도움이 될 것이니 가계부를 작성하며 지출을 체크해보세요."
    },
    longTerm: {
      score: 92,
      text: "장기 재물운은 안정적이면서도 지속적인 성장이 기대되는 매우 좋은 흐름을 보이고 있습니다. 향후 1-2년간 꾸준한 수입 증가와 자산 축적이 가능할 것이며, 특히 부동산이나 장기 투자에서 좋은 성과를 거둘 수 있을 것입니다. 현재의 직업이나 사업에서 안정적인 수익을 바탕으로 새로운 수입원을 개발할 기회도 생길 것입니다. 교육이나 자기계발에 투자한 비용들이 몇 년 후 큰 수익으로 돌아올 가능성이 높으니 장기적인 관점에서 접근하시기 바랍니다. 가족이나 파트너와 함께 재정 계획을 세우고 목표를 공유한다면 더욱 좋은 결과를 얻을 수 있을 것입니다. 은퇴 후를 대비한 연금이나 보험 가입도 검토해볼 만한 시기입니다."
    }
  };

  // 재물 유형 데이터
  const typeData = {
    income: {
      text: "수입운은 현재 상승세를 타고 있어 매우 긍정적인 전망을 보입니다. 본업에서의 급여 인상이나 성과급 지급 가능성이 높으며, 부업이나 투자를 통한 추가 수입도 기대할 수 있습니다. 새로운 일자리나 사업 기회가 찾아올 수 있으니 적극적으로 네트워킹하고 정보를 수집하시기 바랍니다. 프리랜서나 자영업자라면 새로운 클라이언트나 고객을 확보할 좋은 시기입니다. 다만 수입이 늘어날수록 세금이나 각종 공과금도 함께 증가할 수 있으니 미리 대비해두시는 것이 좋겠습니다. 능력에 비해 대우를 제대로 받지 못하고 있다면 이번 기회에 정당한 평가를 요구해볼 만합니다."
    },
    investment: {
      text: "투자운은 신중하되 적극적인 접근이 필요한 시기입니다. 주식이나 펀드 등 기존 투자에서 좋은 수익을 낼 가능성이 높으며, 새로운 투자 기회도 찾아올 것입니다. 다만 높은 수익률에만 현혹되지 말고 안정성과 위험도를 충분히 검토한 후 결정하시기 바랍니다. 부동산 투자를 고려하고 있다면 좋은 물건을 찾을 수 있는 시기이니 시장 동향을 주의 깊게 살펴보세요. 암호화폐나 새로운 투자 상품에 관심이 있다면 소액으로 시작해서 경험을 쌓는 것이 좋겠습니다. 투자 전문가나 신뢰할 만한 사람의 조언을 구하는 것도 도움이 될 것입니다."
    },
    savings: {
      text: "저축운은 계획적인 관리와 꾸준한 실천이 큰 성과로 이어지는 시기입니다. 기존의 저축 습관을 더욱 체계화하고 목표 금액을 설정해서 달성해 나가시기 바랍니다. 정기적금이나 적금 상품을 알아보고 자신에게 맞는 상품을 선택하는 것도 좋겠습니다. 가계부 작성을 통해 불필요한 지출을 줄이고 저축할 수 있는 여력을 늘려보세요. 자동이체를 활용해서 저축을 우선순위에 두는 시스템을 만드는 것이 효과적입니다. 비상금도 별도로 마련해두시고, 단기 목표와 장기 목표를 나누어 저축 계획을 세우시면 더욱 좋은 결과를 얻을 수 있을 것입니다."
    },
    spending: {
      text: "지출운은 현명한 소비와 계획적인 지출이 필요한 시기입니다. 큰 금액의 지출을 고려하고 있다면 충분한 검토와 비교를 통해 결정하시기 바랍니다. 품질 좋은 제품이나 서비스에 투자하는 것은 장기적으로 이익이 되지만, 충동적인 구매는 피하는 것이 좋겠습니다. 교육이나 건강, 자기계발을 위한 지출은 미래에 큰 도움이 될 것이니 적극적으로 고려해보세요. 가족이나 사랑하는 사람을 위한 지출도 좋은 에너지를 가져다줄 것입니다. 정기적인 고정비를 점검하고 불필요한 구독이나 서비스는 정리하는 것도 필요합니다. 할인이나 적립 혜택을 활용하면 더욱 현명한 소비가 가능할 것입니다."
    }
  };

  // 월별 재물운 데이터
  const monthData = {
    thisMonth: {
      text: "이번 달 재물운은 새로운 기회와 안정적인 흐름이 함께하는 좋은 시기입니다. 월 초부터 수입과 관련된 좋은 소식이나 기회가 찾아올 수 있으며, 기존 투자에서도 만족스러운 수익을 얻을 수 있을 것입니다. 중순경에는 예상치 못한 부수입이나 환급금 등이 생길 수 있으니 관련 서류나 절차를 미리 점검해보세요. 하순으로 갈수록 지출 관리에 더욱 신경 써야 하며, 큰 금액의 구매나 투자는 신중하게 결정하는 것이 좋겠습니다. 가족이나 친구와의 금전 거래는 명확한 약속을 정하고 진행하시기 바랍니다."
    },
    nextMonth: {
      text: "다음 달은 재물운이 더욱 상승세를 타며 큰 기대를 걸어볼 만한 시기입니다. 새로운 수입원이 생기거나 기존 수입이 증가할 가능성이 높으며, 투자나 사업에서도 좋은 성과를 거둘 수 있을 것입니다. 부동산이나 장기 투자를 고려하고 있다면 좋은 기회를 잡을 수 있는 달이니 시장 동향을 주의 깊게 살펴보세요. 다만 수입이 늘어나는 만큼 세금이나 각종 비용도 함께 고려해야 하니 전체적인 수지를 계산해보시기 바랍니다. 저축 목표를 상향 조정하고 더 적극적인 재정 계획을 세워보는 것도 좋겠습니다."
    },
    thirdMonth: {
      text: "3개월 후는 그동안의 재정 관리 노력이 큰 결실을 맺는 시기가 될 것입니다. 꾸준히 추진해온 투자나 사업이 본격적인 수익을 창출하기 시작하며, 저축 목표도 상당 부분 달성할 수 있을 것입니다. 새로운 재정 목표를 설정하고 더 큰 계획을 세우기에 적절한 시기이니 장기적인 관점에서 접근해보세요. 부동산 취득이나 큰 투자를 계획하고 있다면 이 시기에 실행에 옮기는 것을 고려해볼 만합니다. 가족의 재정 안정과 미래를 위한 준비도 함께 고려하시면 더욱 의미 있는 성과를 얻을 수 있을 것입니다."
    }
  };

  const activeWealthData = wealthData[activePeriod];
  const activeTypeData = typeData[activeType];
  const activeMonthData = monthData[activeMonth];

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
        <div className={styles.heroSection}>
          <div className={styles.hero}>
            <p className={styles.heroText}>
              나를 기다리는<br />
              재물의 기운은 어디에?
            </p>
            <div className={styles.heroIcon}>
              <img
                src="/icon/icon_coin.png"
                alt="coin icon"
                width={120}
                height={120}
                className={styles.heroIconImg}
              />
            </div>
          </div>
        </div>

        {/* 재물운 전망 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>재물운 전망</h2>

          {/* 단기/장기 탭 */}
          <div className={`${styles.tabRow} ${styles.tabRow2}`}>
            <button
              className={`${styles.tab} ${activePeriod === 'shortTerm' ? styles.tabActive : ''}`}
              onClick={() => setActivePeriod('shortTerm')}
            >
              단기 전망
            </button>
            <button
              className={`${styles.tab} ${activePeriod === 'longTerm' ? styles.tabActive : ''}`}
              onClick={() => setActivePeriod('longTerm')}
            >
              장기 전망
            </button>
          </div>

          <ExpandableText
            text={activeWealthData.text}
            expanded={expandedWealth}
            onToggle={() => setExpandedWealth(true)}
          />

          {expandedWealth && (
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

        {/* 재물 유형별 운세 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>재물 유형별 운세</h2>

          <div className={`${styles.tabRow} ${styles.tabRow4}`}>
            <button
              className={`${styles.tab} ${activeType === 'income' ? styles.tabActive : ''}`}
              onClick={() => setActiveType('income')}
            >
              수입운
            </button>
            <button
              className={`${styles.tab} ${activeType === 'investment' ? styles.tabActive : ''}`}
              onClick={() => setActiveType('investment')}
            >
              투자운
            </button>
            <button
              className={`${styles.tab} ${activeType === 'savings' ? styles.tabActive : ''}`}
              onClick={() => setActiveType('savings')}
            >
              저축운
            </button>
            <button
              className={`${styles.tab} ${activeType === 'spending' ? styles.tabActive : ''}`}
              onClick={() => setActiveType('spending')}
            >
              지출운
            </button>
          </div>

          <ExpandableText
            text={activeTypeData.text}
            expanded={expandedType}
            onToggle={() => setExpandedType(true)}
          />

          {expandedType && (
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

        {/* 월별 재물운 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>월별 재물운</h2>

          <div className={`${styles.tabRow} ${styles.tabRow4}`}>
            <button
              className={`${styles.tab} ${activeMonth === 'thisMonth' ? styles.tabActive : ''}`}
              onClick={() => setActiveMonth('thisMonth')}
            >
              이번 달
            </button>
            <button
              className={`${styles.tab} ${activeMonth === 'nextMonth' ? styles.tabActive : ''}`}
              onClick={() => setActiveMonth('nextMonth')}
            >
              다음 달
            </button>
            <button
              className={`${styles.tab} ${activeMonth === 'thirdMonth' ? styles.tabActive : ''}`}
              onClick={() => setActiveMonth('thirdMonth')}
            >
              3개월 후
            </button>
          </div>

          <ExpandableText
            text={activeMonthData.text}
            expanded={expandedMonth}
            onToggle={() => setExpandedMonth(true)}
          />

          {expandedMonth && (
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
                    오늘 하루 나의 행운은 어디서 올까?
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
                    올 한해 나의 행운은 어디서 올까?
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