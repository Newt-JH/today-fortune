import { PropsWithChildren } from 'react';
import styles from '@/css/MobileShell.module.css';

type Props = PropsWithChildren<{
  title?: string;
  className?: string;
}>;

export default function MobileShell({ title = '오늘의 운세', className, children }: Props) {
  return (
    <div className={`app-frame ${styles.container} ${className ?? ''}`}>
      <header className={styles.topbar}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <main className={`${styles.main} safe-area`}>{children}</main>
    </div>
  );
}
