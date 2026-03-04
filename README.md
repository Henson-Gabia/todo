# ✅ Todo — 할일 관리 앱

React + TypeScript로 만든 할일 관리 웹 애플리케이션입니다.
Supabase를 통해 데이터를 저장하고, Vercel로 배포합니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18 + TypeScript (Vite) |
| 스타일링 | Tailwind CSS v3 |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | Supabase Auth (이메일/비밀번호) |
| 날짜 처리 | date-fns |
| 차트 | Recharts |
| 드래그 앤 드롭 | @dnd-kit |
| PWA | vite-plugin-pwa |
| 배포 | Vercel (GitHub 연동 자동 배포) |

---

## 전체 기능

### 기본 할일 관리
- **추가**: 내용 입력 후 Enter 또는 추가 버튼
- **완료 체크**: 체크박스 클릭
- **수정**: ✏️ 버튼으로 인라인 편집 (Enter 저장 / Esc 취소)
- **삭제**: × 버튼
- **완료 일괄삭제**: 완료된 항목 한 번에 삭제

### 카테고리 & 중요도
| 카테고리 | 중요도 | 카드 테두리 |
|----------|--------|------------|
| 개인 / 업무 / 쇼핑 / 기타 | 높음🔴 / 보통🟡 / 낮음🟢 | 빨강 / 노랑 / 초록 |

### 마감일 D-Day
| D+N | D-Day | D-1~2 | D-3+ |
|-----|-------|-------|------|
| 진한 빨강 | 빨강 | 주황 | 회색 |

### 태그
- 할일 추가/수정 시 자유 형식 태그 입력 (Enter 또는 쉼표)
- 태그 배지 클릭으로 즉시 필터링
- 필터바 하단에 전체 태그 목록 표시

### 하위 할일 (서브태스크)
- 카드의 ☰ 버튼으로 서브태스크 패널 토글
- 완료율 진행 바 표시 (X/Y)
- 서브태스크별 독립적인 완료 체크 및 삭제

### 공유 목록
- 카드의 🔗 버튼으로 이메일로 공유
- 공유된 할일은 상대방 "공유됨" 필터에서 확인 가능
- 공유된 할일의 완료 체크 가능
- 공유 해제 기능

### 검색 & 필터 & 정렬
| 필터 | 정렬 |
|------|------|
| 전체 / 오늘 마감 / 공유됨 / 카테고리 | 최신순 / 마감일순 / 중요도순 / 직접정렬 |

- 태그 필터 별도 제공
- 완료 숨기기 토글

### 캘린더 뷰 📅
- 헤더 📅 버튼으로 월간 캘린더 전환
- 할일 있는 날짜에 색상 점 표시 (빨강: 기한초과, 파랑: 진행중, 회색: 완료)
- 날짜 클릭 시 해당 날짜 할일 목록 표시

### 통계 대시보드 📊
- 전체 / 완료 / 완료율 / 기한초과 요약
- 카테고리별 파이 차트
- 중요도별 완료 현황 바 차트

### 다크모드 🌙
- 헤더 🌙 버튼으로 토글 (시스템 다크모드 감지)
- localStorage 자동 저장

### 마감 알림 🔔
- 🔔 버튼으로 권한 허용
- D-Day(오늘), D-1(내일) 자동 브라우저 알림

### 드래그 앤 드롭
- 정렬 `직접정렬` 선택 후 ⠿ 핸들 드래그
- Supabase에 순서 자동 저장

### 진행률 바
- 헤더에 완료수/전체수 + 진행 바 표시

### PWA (모바일 설치)
- 브라우저에서 "홈 화면에 추가" 가능
- 오프라인에서도 기본 동작 지원

### AI 자동 분류 ✨ (유료 API 필요)

> **⚠️ 현재 비활성 상태**: Anthropic API 크레딧이 있어야 동작합니다. 크레딧이 없으면 오류 없이 기능만 스킵됩니다.

- 할일 입력 시 **800ms 후 자동으로 Claude AI가 분석**
- 카테고리, 중요도, 태그를 자동 추천 (✨ 표시)
- 사용자가 직접 변경한 항목은 AI가 덮어쓰지 않음
- API 키 미설정 또는 크레딧 부족 시 기능 자동 비활성화

**활성화 방법:**
1. [console.anthropic.com](https://console.anthropic.com) → API Keys에서 키 발급
2. [Plans & Billing](https://console.anthropic.com/settings/billing)에서 크레딧 충전 (최소 $5)
3. `.env.local`에 키 추가:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxx
   ```
4. Vercel 배포 환경은 Settings → Environment Variables에도 동일하게 추가

---

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. Supabase 테이블 생성

Supabase Dashboard → SQL Editor에서 실행:

```sql
-- todos 테이블
create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  completed boolean default false,
  category text check (category in ('personal','work','shopping','other')) not null,
  priority text check (priority in ('high','medium','low')) not null,
  due_date date,
  position integer,
  tags text[] default '{}',
  shared_with_emails text[] default '{}',
  created_at timestamptz default now()
);

alter table todos enable row level security;

create policy "users can manage own todos"
  on todos for all using (auth.uid() = user_id);

create policy "users can see todos shared with them"
  on todos for select using (auth.email() = any(shared_with_emails));

create policy "users can update shared todos"
  on todos for update using (auth.email() = any(shared_with_emails));

-- subtasks 테이블
create table subtasks (
  id uuid default gen_random_uuid() primary key,
  todo_id uuid references todos(id) on delete cascade not null,
  content text not null,
  completed boolean default false,
  created_at timestamptz default now()
);

alter table subtasks enable row level security;

create policy "users can manage own subtasks"
  on subtasks for all
  using (auth.uid() = (select user_id from todos where id = subtasks.todo_id));
```

> 기존 테이블이 있다면 컬럼만 추가:
> ```sql
> alter table todos add column if not exists position integer;
> alter table todos add column if not exists tags text[] default '{}';
> alter table todos add column if not exists shared_with_emails text[] default '{}';
> ```

### 3. 환경변수 설정

`.env.local` 파일 생성:

```
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx...
VITE_ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxx   # AI 기능 사용 시 (선택)
```

### 4. 로컬 실행

```bash
npm run dev
```

---

## 배포 (Vercel)

1. GitHub 저장소에 push
2. [vercel.com](https://vercel.com) → New Project → GitHub 저장소 선택
3. Settings → Environment Variables에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 추가 (AI 기능 사용 시 `VITE_ANTHROPIC_API_KEY`도 추가)
4. Deploy → GitHub push마다 자동 재배포

---

## 프로젝트 구조

```
src/
├── components/
│   ├── Auth/
│   │   └── AuthForm.tsx
│   ├── Calendar/
│   │   └── CalendarView.tsx       # 월간 캘린더 뷰
│   ├── Layout/
│   │   └── Header.tsx
│   ├── Sharing/
│   │   └── ShareModal.tsx         # 이메일 공유 모달
│   ├── Stats/
│   │   └── StatsModal.tsx
│   └── Todo/
│       ├── FilterBar.tsx          # 필터 + 태그 필터
│       ├── SearchBar.tsx
│       ├── SubtaskPanel.tsx       # 하위 할일 패널
│       ├── TagInput.tsx           # 태그 입력 컴포넌트
│       ├── TodoControls.tsx
│       ├── TodoInput.tsx
│       ├── TodoItem.tsx
│       └── TodoList.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useDarkMode.ts
│   ├── useNotifications.ts
│   ├── useSubtasks.ts             # 하위 할일 CRUD
│   └── useTodos.ts
├── lib/
│   ├── supabase.ts
│   └── ai.ts                      # AI 자동 분류 (Claude Haiku API)
└── types/
    └── todo.ts
```
