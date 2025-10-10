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
  const [activeStatus, setActiveStatus] = useState<'single' | 'couple'>('single');
  const [expandedLove, setExpandedLove] = useState(false);
  const [activeType, setActiveType] = useState<'meeting' | 'relationship' | 'marriage' | 'harmony'>('meeting');
  const [expandedType, setExpandedType] = useState(false);
  const [activePeriod, setActivePeriod] = useState<'thisWeek' | 'thisMonth' | 'nextMonth'>('thisWeek');
  const [expandedPeriod, setExpandedPeriod] = useState(false);

  // 애정운 데이터
  const loveData = {
    single: {
      score: 91,
      text: "솔로인 당신에게는 특별한 인연이 기다리고 있는 매우 좋은 시기입니다. 예상치 못한 곳에서 운명적인 만남이 찾아올 수 있으며, 첫 인상부터 서로에게 강한 호감을 느낄 가능성이 높습니다. 친구의 소개나 취미 모임, 직장에서의 새로운 만남 등 다양한 경로를 통해 좋은 사람을 만날 수 있을 것입니다. 너무 조급해하지 말고 자연스러운 흐름에 맡기는 것이 중요하며, 자신만의 매력을 어필할 수 있는 기회도 많이 생길 것입니다. 외모보다는 내면의 아름다움과 진실한 마음이 상대방의 마음을 움직이는 열쇠가 될 것이니 자신감을 가지시기 바랍니다. 새로운 취미나 관심사를 개발하면서 같은 관심사를 가진 사람들과 만날 기회를 늘려보세요. 온라인 모임이나 소셜 활동에도 적극적으로 참여하면 좋은 결과를 얻을 수 있을 것입니다."
    },
    couple: {
      score: 88,
      text: "연인이 있는 당신에게는 관계가 한층 더 깊어지고 발전하는 아름다운 시기가 찾아왔습니다. 서로에 대한 이해와 사랑이 더욱 깊어지며, 미래에 대한 구체적인 계획을 함께 세워볼 수 있는 좋은 때입니다. 작은 갈등이 있었다면 자연스럽게 해결될 것이며, 오히려 이를 통해 더욱 단단한 관계로 발전할 수 있습니다. 상대방의 마음을 이해하려는 노력과 진실한 소통이 관계를 더욱 발전시키는 중요한 요소가 될 것입니다. 특별한 기념일이나 이벤트를 계획해보시면 두 사람의 추억이 더욱 소중해질 것이며, 서로에 대한 애정도 더욱 확인할 수 있을 것입니다. 결혼을 생각하고 있다면 구체적인 계획을 세우기에 매우 좋은 시기이니 진지한 대화를 나누어보시기 바랍니다. 가족들에게 연인을 소개하거나 양가 부모님을 만나는 것도 좋은 결과를 가져올 것입니다."
    }
  };

  // 애정 유형별 데이터
  const typeData = {
    meeting: {
      text: "만남운은 현재 최고조에 달해 있어 새로운 인연을 만날 가능성이 매우 높습니다. 친구들의 모임이나 회사 행사, 취미 활동 등에서 특별한 사람을 만날 수 있으며, 온라인을 통한 만남도 좋은 결과를 가져올 수 있습니다. 첫 만남에서부터 서로에게 호감을 느낄 가능성이 높으니 자신감을 가지고 적극적으로 다가가보세요. 외모보다는 진실한 마음과 따뜻한 성격이 상대방의 마음을 사로잡는 중요한 요소가 될 것입니다. 너무 완벽한 사람을 찾으려 하지 말고, 마음이 편안하고 대화가 잘 통하는 사람에게 관심을 가져보시기 바랍니다. 새로운 환경이나 장소에 자주 나가면서 만남의 기회를 늘려보는 것도 좋은 방법입니다."
    },
    relationship: {
      text: "연애운은 기존 관계를 더욱 발전시키고 새로운 단계로 나아가기에 완벽한 시기입니다. 연인과의 관계에서 서로에 대한 이해가 깊어지며, 진정한 사랑을 확인할 수 있는 순간들이 많이 찾아올 것입니다. 작은 다툼이나 오해가 있었다면 이번 기회에 솔직한 대화를 통해 해결하시기 바랍니다. 서로의 다른 점을 인정하고 받아들이는 것이 관계 발전의 열쇠가 될 것입니다. 함께하는 시간을 늘리고 새로운 경험을 공유하면서 더욱 돈독한 관계를 만들어가세요. 상대방의 가족이나 친구들과도 좋은 관계를 유지하려 노력하면 연애에 큰 도움이 될 것입니다."
    },
    marriage: {
      text: "결혼운은 매우 길한 기운으로 가득하여 평생 함께할 반려자를 만나거나 기존 연인과의 결혼을 진지하게 고려할 수 있는 시기입니다. 솔로라면 결혼을 전제로 한 진지한 만남이 찾아올 수 있으며, 커플이라면 프로포즈나 혼담이 오갈 가능성이 높습니다. 양가 부모님의 축복과 지지를 받을 수 있는 시기이니 가족들과의 만남을 주선해보시기 바랍니다. 결혼 준비를 하고 있다면 모든 일이 순조롭게 진행될 것이며, 주변 사람들의 도움도 많이 받을 수 있을 것입니다. 경제적인 준비와 함께 정신적인 준비도 철저히 하시면 행복한 결혼 생활의 기반을 마련할 수 있습니다. 서로에 대한 신뢰와 존중을 바탕으로 한 관계라면 반드시 좋은 결실을 맺을 것입니다."
    },
    harmony: {
      text: "화합운은 모든 인간관계에서 조화와 평화를 가져다주는 아름다운 시기입니다. 연인과의 관계에서는 서로를 이해하고 배려하는 마음이 더욱 깊어지며, 작은 갈등도 쉽게 해결될 것입니다. 가족들과의 관계도 더욱 원만해지고, 친구들과의 우정도 더욱 돈독해질 것입니다. 주변 사람들로부터 사랑받고 신뢰받는 시기이니 먼저 다가가서 마음을 나누어보세요. 연인이나 배우자와의 관계에서 서로의 의견을 존중하고 타협점을 찾으려 노력하면 더욱 아름다운 관계를 만들 수 있습니다. 혼자 해결하기 어려운 문제가 있다면 가까운 사람들의 조언을 구하는 것도 좋은 방법입니다. 사랑하는 사람들과 함께하는 시간을 늘리고 감사의 마음을 표현하면 더욱 큰 행복을 느낄 수 있을 것입니다."
    }
  };

  // 기간별 애정운 데이터
  const periodData = {
    thisWeek: {
      text: "이번 주 애정운은 특별한 만남과 감동이 가득한 한 주가 될 것입니다. 주 초부터 좋은 소식이나 반가운 만남이 있을 수 있으며, 연인이 있다면 서로에 대한 애정을 확인하는 달콤한 시간을 보낼 수 있습니다. 주 중반에는 새로운 사람과의 만남이나 기존 관계의 발전이 있을 수 있으니 적극적인 자세를 보이시기 바랍니다. 주말에는 특별한 데이트나 이벤트를 계획해보세요. 로맨틱한 분위기 속에서 소중한 추억을 만들 수 있을 것입니다. 진실한 마음으로 상대방을 대하면 예상보다 좋은 반응을 얻을 수 있으니 용기를 내어보시기 바랍니다."
    },
    thisMonth: {
      text: "이번 달은 애정운이 전반적으로 상승세를 타며 행복한 한 달이 될 것입니다. 월 초에는 새로운 만남의 기회가 많아지고, 중순경에는 기존 관계가 더욱 발전할 수 있는 계기가 마련될 것입니다. 하순으로 갈수록 사랑하는 사람과의 유대감이 더욱 깊어지며, 미래에 대한 구체적인 계획도 세워볼 수 있습니다. 가족이나 친구들의 지지와 축복도 받을 수 있는 시기이니 주변 사람들과의 관계도 소홀히 하지 마세요. 연인에게 작은 선물이나 편지를 준비해보시면 큰 감동을 줄 수 있을 것입니다. 솔로라면 소개팅이나 미팅에 적극적으로 참여해보시기 바랍니다."
    },
    nextMonth: {
      text: "다음 달은 애정운이 절정에 달하여 평생 기억에 남을 특별한 순간들이 기다리고 있습니다. 솔로라면 운명적인 만남이 찾아올 수 있으며, 커플이라면 관계가 한 단계 더 발전할 수 있는 중요한 시기가 될 것입니다. 프로포즈나 결혼 이야기가 나올 수 있고, 양가 부모님을 만나는 자리가 마련될 수도 있습니다. 서로에 대한 진실한 마음을 확인하고 미래를 함께 그려볼 수 있는 의미 있는 시간이 될 것입니다. 조급해하지 말고 자연스러운 흐름에 맡기면서 상대방의 마음을 존중하는 자세가 중요합니다. 사랑하는 마음을 표현하는 데 주저하지 마시고, 행복한 순간들을 충분히 만끽하시기 바랍니다."
    }
  };

  const activeLoveData = loveData[activeStatus];
  const activeTypeData = typeData[activeType];
  const activePeriodData = periodData[activePeriod];

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
              나의 인연은<br />
              어디에 있을까?
            </p>
            <div className={styles.heroIcon}>
              <img
                src="/icon/icon_heart.png"
                alt="heart icon"
                width={120}
                height={120}
                className={styles.heroIconImg}
              />
            </div>
          </div>
        </div>

        {/* 애정운 현황 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>애정운 현황</h2>

          {/* 솔로/커플 탭 */}
          <div className={`${styles.tabRow} ${styles.tabRow2}`}>
            <button
              className={`${styles.tab} ${activeStatus === 'single' ? styles.tabActive : ''}`}
              onClick={() => setActiveStatus('single')}
            >
              솔로 운세
            </button>
            <button
              className={`${styles.tab} ${activeStatus === 'couple' ? styles.tabActive : ''}`}
              onClick={() => setActiveStatus('couple')}
            >
              커플 운세
            </button>
          </div>

          <ExpandableText
            text={activeLoveData.text}
            expanded={expandedLove}
            onToggle={() => setExpandedLove(true)}
          />

          {expandedLove && (
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

        {/* 애정 유형별 운세 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>애정 유형별 운세</h2>

          <div className={`${styles.tabRow} ${styles.tabRow4}`}>
            <button
              className={`${styles.tab} ${activeType === 'meeting' ? styles.tabActive : ''}`}
              onClick={() => setActiveType('meeting')}
            >
              만남운
            </button>
            <button
              className={`${styles.tab} ${activeType === 'relationship' ? styles.tabActive : ''}`}
              onClick={() => setActiveType('relationship')}
            >
              연애운
            </button>
            <button
              className={`${styles.tab} ${activeType === 'marriage' ? styles.tabActive : ''}`}
              onClick={() => setActiveType('marriage')}
            >
              결혼운
            </button>
            <button
              className={`${styles.tab} ${activeType === 'harmony' ? styles.tabActive : ''}`}
              onClick={() => setActiveType('harmony')}
            >
              화합운
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

        {/* 기간별 애정운 */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>기간별 애정운</h2>

          <div className={`${styles.tabRow} ${styles.tabRow4}`}>
            <button
              className={`${styles.tab} ${activePeriod === 'thisWeek' ? styles.tabActive : ''}`}
              onClick={() => setActivePeriod('thisWeek')}
            >
              이번 주
            </button>
            <button
              className={`${styles.tab} ${activePeriod === 'thisMonth' ? styles.tabActive : ''}`}
              onClick={() => setActivePeriod('thisMonth')}
            >
              이번 달
            </button>
            <button
              className={`${styles.tab} ${activePeriod === 'nextMonth' ? styles.tabActive : ''}`}
              onClick={() => setActivePeriod('nextMonth')}
            >
              다음 달
            </button>
          </div>

          <ExpandableText
            text={activePeriodData.text}
            expanded={expandedPeriod}
            onToggle={() => setExpandedPeriod(true)}
          />

          {expandedPeriod && (
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