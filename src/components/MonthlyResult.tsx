'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import styles from "../css/Result.module.css";
import { addQueryParams } from "@/utils/navigation";

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
  const [expandedTheme, setExpandedTheme] = useState(false);
  const [activeWeek, setActiveWeek] = useState<'week1' | 'week2' | 'week3' | 'week4'>('week1');
  const [expandedWeek, setExpandedWeek] = useState(false);

  // 사주정보 변경하기 클릭 핸들러 - 쿠키 삭제 후 info로 이동
  const handleChangeBirthInfo = () => {
    document.cookie = 'fortuneInfo=; Path=/; Max-Age=0';
    router.push(addQueryParams('/info'));
  };

  // 월간 운세 데이터
  const monthlyData = {
    thisMonth: {
      score: 85,
      text: "이번 달은 새로운 기회와 긍정적인 변화가 찾아오는 매우 좋은 시기입니다. 특히 인간관계에서 새로운 만남이나 기존 관계의 발전이 기대되며, 직장에서도 좋은 성과를 거둘 수 있는 달입니다. 상순에는 계획을 세우고 기반을 다지는 시간이 될 것이며, 중순부터는 본격적인 행동을 통해 눈에 보이는 성과를 얻을 수 있습니다. 하순으로 갈수록 그동안의 노력이 결실을 맺기 시작하며, 예상보다 좋은 결과를 얻을 가능성이 높습니다. 건강 면에서도 안정적인 상태를 유지할 수 있으며, 새로운 취미나 관심사를 개발하기에도 좋은 시기입니다. 재정적으로는 계획적인 투자나 저축을 통해 안정적인 기반을 마련할 수 있으며, 부업이나 새로운 수입원을 모색해보는 것도 좋겠습니다. 가족과의 관계도 더욱 돈독해질 것이며, 특히 부모님께 안부를 자주 여쭙고 감사의 마음을 표현하시면 더욱 좋은 운이 따를 것입니다."
    },
    nextMonth: {
      score: 78,
      text: "다음 달은 현재의 성과를 정리하고 새로운 도전을 준비하는 시기가 될 것입니다. 이번 달에 이룬 성취들을 바탕으로 더 큰 목표를 설정하고 실행 계획을 세우기에 적절한 때입니다. 초반에는 약간의 변화나 조정이 필요할 수 있지만, 이는 더 나은 결과를 위한 과정이니 걱정하지 마세요. 중반부터는 안정적인 흐름을 타게 되며, 새로운 기회나 제안이 들어올 가능성이 높습니다. 인간관계에서는 진실한 친구나 동료와의 유대감이 더욱 깊어질 것이며, 서로에게 도움이 되는 관계를 형성할 수 있습니다. 직장에서는 새로운 프로젝트나 업무에 참여할 기회가 생길 수 있으니 적극적인 자세를 보이시기 바랍니다. 건강 관리에는 평소보다 조금 더 신경 써야 하며, 규칙적인 생활 패턴을 유지하는 것이 중요합니다. 재정적으로는 안정적인 흐름을 유지하되, 큰 지출은 신중하게 결정하는 것이 좋겠습니다."
    }
  };

  // 테마 운세 데이터
  const themeData = {
    love: {
      text: "이달의 애정운은 특별히 밝고 따뜻한 에너지로 가득합니다. 솔로라면 예상치 못한 곳에서 특별한 인연을 만날 수 있으며, 첫 만남부터 서로에게 강한 호감을 느낄 가능성이 높습니다. 커플이라면 서로에 대한 이해와 사랑이 더욱 깊어지는 시간이 될 것이며, 미래에 대한 구체적인 계획을 함께 세워볼 수 있습니다. 기존의 관계에서 작은 갈등이 있었다면 이번 달에 자연스럽게 해결될 것이니 너무 걱정하지 마세요. 상대방의 마음을 이해하려는 노력과 진실한 소통이 관계를 더욱 발전시키는 열쇠가 될 것입니다. 특히 월 중순경에는 로맨틱한 이벤트나 기념일이 있을 수 있으니 미리 준비해두시면 좋겠습니다."
    },
    health: {
      text: "건강운은 전반적으로 안정적이지만 계절 변화에 따른 관리가 필요한 달입니다. 면역력 강화에 특히 신경 써야 하며, 충분한 수면과 균형 잡힌 영양 섭취가 중요합니다. 스트레스 관리에도 각별히 주의하여 적절한 휴식과 취미 활동을 통해 마음의 안정을 찾으시기 바랍니다. 가벼운 운동이나 산책을 규칙적으로 하시면 체력 증진은 물론 정신 건강에도 큰 도움이 될 것입니다. 만성적인 피로감이나 소화 불량이 있으시다면 생활 패턴을 점검해보고 필요시 전문의의 도움을 받는 것이 좋겠습니다. 전체적으로는 큰 문제없이 건강한 한 달을 보낼 수 있을 것이니 과도한 걱정은 하지 마세요."
    },
    wisdom: {
      text: "지혜운은 학습과 성장에 매우 유리한 달입니다. 새로운 지식을 습득하고 기존 능력을 발전시키기에 최적의 시기이며, 창의적 사고와 문제 해결 능력이 크게 향상될 것입니다. 독서나 온라인 강의, 새로운 기술 습득에 투자하는 시간이 미래에 큰 자산이 될 것입니다. 직장에서는 전문성을 인정받을 기회가 늘어나며, 동료들로부터 조언을 구하는 일이 많아질 수 있습니다. 다양한 분야의 사람들과 교류하며 견문을 넓히는 것도 큰 도움이 될 것이며, 새로운 관점과 아이디어를 얻을 수 있는 기회가 많이 생길 것입니다. 꾸준한 노력과 인내심으로 임한다면 놀라운 성장을 경험할 수 있을 것입니다."
    },
    wish: {
      text: "소원운은 간절히 바라던 꿈과 희망이 현실로 다가오는 달입니다. 특히 이달 초에 세운 목표들이 월말 즈음 구체적인 성과로 나타날 가능성이 높으며, 예상보다 빠른 속도로 원하는 바를 달성할 수 있습니다. 개인적인 성취와 직업적 목표 모두에서 긍정적인 결과를 기대할 수 있으며, 주변 사람들의 도움과 지지도 크게 받을 것입니다. 현실적이고 달성 가능한 범위에서 계획을 세우는 것이 중요하며, 작은 성취들이 모여 큰 결실을 이루게 될 것입니다. 가족이나 친구들과 꿈을 공유하고 함께 응원받는다면 더욱 큰 동기부여가 될 것이며, 혼자서는 이루기 어려운 일도 주변의 도움으로 가능해질 것입니다."
    }
  };

  // 주간 운세 데이터
  const weekData = {
    week1: {
      text: "첫째 주는 새로운 시작과 계획 수립의 시간입니다. 이달의 목표를 구체적으로 세우고 실행 방안을 마련하기에 적절한 시기이며, 특히 인간관계에서 새로운 만남이나 기회가 찾아올 것입니다. 직장에서는 새로운 프로젝트나 업무에 참여할 기회가 생길 수 있으니 적극적인 자세를 보이시기 바랍니다. 건강 면에서는 컨디션 관리에 신경 쓰시고, 충분한 휴식을 취하는 것이 중요합니다. 재정적으로는 이달의 예산을 계획하고 지출을 점검하는 시간을 가져보세요. 가족이나 친구들과의 시간을 늘리면 더욱 좋은 운이 따를 것입니다."
    },
    week2: {
      text: "둘째 주는 첫째 주에 세운 계획들이 본격적으로 실행되는 시기입니다. 업무나 개인적인 프로젝트에서 눈에 보이는 진전이 있을 것이며, 주변 사람들로부터 긍정적인 피드백을 받을 수 있습니다. 사랑하는 사람과의 관계에서도 새로운 발전이 있을 수 있으니 서로에게 진심을 표현하는 것을 망설이지 마세요. 건강 관리에는 평소보다 조금 더 신경 써야 하며, 스트레스 해소를 위한 활동을 찾아보시기 바랍니다. 재정적으로는 작은 수입이나 예상치 못한 혜택이 있을 수 있습니다."
    },
    week3: {
      text: "셋째 주는 이달 중 가장 활발하고 역동적인 에너지를 보이는 시기입니다. 그동안 준비해온 일들이 본격적인 성과를 보이기 시작하며, 특히 대인관계에서 중요한 만남이나 기회가 찾아올 것입니다. 직장에서는 리더십을 발휘할 기회가 생기거나 중요한 결정을 내려야 할 상황이 올 수 있습니다. 건강 면에서는 활력이 넘치는 시기이지만 과로에는 주의하시기 바랍니다. 취미나 여가 활동을 통해 새로운 인연을 만들 수도 있으니 적극적으로 참여해보세요."
    },
    week4: {
      text: "넷째 주는 이달의 성과를 정리하고 다음 달을 준비하는 시간입니다. 그동안의 노력이 구체적인 결과로 나타나며, 예상보다 좋은 성과를 얻을 가능성이 높습니다. 인간관계에서는 진실한 우정이나 사랑을 확인하는 시간이 될 것이며, 가족과의 유대감도 더욱 깊어질 것입니다. 건강 면에서는 안정적인 상태를 유지할 수 있으며, 다음 달을 위한 체력 관리 계획을 세워보시기 바랍니다. 재정적으로는 이달의 수입과 지출을 정리하고 다음 달 계획을 수립하는 것이 좋겠습니다."
    }
  };

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