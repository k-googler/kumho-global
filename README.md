# KUMHO GLOBAL — From Jeju, to the World

금호글로벌 기업 웹사이트 (Static Single-Page)

## 실행 방법

압축 해제 후 두 가지 방법 중 아무거나:

### 1. 그냥 더블클릭
`index.html` 파일을 더블클릭하면 브라우저에서 바로 열림.

### 2. 로컬 서버 (추천 — custom cursor 등 일부 인터랙션이 더 부드러움)
```bash
# Python 3
python3 -m http.server 8000

# 또는 Node.js
npx serve .
```
그 다음 브라우저에서 `http://localhost:8000` 접속.

## 파일 구조

```
kumho-global/
├── index.html          # 메인 HTML (한국어/영어 카피 포함)
├── style.css           # 디자인 시스템 + Swiss grid + 인터랙션 CSS
├── script.js           # 커스텀 커서, 슬라이더, 페이드인, 카운터 등
├── assets/
│   ├── images/         # 12장 고해상도 이미지 (hero/sections/store/about)
│   └── videos/         # (선택) 향후 hero 영상을 mp4로 넣을 폴더
└── README.md
```

## 커스터마이징

- **텍스트 수정** — `index.html`에서 한국어/영어 카피, 가격(₩), 연락처, 주소 등을 직접 편집
- **이미지 교체** — `assets/images/`에 같은 파일명으로 덮어쓰기
  (또는 `index.html`의 `<img src="...">` 경로 변경)
- **영상 추가** — 슬라이더 구조 유지한 채 `assets/videos/hero-ocean.mp4` 등으로 저장 후
  HTML에서 `<img>` 태그를 `<video autoplay muted loop playsinline>` 으로 교체
- **색상** — `style.css` 상단 `:root` CSS 변수에서 일괄 변경
  ```css
  --bg: #f4f1ec;      /* 배경 (제주 모래) */
  --accent: #1f3a4a;  /* 강조 (딥오션) */
  --wood: #c4a57b;    /* 우드톤 */
  ```

## 기술 스택

순수 HTML5 + CSS3 + Vanilla JS — 빌드/번들러 불필요, 외부 라이브러리 의존성은 Google Fonts(Inter, Noto Sans KR)뿐.

## 디자인 레퍼런스

- Swiss grid · Bauhaus minimal · Awwwards 톤
- 풀와이드 슬라이더 · Ken Burns 줌 · 커스텀 커서 · 마키 · IntersectionObserver 페이드인

---

© 2026 Kumho Global Co., Ltd. · Made in Jeju
