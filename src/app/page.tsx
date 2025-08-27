import MobileShell from '@/components/MobileShell';
import RadarCard from '@/components/RadarCard';
import styles from '@/css/page.module.css';

export default function Page() {
  return (
    <MobileShell title="오늘의 운세">
      <div className={styles.stack}>
        <RadarCard />
        <section className={styles.card}>
          <h2 className={styles.h2}>오늘의 한줄 운세</h2>
          <p className={styles.muted}>작은 성과가 큰 기쁨으로 돌아올 하루!</p>
        </section>
        <button className={styles.cta}>자세히 보기</button>
      </div>
    </MobileShell>
  );
}
