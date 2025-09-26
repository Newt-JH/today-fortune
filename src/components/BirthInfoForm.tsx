// src/components/BirthInfoForm.tsx
'use client';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/css/BirthInfoForm.module.css';
import BottomSheet, { BottomSheetHandle } from '@/components/BottomSheet';
import TimePickerSheet, { getTimeLabel } from '@/components/TimePickerSheet';

type CalendarType = 'SOLAR' | 'LUNAR_PLAIN' | 'LUNAR_LEAP';
type Gender = 'M' | 'F';

// YYYYMMDD → 실제 날짜 유효성 체크
function isValidYmd(ymd: string) {
  if (!/^\d{8}$/.test(ymd)) return false;
  const y = Number(ymd.slice(0, 4));
  const m = Number(ymd.slice(4, 6));
  const d = Number(ymd.slice(6, 8));

  if (m < 1 || m > 12) return false;

  // 로컬 타임존 보정 이슈를 피하려면 UTC Date를 써도 되지만,
  // 여기서는 간단히 일반 Date로 검증합니다.
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

export default function BirthInfoForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [calendar, setCalendar] = useState<CalendarType>('SOLAR'); // 양력 기본
  const [birth, setBirth] = useState('');                          // YYYYMMDD
  const [time, setTime] = useState<string>('unknown');             // 12지지 or 'unknown'
  const [gender, setGender] = useState<Gender>('M');               // 남자 기본

  const [openTimeSheet, setOpenTimeSheet] = useState(false);
  const sheetRef = useRef<BottomSheetHandle>(null);

  // 필수값 충족 시 활성화: 이름 + 생년월일(YYYYMMDD & 실제 존재 날짜)
  const canSubmit = useMemo(
    () => name.trim().length > 0 && isValidYmd(birth),
    [name, birth]
  );

  const onSave = () => {
    if (!canSubmit) return;

    const payload = {
      name: name.trim(),
      calendar,
      birth,     // "YYYYMMDD"
      time,      // 'JA' | 'unknown' ...
      gender,    // 'M' | 'F'
      ts: Date.now(),
    };

    const json = encodeURIComponent(JSON.stringify(payload));

    // 쿠키 1년 보존 (31536000초)
    document.cookie =
      `fortuneInfo=${json}; Path=/; Max-Age=31536000; SameSite=Lax`;

    router.push('/landing');
  };

  return (
    <div className={styles.screen}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <button
          className={styles.back}
          aria-label="뒤로가기"
          onClick={() => history.back()} // 수정 필요: 나중에 함수 변경 가능
        >
          ‹
        </button>
        <h1 className={styles.title}>사주 정보</h1>
        <div className={styles.right} />
      </header>

      <main className={styles.main}>
        {/* 이름 */}
        <div className={styles.field}>
          <label className={styles.label}>
            이름 <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.input}
            placeholder="이름을 입력해 주세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
          />
        </div>

        {/* 양력/음력 */}
        <div className={styles.field}>
          <label className={styles.label}>
            양력/음력 <span className={styles.required}>*</span>
          </label>
          <div className={styles.segment}>
            <button
              className={`${styles.segmentBtn} ${calendar === 'SOLAR' ? styles.segmentActive : ''}`}
              aria-pressed={calendar === 'SOLAR'}
              onClick={() => setCalendar('SOLAR')}
            >
              양력
            </button>
            <button
              className={`${styles.segmentBtn} ${calendar === 'LUNAR_PLAIN' ? styles.segmentActive : ''}`}
              aria-pressed={calendar === 'LUNAR_PLAIN'}
              onClick={() => setCalendar('LUNAR_PLAIN')}
            >
              음력(평달)
            </button>
            <button
              className={`${styles.segmentBtn} ${calendar === 'LUNAR_LEAP' ? styles.segmentActive : ''}`}
              aria-pressed={calendar === 'LUNAR_LEAP'}
              onClick={() => setCalendar('LUNAR_LEAP')}
            >
              음력(윤달)
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div className={styles.field}>
          <label className={styles.label}>
            생년월일 <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.input}
            placeholder="예시) 19880401"
            inputMode="numeric"
            pattern="\d*"
            maxLength={8}
            value={birth}
            onChange={(e) => setBirth(e.target.value.replace(/\D/g, '').slice(0, 8))}
          />
        </div>

        {/* 출생 시간 (모달형 드롭다운 트리거) */}
        <div className={styles.field}>
          <label className={styles.label}>출생 시간</label>
          <button
            className={styles.pickerBtn}
            onClick={() => setOpenTimeSheet(true)}
            aria-haspopup="dialog"
            aria-expanded={openTimeSheet}
          >
            <span>{getTimeLabel(time)}</span>
            <span className={styles.pickerChev}>▾</span>
          </button>
        </div>

        {/* 성별 */}
        <div className={styles.field}>
          <label className={styles.label}>성별</label>
          <div className={styles.segment} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <button
              className={`${styles.segmentBtn} ${gender === 'M' ? styles.segmentActive : ''}`}
              aria-pressed={gender === 'M'}
              onClick={() => setGender('M')}
            >
              남자
            </button>
            <button
              className={`${styles.segmentBtn} ${gender === 'F' ? styles.segmentActive : ''}`}
              aria-pressed={gender === 'F'}
              onClick={() => setGender('F')}
            >
              여자
            </button>
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          className={`${styles.saveBtn} ${!canSubmit ? styles.saveDisabled : ''}`}
          disabled={!canSubmit}
          onClick={onSave}
        >
          저장하기
        </button>
      </main>

      {/* 바텀시트: 출생 시간 선택 */}
      <BottomSheet
        ref={sheetRef}
        open={openTimeSheet}
        title="태어난 시간을 선택해주세요"
        maxHeightVh={60}
        onClose={() => setOpenTimeSheet(false)}   // 애니메이션 종료 후 false
      >
        <TimePickerSheet
          value={time}
          onSelect={(v) => {
            setTime(v);
            setOpenTimeSheet(false);              // 선택 즉시 닫힘(애니메이션)
          }}
        />
      </BottomSheet>
    </div>
  );
}
