/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../css/Result.module.css";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts";

// ===== 타입 =====
export type CategoryKey =
  | "총운"
  | "재물운"
  | "애정운"
  | "소망운"
  | "직장운"
  | "방위운";
export type ResultData = {
  dateLabel: string;
  score: number;
  tagline: string;
  lucky: {
    numbers: string;
    direction: string;
    gem: string;
    color: string;
    place: string;
    flower: string;
  };
  radar: { name: CategoryKey | "총운"; value: number }[];
  categories: Record<CategoryKey, { score: number; text: string }>;
  weekly: { label: string; value: number }[];
};

// ✅ MOCK 위 어딘가에 추가
const TODAY_DATE_LABEL =
  new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date());

// ===== 목업 데이터 (서버 연동 전) =====
const MOCK: ResultData = {
  dateLabel: TODAY_DATE_LABEL,
  score: 72,
  tagline: "오늘 하루, 나를 비추는 행운을 찾으셨나요?\n오늘 이벤트는 이미 참여했어요.",
  lucky: {
    numbers: "3, 35, 37",
    direction: "서북서",
    gem: "오팔",
    color: "베이비핑크",
    place: "카페",
    flower: "벚꽃",
  },
  radar: [
    { name: "총운", value: 72 },
    { name: "재물운", value: 76 },
    { name: "애정운", value: 70 },
    { name: "소망운", value: 65 },
    { name: "직장운", value: 68 },
    { name: "방위운", value: 72 },
  ],
  categories: {
    총운: {
      score: 72,
      text:
        "고목붕춘이라 봄이 돌아와 고목에 새싹이 트는 격으로 옛 것을 버리고 새롭게 전진하며 승승장구할 길운입니다. " +
        "지금껏 막혀 있던 일이 한 번에 풀리며 기대 이상의 결과를 얻게 될 가능성이 큽니다. " +
        "작은 선택 하나가 향후 큰 변화를 가져올 수 있으니, 매 순간 신중하게 임하는 태도가 중요합니다. " +
        "사소한 실수는 쉽게 회복되니 두려워하지 말고 적극적으로 도전해보세요. " +
        "당장의 성과보다 방향성에 집중하면 장기적인 성취를 이룰 수 있습니다. " +
        "귀인의 도움을 받을 수 있으니 주변의 제안이나 조언을 귀담아들으세요. " +
        "오늘 하루는 긍정적인 기운이 강하게 작용하므로 자신감을 가지고 움직이면 좋습니다.",
    },
    재물운: {
      score: 84,
      text:
        "좋은 기회와 주의가 함께 따르는 시기입니다. " +
        "갑작스러운 지출이 발생할 수 있지만, 계획만 잘 세운다면 충분히 감당할 수 있습니다. " +
        "투자나 재테크에서는 단기보다는 장기적인 안목을 가져야 손해를 줄일 수 있습니다. " +
        "작은 절약이 모여 큰 재산이 되니 소비 습관을 점검하기 좋은 날입니다. " +
        "불필요한 지출을 줄이고 꼭 필요한 곳에만 자원을 쓰면 큰 보상이 따릅니다. " +
        "금전적으로 안정된 흐름이 유지되므로 지나친 걱정보다는 체계적인 관리가 필요합니다. " +
        "적절한 시기에 귀인의 도움이나 뜻밖의 보너스가 생길 가능성도 있습니다. " +
        "재물을 잃을까 두려워하기보다는 현명하게 지켜내는 지혜가 필요합니다.",
    },
    애정운: {
      score: 92,
      text:
        "오늘 가장 밝은 기운을 머금고 있습니다. " +
        "솔직한 대화와 따뜻한 배려가 상대방의 마음을 크게 열게 될 것입니다. " +
        "기존의 연인에게는 서로에 대한 이해가 깊어져 관계가 더욱 단단해집니다. " +
        "솔로라면 새로운 만남의 기회가 열리며, 첫인상에서 좋은 호감을 얻을 수 있습니다. " +
        "작은 선물이나 사소한 말 한마디가 큰 감동을 줄 수 있는 날입니다. " +
        "약속이나 데이트를 계획하기에 최적의 시기이며 즐거운 분위기가 이어집니다. " +
        "주변에서 당신의 매력이 빛나게 보이는 만큼 자신감을 갖고 다가가 보세요. " +
        "오늘은 사랑과 호감이 넘쳐흐르는 하루가 될 것입니다.",
    },
    소망운: {
      score: 68,
      text:
        "차근차근 목표를 다져가는 흐름입니다. " +
        "당장은 큰 진전이 없더라도 꾸준히 나아가면 결국 원하는 바를 이룰 수 있습니다. " +
        "작은 성취가 모여 큰 결실로 이어질 가능성이 큽니다. " +
        "실현 가능성이 낮아 보이는 소망도 오늘은 구체적인 계획을 세우면 현실화될 기운이 있습니다. " +
        "자신이 원하는 방향을 명확히 하고 구체적인 행동으로 옮기는 것이 중요합니다. " +
        "낙관적인 마음을 유지하면 예상치 못한 도움을 받을 수 있습니다. " +
        "조급함을 버리고 매일의 노력을 쌓아가면 좋은 결과가 따를 것입니다.",
    },
    직장운: {
      score: 73,
      text:
        "성실한 노력이 빛을 발하는 시기입니다. " +
        "업무에서 작은 성과가 쌓여 상사나 동료에게 인정받을 수 있습니다. " +
        "회의나 협업에서 당신의 의견이 존중받으며 분위기를 주도할 수 있습니다. " +
        "복잡한 문제도 냉정하고 차분하게 접근하면 해결의 실마리를 찾게 됩니다. " +
        "오늘은 특히 효율적인 시간 관리가 성패를 좌우할 것입니다. " +
        "새로운 프로젝트나 아이디어를 제안하기 좋은 날이기도 합니다. " +
        "신뢰와 책임감을 보여준다면 장기적으로 좋은 평가로 이어질 것입니다. " +
        "스트레스를 너무 쌓아두지 말고 휴식도 균형 있게 취하세요.",
    },
    방위운: {
      score: 70,
      text:
        "이동이나 만남에서 길한 방향을 따르는 것이 중요한 날입니다. " +
        "남서·서북 방위가 특히 좋은 기운을 주며, 이쪽으로 나아가면 좋은 소식을 얻을 수 있습니다. " +
        "외출이나 중요한 약속은 해당 방향으로 잡는 것이 유리합니다. " +
        "새로운 인연이나 협력자가 그곳에서 기다리고 있을 가능성이 큽니다. " +
        "작은 외출이라도 길한 방향을 따른다면 운이 상승합니다. " +
        "집이나 사무실의 방향을 점검하고 정리하면 좋은 에너지가 흐릅니다. " +
        "길운을 따라 움직이면 작은 행운이 크게 불어날 수 있습니다. " +
        "오늘 하루는 방향이 당신의 운세를 결정짓는 중요한 열쇠가 될 것입니다.",
    },
  },
  weekly: [
    { label: "일", value: 85 },
    { label: "월", value: 96 },
    { label: "화", value: 72 },
    { label: "수", value: 75 },
    { label: "목", value: 92 },
    { label: "금", value: 76 },
    { label: "토", value: 80 },
  ],
};

// ===== 공통 소품 =====
function Chip({ children }: { children: React.ReactNode }) {
  return <span className={styles.chip}>{children}</span>;
}
function SectionCard({ children }: { children: React.ReactNode }) {
  return <section className={styles.card}>{children}</section>;
}

// ===== 레이더 =====
function RadarBlock({
  data,
  badge,
  activeCategory,
}: {
  data: ResultData["radar"];
  badge?: number;
  activeCategory?: CategoryKey;
}) {
  // 각 카테고리별 점수 배지 위치 계산 (시계방향 순서에 맞춤)
  const getScoreBadgePosition = (category: CategoryKey) => {
    const positions: Record<CategoryKey, { top: string; left: string }> = {
      "총운": { top: "7%", left: "50%" }, // 위쪽 중앙
      "재물운": { top: "25%", left: "80%" }, // 우상단
      "애정운": { top: "56%", left: "79%" }, // 우하단
      "소망운": { top: "93%", left: "50%" }, // 하단 중앙
      "직장운": { top: "56%", left: "20%" }, // 좌하단
      "방위운": { top: "25%", left: "20%" }, // 좌상단
    };
    return positions[category] || { top: "6px", left: "50%" };
  };

  const badgePosition = activeCategory ? getScoreBadgePosition(activeCategory) : { top: "6px", left: "50%" };

  return (
    <div className={styles.radarWrap}>
      {/* 선택된 카테고리 위치에 점수 배지 표시 */}
      {typeof badge === "number" && (
        <div
          className={styles.scoreBadgeActive}
          style={{
            top: badgePosition.top,
            left: badgePosition.left,
            transform: badgePosition.left === "50%" ? "translateX(-50%)" : "translateX(-50%)"
          }}
        >
          {badge}점
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="55%" // 차트 위치 조정 (62% → 55%)
          outerRadius="85%" // 크기 조정 (95% → 85%)
          data={data}
          margin={{ top: 60, right: 30, bottom: 40, left: 30 }}
        >
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fontSize: 13, fill: "#6B7280" }}
            tickFormatter={(v: string) => v} // 모든 이름 그대로 표시
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            tickCount={5}
          />
          <Radar
            name="오늘"
            dataKey="value"
            stroke="#7C3AED"
            strokeWidth={2}
            fill="#8B5CF6"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ===== 주간 바차트 =====
const WeeklyBar = memo(function WeeklyBar({
  data,
  highlightLabel,
}: {
  data: ResultData["weekly"];
  highlightLabel: string; // 오늘 요일 ("일"~"토")
}) {
  // 라벨 렌더러 메모
  const renderLabel = useCallback(
    (props: any) => {
      const { x, y, width, value, index } = props;
      const cx = x + width / 2;
      const isToday = data[index].label === highlightLabel;
      return (
        <text
          x={cx}
          y={y - 6}
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          fill={isToday ? "#7C3AED" : "#6B7280"}
        >
          {value}
        </text>
      );
    },
    [data, highlightLabel]
  );

  return (
    <div className={styles.weeklyWrap}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 4, left: 4, bottom: 0 }}
          barCategoryGap="22%"
        >
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis hide domain={[0, 100]} />
          <Bar
            dataKey="value"
            radius={[6, 6, 6, 6]}
            isAnimationActive={false} // ← 여기서만 애니메이션 OFF
            animationDuration={0}
          >
            {data.map((e, i) => (
              <Cell
                key={i}
                fill={e.label === highlightLabel ? "#7C3AED" : "#E5E7EB"}
              />
            ))}
            <LabelList dataKey="value" content={renderLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
export { WeeklyBar };

// ===== 3줄 미리보기 + 펼쳐보기 =====
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
  
          {/* ⬇️ 미리보기 상태일 때만 페이드 오버레이 */}
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

// ===== 메인 컴포넌트 =====
export default function Result({ data = MOCK }: { data?: ResultData }) {
  const [active, setActive] = useState<CategoryKey>("총운");
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showNoRewardModal, setShowNoRewardModal] = useState(false);
  const [pendingRewardStatus, setPendingRewardStatus] = useState<'success' | 'already' | null>(null);
  const [showRewardToast, setShowRewardToast] = useState(false);

  const activeText = data.categories[active].text;
  const activeScore = data.categories[active].score;

  // 쿠팡 상품 클릭 핸들러
  const handleCoupangProductClick = () => {
    window.open('https://example.com/coupang-product', '_blank');
  };

  // 쿠키에서 리워드 수령 가능 여부 확인 (오늘 받을 수 있는지)
  const canReceiveReward = (): boolean => {
    if (typeof document === 'undefined') return false;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'dailyReward') {
        return value !== today; // 오늘 날짜가 아니면 받을 수 있음
      }
    }
    return true; // 쿠키가 없으면 받을 수 있음
  };

  // 오늘 리워드 수령 처리
  const markTodayRewardReceived = () => {
    if (typeof document === 'undefined') return;

    const today = new Date().toISOString().split('T')[0];
    // 내일 자정에 만료되도록 설정
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    document.cookie = `dailyReward=${today}; expires=${tomorrow.toUTCString()}; path=/`;
  };

  // 페이지 진입 시 리워드 상태 확인 (모달은 바로 띄우지 않음)
  useEffect(() => {
    // 광고에서 온 경우에만 리워드 로직 실행 (referrer로 판단하거나 쿠키로 판단)
    // 여기서는 단순히 페이지 진입 시마다 체크
    if (canReceiveReward()) {
      setPendingRewardStatus('success'); // 받을 수 있는 경우
      markTodayRewardReceived(); // 받음 처리
    } else {
      setPendingRewardStatus('already'); // 이미 받은 경우
    }
  }, []);

  // 화면 복귀 감지 후 모달 표시
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && pendingRewardStatus) {
        // 화면에 복귀했을 때 대기 중인 토스트/모달 표시
        if (pendingRewardStatus === 'success') {
          setShowRewardToast(true);
          // 3초 후 토스트 숨김
          setTimeout(() => setShowRewardToast(false), 3000);
        } else if (pendingRewardStatus === 'already') {
          setShowNoRewardModal(true);
        }
        setPendingRewardStatus(null); // 한 번만 표시
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 페이지 로드 시 이미 화면이 보이는 상태라면 바로 모달 표시
    if (!document.hidden && pendingRewardStatus) {
      setTimeout(() => handleVisibilityChange(), 100);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pendingRewardStatus]);

  return (
    <div className={styles.screen}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* 둥근 배경 없이 '‹' 만 표시 */}
          <button
            className={styles.backBtn}
            aria-label="뒤로가기"
            onClick={() => history.back()} // 수정 필요: 나중에 함수 변경 가능
          >
            ‹
          </button>
          <div className={styles.headerTitle}>오늘의 운세</div>
          {/* 가운데 정렬 유지용 균형 공간 */}
          <div className={styles.headerSpacer} />
        </div>
      </header>

      <main className={styles.body}>
        {/* 상단 히어로 (풀블리드 흰 배경) */}
        <div className={styles.heroSection}>
          <div className={styles.hero}>
            <Chip>{data.dateLabel} 운세 점수</Chip>
            <div className={styles.heroScore}>{data.score}점</div>
            <div className={styles.heroRow}>
              <div className={styles.heroIcon}>
                <img
                  src="/icon/icon_sun.png"
                  alt="sun icon"
                  className={styles.heroIconImg}
                />
              </div>
              <p className={styles.heroText}>
                오늘 하루, 나를 비추는 행운은?
                <br />
                운세 보고 포인트도 받아요!
              </p>
            </div>
          </div>
        </div>

        {/* 오늘의 행운 (풀블리드 카드) */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>오늘의 행운</h2>

          <div className={styles.luckyGrid}>
            <div className={styles.luckyItem}>
              <img
                src="/icon/icon_number7.png"
                alt="행운의 숫자"
                className={styles.luckyIcon}
              />
              <div className={styles.luckyTexts}>
                <div className={styles.luckyTitle}>행운의 숫자</div>
                <div className={styles.luckyValue}>{data.lucky.numbers}</div>
              </div>
            </div>

            <div className={styles.luckyItem}>
              <img
                src="/icon/icon_compass.png"
                alt="행운의 방향"
                className={styles.luckyIcon}
              />
              <div className={styles.luckyTexts}>
                <div className={styles.luckyTitle}>행운의 방향</div>
                <div className={styles.luckyValue}>{data.lucky.direction}</div>
              </div>
            </div>

            <div className={styles.luckyItem}>
              <img
                src="/icon/icon_diamond.png"
                alt="행운의 보석"
                className={styles.luckyIcon}
              />
              <div className={styles.luckyTexts}>
                <div className={styles.luckyTitle}>행운의 보석</div>
                <div className={styles.luckyValue}>{data.lucky.gem}</div>
              </div>
            </div>

            <div className={styles.luckyItem}>
              <img
                src="/icon/icon_rainbow.png"
                alt="행운의 색깔"
                className={styles.luckyIcon}
              />
              <div className={styles.luckyTexts}>
                <div className={styles.luckyTitle}>행운의 색깔</div>
                <div className={styles.luckyValue}>{data.lucky.color}</div>
              </div>
            </div>

            <div className={styles.luckyItem}>
              <img
                src="/icon/icon_location.png"
                alt="행운의 장소"
                className={styles.luckyIcon}
              />
              <div className={styles.luckyTexts}>
                <div className={styles.luckyTitle}>행운의 장소</div>
                <div className={styles.luckyValue}>{data.lucky.place}</div>
              </div>
            </div>

            <div className={styles.luckyItem}>
              <img
                src="/icon/icon_flower.png"
                alt="행운의 꽃"
                className={styles.luckyIcon}
              />
              <div className={styles.luckyTexts}>
                <div className={styles.luckyTitle}>행운의 꽃</div>
                <div className={styles.luckyValue}>{data.lucky.flower}</div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 오늘의 운세 상세 (풀블리드 카드) */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>오늘의 운세 상세</h2>

          {/* 레이더 + 점수배지 */}
          <RadarBlock data={data.radar} badge={activeScore} activeCategory={active} />

          {/* 탭 */}
          {/* 탭 */}
          <div className={styles.tabRow}>
            {(
              [
                "총운",
                "재물운",
                "애정운",
                "소망운",
                "직장운",
                "방위운",
              ] as CategoryKey[]
            ).map((k) => {
              // 보여지는 라벨: 총운은 그대로, 나머지는 "운" 제거
              const label = k === "총운" ? "총운" : k.replace("운", "");
              return (
                <button
                  key={k}
                  className={`${styles.tab} ${
                    active === k ? styles.tabActive : ""
                  }`}
                  onClick={() => {
                    setActive(k);
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* 3줄 미리보기 + 펼쳐보기 */}
          <ExpandableText
            text={activeText}
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
          />

          {/* 쿠팡 배너: 펼친 상태에서만 */}
          {expanded && (
            <div className={styles.coupangBox}>
              <div className={styles.coupangHead}>
                {getUserNameFromCookie()}님을 위한 행운의 상품
                <span className={styles.coupangHeadArrow}>›</span>
              </div>
              <div
                className={styles.coupangItem}
                onClick={handleCoupangProductClick}
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

        {/* 이번 주 점수 (풀블리드 카드) */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>이번 주 운세 점수는?</h2>
          <WeeklyBar
            data={data.weekly}
            highlightLabel={new Intl.DateTimeFormat("ko-KR", {
              weekday: "short",
              timeZone: "Asia/Seoul",
            }).format(new Date())}
          />
        </SectionCard>

        {/* 다른 운세 보러가기 (풀블리드 카드) */}
        <SectionCard>
          <h2 className={styles.sectionTitle}>다른 운세 보러가기</h2>
          <div className={styles.moreCenter}>
            <div className={styles.moreList}>
              <div
                className={styles.moreItem}
                onClick={() => router.push("/fortune-landing?type=monthly")}
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
                onClick={() => router.push("/fortune-landing?type=yearly")}
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
                onClick={() => router.push("/fortune-landing?type=wealth")}
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
                onClick={() => router.push("/fortune-landing?type=love")}
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
                <button className={styles.ctaBtn}  onClick={() => router.push('/info')}>
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

      {/* 리워드 모달 */}
      {showRewardModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRewardModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>🎉 축하합니다!</h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowRewardModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.rewardIcon}>🎁</div>
              <p className={styles.modalText}>
                광고를 시청해주셔서 감사합니다!<br />
                리워드가 지급되었습니다.
              </p>
              <div className={styles.rewardAmount}>+100 포인트</div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButton}
                onClick={() => setShowRewardModal(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 리워드 못받은 모달 (새로운 디자인) */}
      {showNoRewardModal && (
        <div className={styles.failModalOverlay} onClick={() => setShowNoRewardModal(false)}>
          <div className={styles.failModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.failModalBody}>
              <img
                src="/icon/Icon_luckycatpaw.png"
                alt="고양이 발가락"
                className={styles.failModalImage}
              />
              <p className={styles.failModalText}>
                오늘 하루, 나를 비추는 행운을 찾으셨나요?<br />
                오늘 이벤트는 이미 참여했어요.
              </p>
            </div>
            <button
              className={styles.failModalButton}
              onClick={() => setShowNoRewardModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 리워드 지급 완료 토스트 */}
      {showRewardToast && (
        <div className={styles.rewardToast}>
          <div className={styles.toastContent}>
            <span className={styles.toastText}>2 포인트 지급 완료</span>
          </div>
        </div>
      )}
    </div>
  );
}
