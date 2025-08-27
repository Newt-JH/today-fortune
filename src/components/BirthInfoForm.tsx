'use client';
import { useMemo, useRef, useState } from 'react';
import styles from '@/css/BirthInfoForm.module.css';
import BottomSheet, { BottomSheetHandle } from '@/components/BottomSheet';
import TimePickerSheet, { getTimeLabel } from '@/components/TimePickerSheet';

type CalendarType = 'SOLAR' | 'LUNAR_PLAIN' | 'LUNAR_LEAP';
type Gender = 'M' | 'F';

export default function BirthInfoForm() {
  const [name, setName] = useState('');
  const [calendar, setCalendar] = useState<CalendarType>('SOLAR'); // 양력 기본
  const [birth, setBirth] = useState('');                          // YYYYMMDD
  const [time, setTime] = useState<string>('unknown');             // 12지지 or 'unknown'
  const [gender, setGender] = useState<Gender>('M');               // 남자 기본

  const [openTimeSheet, setOpenTimeSheet] = useState(false);
  const sheetRef = useRef<BottomSheetHandle>(null);

  // 활성화 조건: 이름 + 생년월일(8자리 숫자)
  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && /^\d{8}$/.test(birth);
  }, [name, birth]);

  return (
    <div className={styles.screen}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <button className={styles.back} aria-label="뒤로가기" onClick={() => history.back()}>‹</button>
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
            maxLength={10}
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
            >양력</button>
            <button
              className={`${styles.segmentBtn} ${calendar === 'LUNAR_PLAIN' ? styles.segmentActive : ''}`}
              aria-pressed={calendar === 'LUNAR_PLAIN'}
              onClick={() => setCalendar('LUNAR_PLAIN')}
            >음력(평달)</button>
            <button
              className={`${styles.segmentBtn} ${calendar === 'LUNAR_LEAP' ? styles.segmentActive : ''}`}
              aria-pressed={calendar === 'LUNAR_LEAP'}
              onClick={() => setCalendar('LUNAR_LEAP')}
            >음력(윤달)</button>
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
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 8);
              setBirth(v);
            }}
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
            >남자</button>
            <button
              className={`${styles.segmentBtn} ${gender === 'F' ? styles.segmentActive : ''}`}
              aria-pressed={gender === 'F'}
              onClick={() => setGender('F')}
            >여자</button>
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          className={`${styles.saveBtn} ${!canSubmit ? styles.saveDisabled : ''}`}
          disabled={!canSubmit}
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
            setOpenTimeSheet(false);
          }}
        />
      </BottomSheet>
    </div>
  );
}
