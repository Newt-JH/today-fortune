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

export default function YearlyResult() {
  const router = useRouter();
  const [activeHalf, setActiveHalf] = useState<'first' | 'second'>('first');
  const [expandedYearly, setExpandedYearly] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'love' | 'health' | 'job' | 'wish'>('love');
  const [expandedTheme, setExpandedTheme] = useState(false);
  const [activeMonth, setActiveMonth] = useState<'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec'>('jul');
  const [expandedMonth, setExpandedMonth] = useState(false);

  // 사주정보 변경하기 클릭 핸들러 - 쿠키 삭제 후 info로 이동
  const handleChangeBirthInfo = () => {
    document.cookie = 'fortuneInfo=; Path=/; Max-Age=0';
    router.push(addQueryParams('/info'));
  };

  // 연간 운세 데이터
  const yearlyData = {
    firstHalf: {
      score: 75,
      text: "상반기는 새로운 시작과 기반을 다지는 매우 중요한 시기입니다. 1월부터 3월까지는 계획을 세우고 준비하는 시간이며, 특히 새해 목표를 구체적으로 설정하여 실행 계획을 세우는 것이 중요합니다. 4월부터 6월로 갈수록 그 계획들이 서서히 구체화되기 시작하며, 눈에 보이는 성과가 나타나기 시작할 것입니다. 인간관계에서는 새로운 만남이나 기회가 많이 찾아올 것이며, 특히 업무적으로나 개인적으로 도움이 되는 귀인을 만날 가능성이 높습니다. 다만 성급하게 결과를 원하기보다는 차근차근 기초를 쌓아가는 것이 중요하며, 조급함은 오히려 독이 될 수 있습니다. 건강 관리에도 특별히 신경 쓰셔야 하며, 새로운 취미나 관심사를 개발하기에도 매우 좋은 시기입니다. 재정적으로는 안정을 추구하되, 무리한 투자나 큰 지출은 피하는 것이 현명합니다. 가족과의 시간을 늘리고 소통을 강화하면 더욱 좋은 결과를 얻을 수 있을 것이며, 특히 부모님이나 형제자매와의 관계 개선에 힘쓰시기 바랍니다."
    },
    secondHalf: {
      score: 83,
      text: "하반기는 상반기의 모든 노력이 결실을 맺는 매우 중요한 수확의 시기입니다. 7월부터 9월까지는 큰 변화나 기회가 찾아올 수 있으며, 특히 직장이나 사업에서 중요한 전환점을 맞이할 가능성이 높습니다. 10월부터 12월까지는 한 해의 성과를 정리하고 내년을 준비하는 시간으로, 체계적인 계획과 준비가 필요합니다. 특히 하반기에는 재물운이 크게 상승하여 경제적 여유가 생길 가능성이 높으며, 투자나 부업에서도 좋은 성과를 기대할 수 있습니다. 연말로 갈수록 가족이나 친구들과의 관계도 더욱 돈독해질 것이며, 특히 연말 모임이나 파티에서 좋은 인연을 만날 수 있습니다. 올해 세운 목표들을 달성하기 위해 마지막까지 최선을 다하는 것이 중요하며, 포기하지 않는 마음가짐이 성공의 열쇠가 될 것입니다. 직장에서는 승진이나 좋은 기회가 찾아올 수 있으니 적극적이고 능동적인 자세를 유지하시기 바랍니다. 건강면에서도 상반기보다 훨씬 나아질 것이며, 특히 스트레스 관리와 규칙적인 운동이 중요합니다."
    }
  };

  // 테마 운세 데이터
  const themeData = {
    love: {
      text: "애정운은 올해 가장 밝게 빛나는 영역 중 하나입니다. 새로운 인연을 만날 가능성이 높으며, 기존 연인과는 더욱 깊은 사랑을 확인할 수 있는 시기입니다. 솔로라면 봄과 가을에 특별한 만남이 기다리고 있을 것이며, 첫인상에서부터 강한 호감을 주고받을 수 있습니다. 커플이라면 서로에 대한 이해가 깊어지고, 미래에 대한 구체적인 계획을 세우게 될 것입니다. 결혼을 앞둔 커플에게는 매우 길한 해가 될 것이며, 가족들의 축복과 지지를 받을 수 있습니다. 다만 너무 성급하게 관계를 발전시키려 하지 말고, 자연스러운 흐름에 맡기는 것이 중요합니다. 상대방의 마음을 헤아리고 배려하는 자세를 잃지 않는다면, 평생 함께할 수 있는 진정한 사랑을 만날 수 있을 것입니다."
    },
    health: {
      text: "건강운은 전반적으로 안정적이지만 꾸준한 관리가 필요한 해입니다. 특히 면역력 강화에 힘써야 하며, 규칙적인 운동과 균형 잡힌 식단을 유지하는 것이 매우 중요합니다. 봄철에는 알레르기나 호흡기 질환에 주의해야 하며, 여름철에는 무리한 다이어트나 과도한 운동을 피하는 것이 좋습니다. 가을에는 환절기 건강 관리에 특히 신경 써야 하며, 겨울철에는 관절 건강과 혈액 순환에 각별한 주의가 필요합니다. 스트레스 관리도 매우 중요한 요소이므로, 충분한 휴식과 취미 활동을 통해 마음의 안정을 찾으시기 바랍니다. 정기 건강검진을 받는 것도 잊지 마시고, 작은 증상이라도 무시하지 말고 전문의의 진료를 받는 것이 현명합니다. 전체적으로는 건강한 한 해가 될 것이니 과도한 걱정은 하지 마세요."
    },
    job: {
      text: "직장운은 학습과 성장에 매우 유리한 해입니다. 새로운 지식을 습득하고 기존의 능력을 발전시키기에 최적의 시기이며, 특히 창의적인 사고와 통찰력이 크게 향상될 것입니다. 독서나 강의 수강, 새로운 기술 습득에 투자하는 시간과 노력이 미래에 큰 자산이 될 것입니다. 직장에서는 전문성을 인정받을 기회가 많아지며, 동료들로부터 조언을 구하는 일이 늘어날 것입니다. 학생이라면 성적 향상은 물론, 진로에 대한 명확한 방향을 찾을 수 있는 해가 될 것입니다. 다양한 분야의 사람들과 교류하며 견문을 넓히는 것도 매우 도움이 될 것이며, 해외 여행이나 문화 체험을 통해 새로운 관점을 얻을 수 있습니다. 지혜는 하루아침에 쌓이는 것이 아니니, 꾸준히 노력하고 인내심을 갖고 임한다면 놀라운 성장을 경험할 수 있을 것입니다."
    },
    wish: {
      text: "소망운은 오랫동안 간직해온 꿈과 희망이 현실로 이루어질 가능성이 높은 해입니다. 특히 상반기에 세운 목표들이 하반기에 구체적인 성과로 나타날 것이며, 예상보다 빠른 속도로 원하는 바를 달성할 수 있습니다. 직업적인 목표나 개인적인 성취 모두에서 긍정적인 결과를 기대할 수 있으며, 주변 사람들의 도움과 지지도 크게 받을 것입니다. 다만 너무 큰 욕심을 부리거나 비현실적인 목표를 세우는 것은 피해야 하며, 현실적이고 달성 가능한 범위에서 계획을 세우는 것이 중요합니다. 작은 성취들이 모여 큰 결실을 이루게 될 것이니, 매 순간의 노력을 소홀히 하지 마시기 바랍니다. 가족이나 친구들과 꿈을 공유하고 함께 응원받는다면 더욱 큰 동기부여가 될 것이며, 혼자서는 이루기 어려운 일도 주변의 도움으로 가능해질 것입니다."
    }
  };

  // 월별 운세 데이터
  const monthData = {
    jul: {
      text: "7월은 한여름의 뜨거운 열정과 함께 새로운 도전의 에너지가 가득한 달입니다. 상반기의 모든 노력이 결실을 맺기 시작하는 시기이며, 특히 직장에서 큰 성과를 거둘 가능성이 높습니다. 휴가철을 맞아 가족이나 친구들과 함께하는 시간이 늘어나며, 이를 통해 소중한 추억을 만들고 관계를 더욱 돈독히 할 수 있습니다. 사랑하는 사람과는 로맨틱한 시간을 보낼 기회가 많아지며, 새로운 인연을 만날 가능성도 높습니다. 건강 면에서는 무더위에 주의해야 하지만, 충분한 휴식과 수분 섭취를 통해 활력을 유지할 수 있습니다. 재정적으로는 여행이나 여가 활동으로 지출이 늘어날 수 있지만, 그만큼 얻는 것도 많은 시기입니다. 새로운 취미나 관심사를 개발하기에도 좋은 시기이니 적극적으로 도전해보시기 바랍니다."
    },
    aug: {
      text: "8월은 뜨거운 여름의 절정과 함께 열정적인 에너지가 최고조에 달하는 달입니다. 휴가와 재충전의 시간을 통해 새로운 아이디어와 영감을 얻을 수 있으며, 이는 하반기 계획에 큰 도움이 될 것입니다. 가족과의 시간이 특히 소중한 시기이며, 가족 여행이나 모임을 통해 유대감을 더욱 깊게 만들 수 있습니다. 직장에서는 휴가철이지만 중요한 기회나 제안이 들어올 수 있으니 놓치지 마세요. 사랑에서는 열정적이고 로맨틱한 순간들이 기다리고 있으며, 특별한 데이트나 이벤트를 계획해보는 것이 좋겠습니다. 건강 관리에는 특히 신경 써야 하며, 무더위와 과로에 주의하면서도 적절한 운동을 유지하는 것이 중요합니다. 재정적으로는 여름 휴가비나 레저 비용이 늘어날 수 있지만, 계획적으로 관리한다면 문제없이 즐거운 시간을 보낼 수 있을 것입니다."
    },
    sep: {
      text: "9월은 가을의 시작과 함께 새로운 전환점을 맞이하는 달입니다. 여름 동안의 휴식과 재충전을 바탕으로 하반기 계획을 본격적으로 실행에 옮기는 시기이며, 특히 업무나 학업에서 집중력이 크게 향상될 것입니다. 날씨가 선선해지면서 활동하기 좋은 계절이 되어, 새로운 운동이나 취미를 시작하기에도 적절합니다. 인간관계에서는 새로운 만남과 기존 관계의 발전이 동시에 이루어질 것이며, 특히 직장에서의 네트워킹이 중요한 역할을 할 것입니다. 건강 면에서는 환절기 감기에 주의해야 하지만, 전반적으로는 몸과 마음이 가벼워지는 시기입니다. 재정적으로는 하반기 계획에 맞춰 투자나 저축 계획을 재점검하기 좋은 시기이며, 새로운 수입원을 모색해볼 수도 있습니다. 학습과 자기계발에 투자하는 시간이 미래에 큰 자산이 될 것입니다."
    },
    oct: {
      text: "10월은 한 해의 노력이 결실을 맺는 수확의 달입니다. 지금까지의 성과를 정리하고 평가해보는 시기이며, 예상보다 좋은 결과를 얻을 가능성이 높습니다. 직장에서는 성과가 인정받아 승진이나 보상의 기회가 찾아올 수 있으며, 새로운 책임과 역할을 맡게 될 수도 있습니다. 인간관계에서는 진실한 우정과 사랑을 확인하는 시간이 될 것이며, 특히 가족과의 유대감이 더욱 깊어질 것입니다. 건강 면에서는 환절기 관리에 주의하되, 전반적으로 안정적인 상태를 유지할 수 있습니다. 재정적으로는 그동안의 저축이나 투자가 좋은 성과를 보일 것이며, 연말을 대비한 계획을 세우기 좋은 시기입니다. 자신에 대한 보상의 시간을 갖고, 그동안의 노고를 인정하며 새로운 목표를 설정해보시기 바랍니다."
    },
    nov: {
      text: "11월은 깊어가는 가을과 함께 내면의 성찰과 준비의 시간입니다. 한 해를 마무리하며 내년을 준비하는 중요한 전환기이며, 차분하고 신중한 접근이 필요한 시기입니다. 직장에서는 연말 프로젝트나 업무 마무리에 집중해야 하며, 동료들과의 협력이 특히 중요할 것입니다. 인간관계에서는 깊이 있는 대화와 진솔한 소통을 통해 더욱 돈독한 관계를 형성할 수 있습니다. 가족과의 시간을 늘리고 따뜻한 마음을 나누는 것이 중요하며, 연말 계획을 함께 세워보는 것도 좋겠습니다. 건강 면에서는 면역력 관리에 특히 신경 써야 하며, 충분한 수면과 영양 섭취를 통해 체력을 관리해야 합니다. 재정적으로는 연말 지출을 대비한 계획적인 관리가 필요하며, 내년을 위한 투자 계획도 세워보시기 바랍니다."
    },
    dec: {
      text: "12월은 한 해의 마무리와 함께 감사와 성찰의 시간입니다. 지난 한 해 동안의 성취와 경험을 돌아보며, 내년에 대한 새로운 비전을 그려보는 중요한 시기입니다. 직장에서는 연말 평가와 함께 내년 계획을 수립하는 시간이 될 것이며, 그동안의 노력이 좋은 평가로 이어질 가능성이 높습니다. 가족과 친구들과 함께하는 시간이 많아지며, 특히 연말 모임과 파티를 통해 소중한 추억을 만들 수 있을 것입니다. 사랑하는 사람과는 한 해를 마무리하며 더욱 깊은 애정을 확인하는 시간이 될 것이며, 내년에 대한 함께하는 꿈을 이야기해볼 수 있습니다. 건강 면에서는 연말 과로와 스트레스에 주의해야 하며, 충분한 휴식을 통해 몸과 마음을 재충전해야 합니다. 재정적으로는 한 해 동안의 수입과 지출을 정리하고, 내년을 위한 재정 계획을 세우는 것이 중요합니다."
    }
  };

  const activeData = activeHalf === 'first' ? yearlyData.firstHalf : yearlyData.secondHalf;

  const activeThemeData = themeData[activeTheme];
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
        <div className={styles.heroSection} style={{ paddingBottom: '40px' }}>
          <div className={styles.hero} style={{ gap: '0px', marginTop: '-40px' }}>
            <p className={styles.heroText} style={{ marginBottom: '-5px' }}>
              올 한 해<br />
              나의 행운 포인트는?
            </p>
            <div className={styles.heroIcon}>
              <img
                src="/icon/icon_clover.png"
                alt="clover icon"
                width={120}
                height={120}
              />
            </div>
          </div>
        </div>

        {/* 올해 운세 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>올해 운세</h2>

          {/* 상반기/하반기 탭 */}
          <div className={`${styles.tabRow} ${styles.tabRow2}`}>
            <button
              className={`${styles.tab} ${activeHalf === 'first' ? styles.tabActive : ''}`}
              onClick={() => {
                setActiveHalf('first');
              }}
            >
              상반기 운세
            </button>
            <button
              className={`${styles.tab} ${activeHalf === 'second' ? styles.tabActive : ''}`}
              onClick={() => {
                setActiveHalf('second');
              }}
            >
              하반기 운세
            </button>
          </div>

          {/* 3줄 미리보기 + 펼쳐보기 */}
          <ExpandableText
            text={activeData.text}
            expanded={expandedYearly}
            onToggle={() => setExpandedYearly(true)}
          />

          {/* 쿠팡 배너: 펼친 상태에서만 */}
          {expandedYearly && (
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

        {/* 테마 운세 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>테마 운세</h2>

          {/* 테마 운세 탭 */}
          <div className={`${styles.tabRow} ${styles.tabRow4}`}>
            <button
              className={`${styles.tab} ${activeTheme === 'love' ? styles.tabActive : ''}`}
              onClick={() => setActiveTheme('love')}
            >
              애정운
            </button>
            <button
              className={`${styles.tab} ${activeTheme === 'health' ? styles.tabActive : ''}`}
              onClick={() => setActiveTheme('health')}
            >
              건강운
            </button>
            <button
              className={`${styles.tab} ${activeTheme === 'job' ? styles.tabActive : ''}`}
              onClick={() => setActiveTheme('job')}
            >
              직장운
            </button>
            <button
              className={`${styles.tab} ${activeTheme === 'wish' ? styles.tabActive : ''}`}
              onClick={() => setActiveTheme('wish')}
            >
              소망운
            </button>
          </div>

          <ExpandableText
            text={activeThemeData.text}
            expanded={expandedTheme}
            onToggle={() => setExpandedTheme((v) => !v)}
          />

          {/* 쿠팡 배너: 펼친 상태에서만 */}
          {expandedTheme && (
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

        {/* 월별 운세 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>월별 운세</h2>

          {/* 월별 운세 탭 */}
          <div className={`${styles.tabRow} ${styles.tabRow6}`}>
            <button
              className={`${styles.tab} ${activeMonth === 'jul' ? styles.tabActive : ''}`}
              onClick={() => setActiveMonth('jul')}
            >
              7월
            </button>
            <button
              className={`${styles.tab} ${activeMonth === 'aug' ? styles.tabActive : ''}`}
              onClick={() => setActiveMonth('aug')}
            >
              8월
            </button>
            <button
              className={`${styles.tab} ${activeMonth === 'sep' ? styles.tabActive : ''}`}
              onClick={() => setActiveMonth('sep')}
            >
              9월
            </button>
            <button
              className={`${styles.tab} ${activeMonth === 'oct' ? styles.tabActive : ''}`}
              onClick={() => setActiveMonth('oct')}
            >
              10월
            </button>
            <button
              className={`${styles.tab} ${activeMonth === 'nov' ? styles.tabActive : ''}`}
              onClick={() => setActiveMonth('nov')}
            >
              11월
            </button>
            <button
              className={`${styles.tab} ${activeMonth === 'dec' ? styles.tabActive : ''}`}
              onClick={() => setActiveMonth('dec')}
            >
              12월
            </button>
          </div>

          <ExpandableText
            text={activeMonthData.text}
            expanded={expandedMonth}
            onToggle={() => setExpandedMonth((v) => !v)}
          />

          {/* 쿠팡 배너: 펼친 상태에서만 */}
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
                onClick={() => router.push(addQueryParams("/monthly-result"))}
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

        {/* CTA (이미지 버튼) */}
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