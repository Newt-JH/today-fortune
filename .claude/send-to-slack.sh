#!/bin/bash

# Slack으로 알림 전송 스크립트
# 캡처 완료 알림을 Slack에 전송

IMAGE_PATH="$1"
MESSAGE="$2"

# .env.local에서 환경 변수 로드
if [ -f "/Users/newt/game/today-fortune/.env.local" ]; then
  source /Users/newt/game/today-fortune/.env.local
fi

if [ -z "$SLACK_WEBHOOK_URL" ]; then
  echo "Error: SLACK_WEBHOOK_URL not set"
  exit 1
fi

if [ ! -f "$IMAGE_PATH" ]; then
  echo "Error: Image file not found: $IMAGE_PATH"
  exit 1
fi

FILENAME=$(basename "$IMAGE_PATH")
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "📨 Sending to Slack..."

# Slack에 메시지 전송
curl -s -X POST "$SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "📸 스크린샷 캡처 완료"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "'"$MESSAGE"'"
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*파일명:*\n`'"$FILENAME"'`"
          },
          {
            "type": "mrkdwn",
            "text": "*시간:*\n'"$TIMESTAMP"'"
          },
          {
            "type": "mrkdwn",
            "text": "*저장 위치:*\n`'"$IMAGE_PATH"'`"
          }
        ]
      }
    ]
  }' > /dev/null

echo "✅ Slack에 알림 전송 완료!"
