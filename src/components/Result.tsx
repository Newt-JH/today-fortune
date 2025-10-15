/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { addQueryParams } from "@/utils/navigation";
import { getFortuneInfo } from "@/utils/cookie";

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
export default function Result({ data: initialData }: { data?: ResultData }) {
  const [active, setActive] = useState<CategoryKey>("총운");
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showNoRewardModal, setShowNoRewardModal] = useState(false);
  const [pendingRewardStatus, setPendingRewardStatus] = useState<'success' | 'already' | null>(null);
  const [showRewardToast, setShowRewardToast] = useState(false);
  const [data, setData] = useState<ResultData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);

  // API에서 데이터 가져오기
  useEffect(() => {
    if (initialData) return; // 이미 데이터가 있으면 스킵

    const fetchFortuneData = async () => {
      try {
        const fortuneInfo = getFortuneInfo();
        if (!fortuneInfo) {
          console.error('사주 정보가 없습니다.');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/fortune/daily', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fortuneInfo),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch fortune data');
        }

        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error('운세 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFortuneData();
  }, [initialData]);

  const activeText = data?.categories[active].text || '';
  const activeScore = data?.categories[active].score || 0;

  // 쿠팡 상품 클릭 핸들러
  const handleCoupangProductClick = () => {
    window.open('https://example.com/coupang-product', '_blank');
  };

  // 사주정보 변경하기 클릭 핸들러 - 쿠키 삭제 후 info로 이동
  const handleChangeBirthInfo = () => {
    // fortuneInfo 쿠키 삭제
    document.cookie = 'fortuneInfo=; Path=/; Max-Age=0';
    // info 페이지로 이동 (파라미터 유지)
    router.push(addQueryParams('/info'));
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

  // 오늘 이미 "이미 지급" 모달을 본 적이 있는지 확인
  const hasSeenNoRewardModalToday = (): boolean => {
    if (typeof document === 'undefined') return false;

    const today = new Date().toISOString().split('T')[0];
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'seenNoRewardModal') {
        return value === today; // 오늘 날짜와 같으면 이미 봄
      }
    }
    return false; // 쿠키가 없으면 아직 안 봄
  };

  // "이미 지급" 모달을 봤다고 쿠키에 기록
  const markNoRewardModalSeen = () => {
    if (typeof document === 'undefined') return;

    const today = new Date().toISOString().split('T')[0];
    // 내일 자정에 만료되도록 설정
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    document.cookie = `seenNoRewardModal=${today}; expires=${tomorrow.toUTCString()}; path=/`;
  };

  // 페이지 진입 시 리워드 상태 확인 (모달은 바로 띄우지 않음)
  useEffect(() => {
    // 첫 진입인지 확인
    const isFirstVisitToday = canReceiveReward();

    if (isFirstVisitToday) {
      // 첫 진입: 리워드 지급
      setPendingRewardStatus('success');
      markTodayRewardReceived();
    } else {
      // 두 번째+ 진입: 오늘 첫 번째 재방문인 경우에만 "이미 지급" 모달 표시
      if (!hasSeenNoRewardModalToday()) {
        setPendingRewardStatus('already');
        markNoRewardModalSeen();
      }
      // 이미 모달을 본 경우: 아무것도 표시하지 않음 (pendingRewardStatus는 null 유지)
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

  // 로딩 중이거나 데이터가 없을 때 하얀 화면 표시
  if (isLoading || !data) {
    return <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }} />;
  }

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
                onClick={() => router.push(addQueryParams("/fortune-landing?type=monthly"))}
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
                onClick={() => router.push(addQueryParams("/fortune-landing?type=yearly"))}
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
                onClick={() => router.push(addQueryParams("/fortune-landing?type=wealth"))}
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
                onClick={() => router.push(addQueryParams("/fortune-landing?type=love"))}
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
                <button className={styles.ctaBtn}  onClick={handleChangeBirthInfo}>
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
