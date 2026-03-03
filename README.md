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
| 배포 | Vercel (GitHub 연동 자동 배포) |

---

## 주요 기능

### 할일 관리
- **추가**: 내용 입력 후 Enter 또는 추가 버튼 클릭
- **완료 체크**: 체크박스 클릭으로 완료/미완료 전환
- **삭제**: × 버튼으로 항목 삭제

### 카테고리
개인 / 업무 / 쇼핑 / 기타로 분류하며 색상 배지로 구분합니다.

| 카테고리 | 색상 |
|----------|------|
| 개인 | 파란색 |
| 업무 | 보라색 |
| 쇼핑 | 초록색 |
| 기타 | 회색 |

### 중요도
높음 / 보통 / 낮음 3단계로 설정합니다.

| 중요도 | 카드 테두리 | 배지 |
|--------|------------|------|
| 높음 | 빨간색 | 🔴 |
| 보통 | 노란색 | 🟡 |
| 낮음 | 초록색 | 🟢 |

### 마감일 (Due Date)
- 할일 추가 시 마감일 선택 가능 (선택사항)
- D-Day 배지로 남은 일수 표시

| 상태 | 표시 | 색상 |
|------|------|------|
| 기한 초과 | D+N | 진한 빨강 |
| 오늘 | D-Day | 빨강 |
| 1~2일 남음 | D-1, D-2 | 주황 |
| 3일 이상 | D-N | 회색 |

### 필터
| 버튼 | 설명 |
|------|------|
| 전체 | 모든 할일 표시 |
| 오늘 마감 | 오늘이 마감인 항목만 표시 |
| 개인 / 업무 / 쇼핑 / 기타 | 카테고리별 필터 |

---

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. Supabase 테이블 생성

Supabase Dashboard → SQL Editor에서 실행:

```sql
create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  completed boolean default false,
  category text check (category in ('personal','work','shopping','other')) not null,
  priority text check (priority in ('high','medium','low')) not null,
  due_date date,
  created_at timestamptz default now()
);

alter table todos enable row level security;

create policy "users can manage own todos"
  on todos for all
  using (auth.uid() = user_id);
```

### 3. 환경변수 설정

`.env.local` 파일에 Supabase 프로젝트 정보 입력:

```
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx...
```

Supabase Dashboard → Settings → API 에서 확인 가능합니다.

### 4. 로컬 실행

```bash
npm run dev
```

---

## 배포 (Vercel)

1. GitHub 저장소에 push
2. [vercel.com](https://vercel.com) → New Project → GitHub 저장소 선택
3. Settings → Environment Variables에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 추가
4. Deploy

GitHub에 push할 때마다 자동으로 재배포됩니다.

---

## 프로젝트 구조

```
src/
├── components/
│   ├── Auth/
│   │   └── AuthForm.tsx       # 로그인/회원가입 폼
│   ├── Layout/
│   │   └── Header.tsx         # 헤더 (로그아웃 버튼)
│   └── Todo/
│       ├── FilterBar.tsx      # 필터 버튼 바
│       ├── TodoInput.tsx      # 할일 입력 폼
│       ├── TodoItem.tsx       # 할일 카드
│       └── TodoList.tsx       # 할일 목록
├── hooks/
│   ├── useAuth.ts             # 인증 상태 관리
│   └── useTodos.ts            # 할일 CRUD + D-Day 계산
├── lib/
│   └── supabase.ts            # Supabase 클라이언트
└── types/
    └── todo.ts                # TypeScript 타입 및 상수 정의
```
