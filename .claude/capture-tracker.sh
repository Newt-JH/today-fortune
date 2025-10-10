#!/bin/bash

# 캡처된 파일 경로를 저장/조회/삭제하는 스크립트

TRACKER_FILE="/Users/newt/game/today-fortune/.claude/.last-captures.txt"

case "$1" in
  save)
    # 파일 경로 저장
    echo "$2" >> "$TRACKER_FILE"
    ;;

  list)
    # 저장된 파일 목록 출력
    if [ -f "$TRACKER_FILE" ]; then
      cat "$TRACKER_FILE"
    fi
    ;;

  clear)
    # 저장된 파일들 삭제하고 목록 비우기
    if [ -f "$TRACKER_FILE" ]; then
      while IFS= read -r file; do
        if [ -f "$file" ]; then
          rm "$file"
          echo "🗑️  삭제: $file"
        fi
      done < "$TRACKER_FILE"
      rm "$TRACKER_FILE"
      echo "✅ 모든 캡처 파일 삭제 완료"
    else
      echo "삭제할 파일이 없습니다."
    fi
    ;;

  *)
    echo "Usage: $0 {save|list|clear} [file_path]"
    exit 1
    ;;
esac
