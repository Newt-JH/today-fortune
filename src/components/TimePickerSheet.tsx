'use client';
import styles from '@/css/TimePickerSheet.module.css';

export type TimeOption = { value: string; label: string };

const OPTIONS: TimeOption[] = [
  { value: 'unknown', label: '모름' },
  { value: 'JA',   label: '자시 (23:30 ~ 01:29)' },
  { value: 'CHUK', label: '축시 (01:30 ~ 03:29)' },
  { value: 'IN',   label: '인시 (03:30 ~ 05:29)' },
  { value: 'MYO',  label: '묘시 (05:30 ~ 07:29)' },
  { value: 'JIN',  label: '진시 (07:30 ~ 09:29)' },
  { value: 'SA',   label: '사시 (09:30 ~ 11:29)' },
  { value: 'O',    label: '오시 (11:30 ~ 13:29)' },
  { value: 'MI',   label: '미시 (13:30 ~ 15:29)' },
  { value: 'SIN',  label: '신시 (15:30 ~ 17:29)' },
  { value: 'YU',   label: '유시 (17:30 ~ 19:29)' },
  { value: 'SUL',  label: '술시 (19:30 ~ 21:29)' },
  { value: 'HAE',  label: '해시 (21:30 ~ 23:29)' },
];

export function getTimeLabel(v: string) {
  return OPTIONS.find(o => o.value === v)?.label ?? '모름';
}

export default function TimePickerSheet({
  value, onSelect,
}: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className={styles.list} role="listbox" aria-label="태어난 시간 선택">
      {OPTIONS.map((o) => {
        const isActive = value === o.value;
        return (
          <button
            key={o.value}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={() => onSelect(o.value)}
            role="option"
            aria-selected={isActive}
          >
            <span>{o.label}</span>
            <div className={styles.check}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 10L8 14L16 6"
                  className={isActive ? styles.checkActive : styles.checkInactive}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        );
      })}
    </div>
  );
}
