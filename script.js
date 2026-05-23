/* ════════════════════════════════════════════════
   나만의 중국어 AI 친구 — 최종 Gemini 전용 script.js
   - Gemini API 직결
   - API 키 입력창 제거 가능
   - 모든 문장 실제 AI 분석
   - JSON 자동 파싱
   - 오류 처리 포함
   ════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   [1] 설정
   ───────────────────────────────────────── */

const GEMINI_API_KEY = "AIzaSyCxLA_aHwp4M164SJ6BEUzbaTu19W7GR1A";

const SITUATIONS = {
  friend: { label: '친구와 대화', tone: '편하고 친근한 반말체' },
  school: { label: '학교 발표', tone: '정중하고 또렷한 발표체' },
  travel: { label: '여행', tone: '간단하고 실용적인 여행 회화체' },
  sns: { label: 'SNS', tone: '짧고 트렌디한 인터넷 말투' },
  formal: { label: '공식 표현', tone: '예의 바르고 격식 있는 표현' },
};

/* ─────────────────────────────────────────
   [2] 앱 상태
   ───────────────────────────────────────── */

const APP = {
  direction: 'ko2cn',
  situation: 'friend',
};

/* ─────────────────────────────────────────
   [3] 프롬프트 생성
   ───────────────────────────────────────── */

function buildPrompt(text, direction, situationId) {
  const dirText =
    direction === 'ko2cn'
      ? '한국어를 중국어로'
      : '중국어를 한국어로';

  const situ = SITUATIONS[situationId] || SITUATIONS.friend;

  return `
너는 중국어 회화를 가르치는 친절한 AI 선생님이다.

입력 문장을 ${dirText} 자연스럽게 번역하고 학습 피드백을 제공해라.

[입력 문장]
${text}

[상황]
${situ.label}
${situ.tone}

반드시 JSON만 출력해라.

{
  "natural":"",
  "naturalPinyin":"",
  "literal":"",
  "literalNote":"",
  "grammar":"",
  "errors":[
    {
      "type":"",
      "desc":"",
      "isGood":false
    }
  ],
  "situations":[
    {
      "tag":"",
      "cn":"",
      "py":""
    }
  ],
  "conversation":[
    {
      "cn":"",
      "py":"",
      "ko":""
    }
  ],
  "culture":"",
  "hsk":{
    "level":1,
    "label":"",
    "desc":""
  },
  "recommend":[
    {
      "cn":"",
      "py":"",
      "ko":""
    }
  ]
}
`;
}

/* ─────────────────────────────────────────
   [4] JSON 파싱
   ───────────────────────────────────────── */

function parseAIJson(raw) {
  if (!raw) {
    throw new Error("AI 응답이 비어 있습니다.");
  }

  let s = raw.trim();

  s = s
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');

  if (start >= 0 && end > start) {
    s = s.slice(start, end + 1);
  }

  return JSON.parse(s);
}

/* ─────────────────────────────────────────
   [5] Gemini API 호출
   ───────────────────────────────────────── */

async function requestAnalysis(
  text,
  direction,
  situationId
) {
  const prompt = buildPrompt(
    text,
    direction,
    situationId
  );

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Gemini API 오류: " + response.status
    );
  }

  const data = await response.json();

  const raw =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return parseAIJson(raw);
}

/* ─────────────────────────────────────────
   [6] 결과 렌더링
   ───────────────────────────────────────── */

function renderResult(data) {
  const results = document.getElementById('results');

  results.innerHTML = `
    <div class="result-card">
      <h2>✨ 자연스러운 표현</h2>
      <p>${data.natural}</p>
      <small>${data.naturalPinyin || ''}</small>
    </div>

    <div class="result-card">
      <h2>⚠️ 직역하면 어색한 표현</h2>
      <p>${data.literal}</p>
      <small>${data.literalNote}</small>
    </div>

    <div class="result-card">
      <h2>📘 문법 설명</h2>
      <p>${data.grammar}</p>
    </div>

    <div class="result-card">
      <h2>🗣 실제 회화 표현</h2>
      ${
        (data.conversation || [])
          .map(
            c => `
              <div class="conv-item">
                <strong>${c.cn}</strong>
                <div>${c.py}</div>
                <div>${c.ko}</div>
              </div>
            `
          )
          .join('')
      }
    </div>

    <div class="result-card">
      <h2>🌏 문화 설명</h2>
      <p>${data.culture}</p>
    </div>
  `;
}

/* ─────────────────────────────────────────
   [7] 오류 렌더링
   ───────────────────────────────────────── */

function renderError(message) {
  const results = document.getElementById('results');

  results.innerHTML = `
    <div class="error-box">
      <h2>😢 오류 발생</h2>
      <p>${message}</p>
    </div>
  `;
}

/* ─────────────────────────────────────────
   [8] 버튼 이벤트
   ───────────────────────────────────────── */

const submitBtn =
  document.getElementById('submitBtn');

submitBtn.addEventListener(
  'click',
  async () => {
    const input =
      document
        .getElementById('inputText')
        .value
        .trim();

    if (!input) {
      alert("문장을 입력하세요!");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "분석 중...";

    document.getElementById(
      'results'
    ).innerHTML = `
      <div class="loading">
        🔍 AI가 분석 중입니다...
      </div>
    `;

    try {
      const result =
        await requestAnalysis(
          input,
          APP.direction,
          APP.situation
        );

      renderResult(result);

    } catch (err) {
      console.error(err);

      renderError(
        err.message ||
        "알 수 없는 오류"
      );

    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent =
        "학습 분석 받기";
    }
  }
);

/* ─────────────────────────────────────────
   [9] 방향 버튼
   ───────────────────────────────────────── */

document
  .querySelectorAll('.direction-btn')
  .forEach(btn => {

    btn.addEventListener('click', () => {

      document
        .querySelectorAll('.direction-btn')
        .forEach(b =>
          b.classList.remove(
            'direction-btn--active'
          )
        );

      btn.classList.add(
        'direction-btn--active'
      );

      APP.direction = btn.dataset.dir;
    });
  });

/* ─────────────────────────────────────────
   [10] 상황 버튼
   ───────────────────────────────────────── */

document
  .querySelectorAll('.situation-btn')
  .forEach(btn => {

    btn.addEventListener('click', () => {

      document
        .querySelectorAll('.situation-btn')
        .forEach(b =>
          b.classList.remove(
            'situation-btn--active'
          )
        );

      btn.classList.add(
        'situation-btn--active'
      );

      APP.situation = btn.dataset.situ;
    });
  });