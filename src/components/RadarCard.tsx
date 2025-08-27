'use client';
import styles from '@/css/RadarCard.module.css';

export default function RadarCard() {
  return (
    <section className={styles.card}>
      <div className={styles.badge}>72점</div>
      <div className={styles.chartPlaceholder}>레이더 차트</div>
    </section>
  );
}
