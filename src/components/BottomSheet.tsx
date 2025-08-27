'use client';
import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import styles from '@/css/BottomSheet.module.css';

export type BottomSheetHandle = { close: () => void };

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;      // 애니메이션 종료 후 호출 (부모에서 open=false 처리 권장)
  children: React.ReactNode;
  maxHeightVh?: number;     // 기본 60
  closeThreshold?: number;  // 드래그 닫힘 임계치(px), 기본 80
};

export default forwardRef<BottomSheetHandle, Props>(function BottomSheet(
  { open, title, onClose, children, maxHeightVh = 60, closeThreshold = 80 },
  ref
) {
  const startY = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);   // DOM 마운트 제어
  const [opening, setOpening] = useState(false);   // 슬라이드 업 중
  const [closing, setClosing] = useState(false);   // 슬라이드 다운 중
  const [dragY, setDragY] = useState(0);           // 드래그 이동량(px)

  // 외부에서 애니메이션 닫기 호출
  useImperativeHandle(ref, () => ({ close: beginClose }), []);

  // open 변화 → mount & 부드러운 오픈
  useEffect(() => {
    if (open) {
      setVisible(true);
      setOpening(false);
      setClosing(false);
      setDragY(0);
      // 2-RAF: translateY(100%) 상태를 먼저 페인트 → 이후 .open 부여해 트랜지션 보장
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpening(true));
      });
    } else if (visible) {
      // 부모가 false로 내렸다면 우아하게 닫기
      beginClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ESC + body scroll lock
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && beginClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // 드래그 제스처
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startY.current = e.clientY;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startY.current == null || closing) return;
    const dy = e.clientY - startY.current;
    setDragY(Math.max(0, dy));
  };
  const onPointerEnd = () => {
    if (startY.current == null) return;
    const shouldClose = dragY > closeThreshold;
    if (shouldClose) beginClose();
    else setDragY(0); // 스냅백
    startY.current = null;
  };

  // 공통 닫기 루틴(슬라이드 다운 후 언마운트)
  function beginClose() {
    if (!visible) return;
    setOpening(false);
    setClosing(true);
    setDragY(0); // 인라인 transform 해제
    // CSS duration과 일치
    window.setTimeout(() => {
      setClosing(false);
      setVisible(false);
      onClose();  // 부모에서 open=false 적용
    }, 260);
  }

  if (!visible) return null;

  // 드래그 중일 때만 인라인 transform 적용(그 외에는 CSS 클래스 트랜지션 사용)
  const dragging = dragY > 0;
  const inlineTransform = dragging ? `translateY(${dragY}px)` : undefined;

  return (
    <div
      className={`${styles.overlay} ${opening ? styles.overlayOpen : ''} ${closing ? styles.overlayClosing : ''}`}
      onClick={beginClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={[
          styles.sheet,
          opening ? styles.open : '',
          closing ? styles.closing : '',
        ].join(' ')}
        style={{ maxHeight: `${maxHeightVh}vh`, transform: inlineTransform }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.handle}
          role="button"
          aria-label="시트 끌어서 내리기"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        />
        {title && <div className={styles.header}>{title}</div>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
});
