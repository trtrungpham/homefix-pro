#!/usr/bin/env bash
# Tạo admin user sau khi đã chạy SQL migrations trong Supabase SQL Editor.
# Yêu cầu: .env.local có SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY

set -e
cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "❌ Không tìm thấy .env.local"
  exit 1
fi

# Load env
export $(grep -v '^#' .env.local | xargs)

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@homefixpro.vn}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin@123456}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_KEY" ]; then
  echo "❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

echo "🔍 Kiểm tra bảng profiles..."
CHECK=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  "$SUPABASE_URL/rest/v1/profiles?select=id&limit=1")

if [ "$CHECK" != "200" ]; then
  echo "❌ Bảng profiles chưa tồn tại (HTTP $CHECK)."
  echo "   Hãy chạy supabase/run_all.sql trong SQL Editor trước."
  exit 1
fi

echo "✅ Schema OK"
echo ""
echo "👤 Tạo admin user: $ADMIN_EMAIL"

CREATE_RES=$(curl -s -X POST \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\",\"email_confirm\":true,\"user_metadata\":{\"full_name\":\"Quản trị viên\"}}" \
  "$SUPABASE_URL/auth/v1/admin/users")

USER_ID=$(echo "$CREATE_RES" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id') or d.get('user',{}).get('id') or '')" 2>/dev/null || echo "")

if [ -z "$USER_ID" ]; then
  echo "ℹ️  User có thể đã tồn tại. Lấy ID từ danh sách..."
  LIST_RES=$(curl -s \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    "$SUPABASE_URL/auth/v1/admin/users?filter=email.eq.$ADMIN_EMAIL")
  USER_ID=$(echo "$LIST_RES" | python3 -c "
import sys,json
d=json.load(sys.stdin)
users=d.get('users') or d
if isinstance(users,list) and users: print(users[0].get('id',''))
" 2>/dev/null || echo "")
fi

if [ -z "$USER_ID" ]; then
  echo "❌ Không tạo/tìm thấy user. Response:"
  echo "$CREATE_RES"
  exit 1
fi

echo "✅ User ID: $USER_ID"
echo ""
echo "🔐 Set role = admin..."

UPDATE_RES=$(curl -s -X PATCH \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"role":"admin","full_name":"Quản trị viên"}' \
  "$SUPABASE_URL/rest/v1/profiles?id=eq.$USER_ID")

echo "$UPDATE_RES"
echo ""
echo "🎉 Hoàn tất! Đăng nhập tại http://localhost:3000/admin/login"
echo "   Email:    $ADMIN_EMAIL"
echo "   Password: $ADMIN_PASSWORD"
