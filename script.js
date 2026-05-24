/* ============================================================
   Shared Memory Project ／ 共有記憶プロジェクト — script.js
   ============================================================
   このファイルの役割 (이 파일의 역할):
   1. 歴史事件データ(韓・日・中の叙述)管理
   2. ページ切り替え (SPA方式)
   3. 事件カードの動的生成
   4. 国別叙述比較カードの描画
   5. AI分析シミュレーション (記憶・平和・多文化共生の観点を含む)
   6. キーワード頻度の自動計算と可視化
   7. 共同表現の作成・登録 (多言語対応)

   ※ 学習用として日本語と韓国語の注釈を丁寧に付けています。
   ============================================================ */


/* ============================================================
   📚 1. データ: 6つの事件 × 韓・日・中の叙述
   ============================================================
   韓・日・中の教科書叙述の一般的傾向を参考にしつつ、
   高校生が核心的な違いを明確に見られるよう整理しています。
   最後の「記憶と共生」は、現代社会・平和・多文化共生のテーマです。
*/
const eventsData = [
  // ----- 事件1: 文禄・慶長の役 (임진왜란) -----
  {
    id: 'imjin',
    title: '文禄・慶長の役',
    titleKO: '임진왜란',
    titleEN: "Imjin War",
    era: '1592 – 1598',
    mark: '戦',
    shortDesc: '日本軍の朝鮮半島侵攻から始まった7年間の東アジア国際戦争。韓・日・中すべてが甚大な被害を受けたが、呼び名と強調点が最も鮮明に分かれる。',
    shortDescKO: '한·중·일 모두 막대한 피해를 입은 7년 전쟁. 부르는 이름이 가장 극명하게 갈린다.',
    tags: ['16世紀', '国際戦争', '明清交替期'],

    korea: {
      title: '倭の侵略に抗した7年の抵抗',
      text: '1592年、日本が明への道を借りるという名目で朝鮮を侵攻した侵略戦争である。李舜臣の海戦の勝利、義兵の抵抗、明の援軍が結びつき日本軍を撃退した。国土は荒廃し、多くの民が犠牲となった。',
      keywords: ['侵略', '抵抗', '義兵', '李舜臣', '倭軍'],
      feature: '「侵略」「倭」という表現で日本の不当性を明示し、自発的抵抗(義兵)と英雄叙事を強調する。'
    },
    japan: {
      title: '大陸進出と二度の出兵',
      text: '豊臣秀吉が明の征服を目標に進めた大陸進出政策であり、朝鮮を経由地として二度軍を送った。明・朝鮮連合軍の抵抗と秀吉の死により撤退した。日本社会には朝鮮から伝わった陶磁器技術や活字印刷術など文化的影響が残った。',
      keywords: ['出兵', '進出', '経由', '秀吉', '文化伝播'],
      feature: '「侵略」ではなく「出兵」「進出」という中立的・外交的表現を用い、結果としての文化交流の側面を強調する。'
    },
    china: {
      title: '朝鮮を助け倭を防いだ義の戦い',
      text: '明が朝鮮の要請に応じて軍を送り、日本の侵略から藩邦である朝鮮を救援した戦い(抗倭援朝)である。東アジアの朝貢秩序を守る義の戦いであったが、莫大な軍事費は明朝の国力衰退の一因ともなった。',
      keywords: ['抗倭援朝', '藩邦', '救援', '朝貢秩序', '義戦'],
      feature: '「倭に抗し朝鮮を助けた」という宗主国的視点で叙述し、明の正当性と責任感を強調する。'
    },

    timeline: [
      { year: '1592.4', text: '日本軍、釜山に上陸。一か月で漢城(ソウル)陥落。' },
      { year: '1592.5', text: '李舜臣、玉浦海戦で初勝利。制海権を掌握。' },
      { year: '1593.1', text: '朝・明連合軍、平壌城を奪還。' },
      { year: '1597.1', text: '慶長の役勃発(日本の二度目の侵攻)。' },
      { year: '1598.11', text: '露梁海戦。李舜臣戦死。日本軍撤退。' }
    ],

    keywordFreq: {
      '侵略': { korea: 9, japan: 0, china: 4 },
      '進出・出兵': { korea: 0, japan: 8, china: 1 },
      '救援・援助': { korea: 3, japan: 1, china: 9 },
      '文化交流': { korea: 2, japan: 7, china: 2 }
    }
  },

  // ----- 事件2: 韓中日文化交流 (한중일 문화 교류) -----
  {
    id: 'culture',
    title: '韓中日文化交流',
    titleKO: '한중일 문화 교류',
    titleEN: 'Cultural Exchange',
    era: '4 – 19世紀',
    mark: '文',
    shortDesc: '仏教・漢字・儒教・陶磁器など、東アジア三国が1500年以上にわたり交わした文化の流れ。誰が「伝える者」で誰が「受ける者」かをめぐり視点が分かれる。',
    shortDescKO: '1500여 년에 걸친 문화의 흐름. 누가 전수자이고 누가 수용자인가에 대한 시각이 갈린다.',
    tags: ['長期持続史', '文化史', '文明伝播'],

    korea: {
      title: '文化伝播の架け橋',
      text: '韓国は大陸の先進文物を受け入れ独自に発展させた後、日本へ伝える中継の役割を担った。百済の王仁博士が日本に漢字と千字文を伝え、高句麗の僧・曇徴が紙・墨・碾(ひきうす)の製作技術を伝授した。単なる通路ではなく能動的な変容者であった。',
      keywords: ['伝播', '架け橋', '王仁', '曇徴', '能動的受容'],
      feature: '「伝える者」としての自負と、単なる受容ではない「創造的変容」を強調する。'
    },
    japan: {
      title: '大陸文化の主体的受容',
      text: '日本は遣隋使・遣唐使を派遣して中国文化を直接受容し、また渡来人を通じて多様な技術と学問を取り入れた。これを日本の風土に合わせて変容させ独自の文化を完成させた。平安時代の仮名文字がその代表例である。',
      keywords: ['渡来人', '遣唐使', '主体的受容', '国風文化', '変容'],
      feature: '「伝えられた」ではなく「主体的に受け入れた」という能動的表現を一貫して用いる。'
    },
    china: {
      title: '東アジア文明の中心',
      text: '中国は漢字、儒教、律令制度、仏教(漢訳)など東アジア文明の核心要素を発信した中心地であった。周辺国は中国文化を受容し漢字文化圏を形成し、これは東アジア共通の文化的土台となった。',
      keywords: ['中心', '発信', '漢字文化圏', '律令', '文明伝授'],
      feature: '「中華」的世界観に基づき、中国を文明の中心・発信者として位置づける。'
    },

    timeline: [
      { year: '372', text: '高句麗に仏教伝来(中国・前秦より)。' },
      { year: '538', text: '百済、日本に仏教を伝授。' },
      { year: '630', text: '日本、第一次遣唐使の派遣を開始。' },
      { year: '1592', text: '文禄・慶長の役を通じた陶磁器・印刷術の伝来。' }
    ],

    keywordFreq: {
      '伝播・伝授': { korea: 8, japan: 2, china: 7 },
      '受容・導入': { korea: 4, japan: 9, china: 2 },
      '変容・創造': { korea: 6, japan: 8, china: 3 },
      '中心': { korea: 1, japan: 1, china: 9 }
    }
  },

  // ----- 事件3: 朝貢関係 (조공 관계) -----
  {
    id: 'tribute',
    title: '朝貢関係',
    titleKO: '조공 관계',
    titleEN: 'Tributary System',
    era: '7 – 19世紀',
    mark: '貢',
    shortDesc: '東アジア千年の国際秩序。同じ制度を、韓国は「実利外交」、中国は「天下秩序」、日本は「前近代的従属」と異なって評価する。',
    shortDescKO: '동아시아 천년의 국제 질서. 같은 제도를 두고 평가가 갈린다.',
    tags: ['国際関係史', '制度史', '東アジア秩序'],

    korea: {
      title: '実利のための事大外交',
      text: '朝貢は中国中心の国際秩序の中で安全保障を確保し先進文物を輸入するための外交的選択であった。朝鮮は明・清に朝貢を送ったが内政の自主性を維持しており、これは従属ではなく実用的な外交戦略であった。',
      keywords: ['事大', '実利', '自主性', '外交戦略', '文物輸入'],
      feature: '朝貢を従属ではなく「実利的選択」として再解釈し、内政の自主性を強調する。'
    },
    japan: {
      title: '中華秩序から外れた日本',
      text: '日本は平安時代の遣唐使廃止(894年)以後、中国中心の朝貢体制から事実上離脱した。室町幕府の一時的な勘合貿易を除けば朝貢国ではなく独自の地位を保ち、これが近代日本が東アジアで素早く変化できた背景となったとされる。',
      keywords: ['離脱', '独自性', '勘合貿易', '非朝貢国', '近代化基盤'],
      feature: '朝貢を前近代的体制とみなし、そこから「離脱」した日本の独自性を強調する。'
    },
    china: {
      title: '天下の調和的秩序',
      text: '朝貢体制は中国を中心とする東アジアの平和的・文化的な国際秩序であった。朝貢国に手厚く返礼する「厚往薄来」の原則で運営され、単なる支配-従属ではなく儀礼的・文化的な関係であった。',
      keywords: ['天下', '礼治', '厚往薄来', '冊封', '調和'],
      feature: '「調和的秩序」という肯定的・理想化された視点で朝貢を描く。'
    },

    timeline: [
      { year: '7世紀', text: '新羅、唐と朝貢・冊封関係を樹立。' },
      { year: '894', text: '日本、遣唐使の派遣を中止。' },
      { year: '1401', text: '朝鮮・明、朝貢関係を公式化。' },
      { year: '1894', text: '日清戦争 → 朝貢体制の崩壊。' }
    ],

    keywordFreq: {
      '事大・朝貢': { korea: 7, japan: 3, china: 9 },
      '自主・独自': { korea: 8, japan: 9, china: 1 },
      '秩序・平和': { korea: 2, japan: 1, china: 8 },
      '従属': { korea: 1, japan: 6, china: 0 }
    }
  },

  // ----- 事件4: 近代化の過程 (근대화 과정) -----
  {
    id: 'modern',
    title: '近代化の過程',
    titleKO: '근대화 과정',
    titleEN: 'Modernization',
    era: '1840 – 1910',
    mark: '近',
    shortDesc: '西欧列強の衝撃の前で韓・日・中が歩んだ異なる道。同じ時代を、ある国は「成功」、ある国は「屈辱」、ある国は「挫折」として記憶する。',
    shortDescKO: '같은 시대를 성공·치욕·좌절로 다르게 기억한다.',
    tags: ['19世紀', '近代化', '帝国主義'],

    korea: {
      title: '挫折した自主的近代化',
      text: '甲申政変・甲午改革・光武改革など自主的近代化の試みがあったが、日本の侵略と列強の干渉により挫折した。東学農民運動に見られるように民衆の近代化への熱望も強かったが、結局1910年に国権を喪失する悲劇的な結末を迎えた。',
      keywords: ['自主改革', '挫折', '東学', '国権喪失', '抵抗'],
      feature: '「挫折した自主性」を核心とし、外勢の責任を強調する。'
    },
    japan: {
      title: '明治維新と東洋唯一の近代国家',
      text: '1868年の明治維新を通じて日本は東洋で最も早く西欧式近代国家を樹立した。「脱亜入欧」の旗の下、産業化・憲法制定・議会設立を成し遂げ、日清・日露戦争の勝利で列強の仲間入りをした。一方で、この過程に伴う植民地支配の側面は、近年その記述をめぐり議論が続いている。',
      keywords: ['明治維新', '脱亜入欧', '文明開化', '富国強兵', '植民地支配'],
      feature: '近代化の「成功モデル」として日本を位置づける一方、植民地支配の記述には歴史認識上の論点が残る。'
    },
    china: {
      title: '百年の屈辱(百年国恥)',
      text: 'アヘン戦争(1840)から始まった西欧列強の侵略は、中国にとって「百年の屈辱」であった。洋務運動・戊戌変法・辛亥革命など自強の努力があったが、半植民地状態から抜け出せなかった。この時期は中国の民族復興叙事の出発点である。',
      keywords: ['百年国恥', '半植民地', '自強', 'アヘン戦争', '民族復興'],
      feature: '「屈辱」という強い感情語で西欧・日本の侵略責任を浮き彫りにし、復興叙事へとつなげる。'
    },

    timeline: [
      { year: '1840', text: 'アヘン戦争勃発 → 中国近代の始まり。' },
      { year: '1868', text: '日本、明治維新。' },
      { year: '1876', text: '江華島条約 → 朝鮮の開港。' },
      { year: '1894', text: '日清戦争 → 東アジア秩序の再編。' },
      { year: '1910', text: '韓国併合。' }
    ],

    keywordFreq: {
      '自主・自強': { korea: 8, japan: 2, china: 7 },
      '開化・文明': { korea: 4, japan: 9, china: 3 },
      '侵略・屈辱': { korea: 8, japan: 1, china: 9 },
      '成功・発展': { korea: 1, japan: 8, china: 2 }
    }
  },

  // ----- 事件5: 独島・竹島問題 (독도/다케시마) -----
  {
    id: 'dokdo',
    title: '独島・竹島問題',
    titleKO: '독도/다케시마 문제',
    titleEN: 'Dokdo/Takeshima',
    era: '512 – 現在',
    mark: '島',
    shortDesc: '現在進行形の領土問題。両国とも自国領土と主張し、用いる名称そのものが立場を表す。第三者である中国の視点も併せて見る。',
    shortDescKO: '현재진행형의 영토 문제. 명칭 자체가 입장을 드러낸다.',
    tags: ['領土問題', '現在進行形', '歴史認識'],

    korea: {
      title: '歴史的・地理的に明白な韓国領土',
      text: '独島は512年の新羅・異斯夫による于山国征服以来、韓国固有の領土である。朝鮮時代の安龍福の活動、「三国接壌之図」など日本側の史料にも韓国領土と表記されている。1905年の島根県編入は侵略過程の一部であり無効であるとする。',
      keywords: ['固有領土', '異斯夫', '安龍福', '島根県編入', '実効支配'],
      feature: '歴史的連続性と史料の一貫性、さらに日本側資料まで活用した立証を強調する。'
    },
    japan: {
      title: '国際法上の日本固有の領土',
      text: '竹島は17世紀半ばから日本が領有権を確立した固有の領土であるとする。1905年の島根県告示で領有意思を再確認したとし、韓国の実効支配を国際法違反と主張する。平和的解決のため国際司法裁判所(ICJ)への付託を提案している。',
      keywords: ['固有領土', '島根県告示', '国際法', '実効支配', 'ICJ'],
      feature: '国際法・国際社会の枠組みでの解決を主張し、韓国の領有を「不法占拠」と表現する。'
    },
    china: {
      title: '韓日間の二国間問題として認識',
      text: '中国は独島・竹島問題を韓国と日本の二国間の領土紛争と認識し、公式的な立場表明を控える傾向がある。ただし日本の領土主張が尖閣諸島(釣魚島)問題と連動しうる点から、日本の右傾化を批判的に見ている。',
      keywords: ['二国間問題', '右傾化批判', '中立的立場', '尖閣', '歴史修正主義'],
      feature: '直接の当事者ではない第三者の視点ながら、日本の右傾化牽制という自国の利害と結びつける。'
    },

    timeline: [
      { year: '512', text: '新羅、于山国(独島を含む)を服属。' },
      { year: '1696', text: '安龍福、日本に渡海抗議。' },
      { year: '1905', text: '日本、島根県告示40号で編入。' },
      { year: '1952', text: '韓国、「平和線」宣言後に実効支配を開始。' },
      { year: '現在', text: '韓国が実効支配、日本が領有権主張を継続。' }
    ],

    keywordFreq: {
      '固有領土': { korea: 9, japan: 9, china: 2 },
      '実効支配': { korea: 8, japan: 5, china: 1 },
      '国際法': { korea: 4, japan: 9, china: 3 },
      '侵略・不法': { korea: 7, japan: 6, china: 2 }
    }
  },

  // ----- 事件6: 記憶と共生 (기억과 공생) — 現代社会・平和・多文化 -----
  {
    id: 'memory',
    title: '記憶と共生',
    titleKO: '기억과 공생',
    titleEN: 'Memory & Coexistence',
    era: '1945 – 現在',
    mark: '和',
    shortDesc: 'ヒロシマの記憶、在日朝鮮人、多文化共生——戦後東アジアの「記憶の継承」と「和解」をめぐる現代的主題。対立を超え、共に生きる未来を問う。',
    shortDescKO: '히로시마의 기억, 재일조선인, 다문화 공생 — 화해와 미래지향적 대화의 주제.',
    tags: ['戦後', '平和教育', '多文化共生'],

    korea: {
      title: '加害と被害の重層性',
      text: '韓国は植民地支配の被害という記憶を出発点としつつ、在日朝鮮人の歴史を通じて「日本社会の中のマイノリティ」という視点も共有する。戦後補償と歴史認識の問題を、単なる過去清算ではなく未来の和解と人権の課題として捉える動きが広がっている。',
      keywords: ['植民地支配', '在日朝鮮人', '戦後補償', '和解', '人権'],
      feature: '被害の記憶を土台にしつつ、マイノリティの人権と未来志向の和解へ視野を広げる。'
    },
    japan: {
      title: '被爆の記憶と平和の誓い',
      text: 'ヒロシマ・ナガサキの被爆体験は、日本の戦後アイデンティティと平和教育の核心をなす。「唯一の戦争被爆国」としての平和の誓いが語られる一方、加害の記憶とどう向き合うかが問われ続けている。近年は多文化共生社会の理念のもと、在日コリアンら多様な背景を持つ人々との共存が模索されている。',
      keywords: ['ヒロシマ', '被爆の記憶', '平和教育', '多文化共生', 'アイデンティティ'],
      feature: '被爆という被害の記憶と平和の言説を中心に据えつつ、加害の記憶と多文化共生という新たな課題に向き合う。'
    },
    china: {
      title: '歴史認識と東アジア共同体',
      text: '中国は抗日戦争の記憶を民族的アイデンティティの核とする一方、経済的相互依存の深化の中で「東アジア共同体」構想にも関心を寄せる。歴史認識の共有が地域協力の前提であるとし、記憶の継承と未来志向の協力の両立を課題とする。',
      keywords: ['歴史認識', '記憶の継承', '東アジア共同体', '文化的交流', '共存'],
      feature: '抗日の記憶を保持しつつ、地域協力と「東アジア共同体」という未来志向の枠組みを提示する。'
    },

    timeline: [
      { year: '1945', text: '広島・長崎への原爆投下。第二次世界大戦終結。' },
      { year: '1965', text: '日韓基本条約。戦後補償をめぐる議論の起点。' },
      { year: '1995', text: '戦後50年「村山談話」。歴史認識の節目。' },
      { year: '2000s', text: '多文化共生社会の理念が各地の自治体政策に。' },
      { year: '現在', text: '記憶の継承と和解、青少年の国際交流が進展。' }
    ],

    keywordFreq: {
      '平和・和解': { korea: 6, japan: 8, china: 5 },
      '多文化共生': { korea: 5, japan: 8, china: 4 },
      '記憶の継承': { korea: 7, japan: 7, china: 8 },
      '共同体・協力': { korea: 5, japan: 6, china: 8 }
    }
  }
];


/* ============================================================
   🧭 2. ページ切り替え (SPA Router)
   ============================================================ */
let currentEventId = null;        // 現在表示中の事件ID
let sharedNarratives = [];        // ユーザーが書いた共同表現の保存先

/**
 * ページ切り替え関数
 * @param {string} pageName - 'home' | 'events' | 'detail' | 'about'
 */
function navigateTo(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const targetPage = document.querySelector(`[data-page-name="${pageName}"]`);
  if (targetPage) targetPage.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ============================================================
   🗂 3. 事件カードの動的生成
   ============================================================ */
function renderEventCards() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  grid.innerHTML = eventsData.map(event => `
    <div class="event-card" data-event-id="${event.id}">
      <div class="event-card__visual" data-mark="${event.mark}">${event.mark}</div>
      <div class="event-card__body">
        <div class="event-card__era">${event.era}</div>
        <h3 class="event-card__title">${event.title}</h3>
        <div class="event-card__title-ko">${event.titleKO}</div>
        <p class="event-card__desc">${event.shortDesc}</p>
        <div class="event-card__tags">
          ${event.tags.map(tag => `<span class="event-card__tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => openEventDetail(card.dataset.eventId));
  });
}


/* ============================================================
   📖 4. 事件詳細ページの描画 (国別叙述カード)
   ============================================================ */
function openEventDetail(eventId) {
  const event = eventsData.find(e => e.id === eventId);
  if (!event) return;

  currentEventId = eventId;

  // --- 4-1. ヘッダー(タイトル・時期・説明) ---
  document.getElementById('detailHeader').innerHTML = `
    <div class="detail__era">${event.era}</div>
    <h2 class="detail__title">${event.title}</h2>
    <div class="detail__title-ko">${event.titleKO} ／ ${event.titleEN}</div>
    <p class="detail__desc">${event.shortDesc}</p>
  `;

  // --- 4-2. 国別叙述カード3枚 ---
  const countries = [
    { key: 'korea', name: '韓国', en: 'KOREA', flag: '韓' },
    { key: 'japan', name: '日本', en: 'JAPAN', flag: '日' },
    { key: 'china', name: '中国', en: 'CHINA', flag: '中' }
  ];

  document.getElementById('narrativesGrid').innerHTML = countries.map(c => {
    const n = event[c.key];
    return `
      <div class="narrative-card narrative-card--${c.key}">
        <div class="narrative-card__flag">
          <div class="narrative-card__flag-mark">${c.flag}</div>
          <div>
            <div class="narrative-card__country">${c.name}の叙述</div>
            <div class="narrative-card__country-en">${c.en}</div>
          </div>
        </div>
        <h4 class="narrative-card__title">${n.title}</h4>
        <p class="narrative-card__text">${n.text}</p>

        <div class="narrative-card__section">
          <div class="narrative-card__label">主要キーワード</div>
          <div class="narrative-card__keywords">
            ${n.keywords.map(k => `<span class="narrative-card__keyword">${k}</span>`).join('')}
          </div>
        </div>

        <div class="narrative-card__section">
          <div class="narrative-card__label">表現の特徴</div>
          <p class="narrative-card__feature">${n.feature}</p>
        </div>
      </div>
    `;
  }).join('');

  // --- 4-3. 年表(タイムライン) ---
  document.getElementById('timelineTrack').innerHTML = event.timeline.map(t => `
    <div class="timeline__item">
      <div class="timeline__year">${t.year}</div>
      <div class="timeline__text">${t.text}</div>
    </div>
  `).join('');

  // --- 4-4. AI結果・タブの初期化 ---
  document.getElementById('aiResult').classList.remove('show');
  document.getElementById('aiResult').innerHTML = '';
  switchTab('compare');

  // --- 4-5. キーワードチャート ---
  renderKeywordChart(event);

  // --- 4-6. 共同表現リスト ---
  renderSharedList();

  navigateTo('detail');
}


/* ============================================================
   🔘 5. タブ切り替え
   ============================================================ */
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${tabName}"]`)?.classList.add('active');
  document.querySelector(`[data-tab-content="${tabName}"]`)?.classList.add('active');
}


/* ============================================================
   🤖 6. AI分析シミュレーション
   ============================================================
   実際の自然言語処理(NLP)は複雑ですが、ここでは学習用に
   核心原理だけを単純化して実装します:

   ① キーワード頻度の比較 → 共通/固有のキーワード抽出
   ② 表現フレームの分析 → 叙述の「枠組み」を読み解く
   ③ 平和・社会統合・多文化共生の観点からの考察
   ④ 青少年国際交流のための示唆

   ※ 単なる政治・対立中心ではなく、記憶の違いや
     未来志向の対話の観点を重視しています。
*/
function runAIAnalysis() {
  const event = eventsData.find(e => e.id === currentEventId);
  if (!event) return;

  const resultBox = document.getElementById('aiResult');
  resultBox.innerHTML = `<div class="ai-result__loading">AIが三か国の叙述を分析しています</div>`;
  resultBox.classList.add('show');

  setTimeout(() => {
    // 事件別の核心分析ポイント (専門家による事前定義)
    // 実際のAI分析でもドメイン知識(domain knowledge)が非常に重要です。
    const analysisMap = {
      'imjin': {
        common: [
          '三か国とも1592–1598年の出来事である点では一致し、日本の軍事行動が発端であった事実自体は否定しない。',
          '明(中国)の参戦が戦争の行方を変えた重要な変数であった点も共通して認める。'
        ],
        diff: [
          '韓国: 「侵略」という価値評価を含む用語を使用 → 日本の不当性を明示',
          '日本: 「出兵」「進出」という価値中立的な表現を使用 → 行為の正・不当の判断を留保',
          '中国: 「倭に抗し朝鮮を助けた(抗倭援朝)」→ 自国を正義の守護者として位置づける'
        ],
        frame: [
          '韓国の叙述フレーム: 「被害と抵抗」— 英雄(李舜臣・義兵)中心の感情的・物語的構造',
          '日本の叙述フレーム: 「政策と結果」— 外交的・中立的語彙、文化交流という結果に比重',
          '中国の叙述フレーム: 「義と秩序」— 宗主国的視点、道徳的正当性を強調'
        ],
        peace: [
          '同じ事実を異なる言葉で表す語彙選択は、歴史認識の出発点であり結果でもある。',
          '共同表現をつくるには、価値評価語を減らし、検証可能な事実語を増やすことが鍵となる。',
          '「7年間、東アジア三国すべてが甚大な被害を受けた国際戦争」という共通の被害の認識が、対話の土台になりうる。'
        ]
      },
      'culture': {
        common: [
          '文化交流が一方向ではなく多方向であった事実は三か国とも認める。',
          '漢字・仏教・儒教が東アジア共通の文化的基盤である点で合意する。'
        ],
        diff: [
          '韓国: 「伝播の架け橋」— 積極的な中継者の役割を強調',
          '日本: 「主体的受容」— 受けたという表現ではなく能動性を強調',
          '中国: 「文明の中心」— 発信者としての主体性を強調'
        ],
        frame: [
          '同じ「交流」という言葉の中に、三つの異なる自己定位が共存する。',
          '韓国は「王仁・曇徴」など人物名、日本は「渡来人」など抽象名詞、中国は「漢字文化圏」など体制用語を好む。'
        ],
        peace: [
          '文化交流の主題は、対立ではなく「共有された遺産」を確認できる数少ない領域である。',
          '「誰が伝えたか」より「何を共に育てたか」へ視点を移すと、東アジア共通のアイデンティティが見えてくる。',
          '多文化共生の原型を、この長い交流の歴史の中に見出すことができる。'
        ]
      },
      'tribute': {
        common: [
          '東アジアに中国中心の国際秩序が存在した事実自体は否定されない。',
          '朝貢体制が19世紀末の西欧の衝撃で崩壊した結末でも一致する。'
        ],
        diff: [
          '韓国: 朝貢を「従属ではなく実利」と再解釈 → 事大の能動的側面を強調',
          '日本: 「離脱」した非朝貢国として自己定位 → 東アジアとの距離化',
          '中国: 「調和的な天下秩序」として理想化 → 平和的・文化的性格を強調'
        ],
        frame: [
          '同じ制度を「実利的外交」(韓国)、「前近代的従属」(日本)、「調和的秩序」(中国)と評価が分かれる。',
          '評価語彙の違いが、そのまま国際秩序を見る視点の違いを映し出す。'
        ],
        peace: [
          '朝貢体制を「支配-従属」の二分法ではなく、儀礼・文化・交易が複合した重層的秩序として捉え直すことができる。',
          '過去の地域秩序の研究は、現代の「東アジア共同体」構想を考える歴史的素材となる。'
        ]
      },
      'modern': {
        common: [
          '19世紀の西欧列強の衝撃が東アジア近代化の出発点であった点で一致する。',
          '各国が自強のための改革を試みた事実も共通する。'
        ],
        diff: [
          '韓国: 「挫折」— 自主的試みが外勢に阻まれたという叙事',
          '日本: 「成功」— 明治維新の模範事例化、植民地支配の記述は論点として残る',
          '中国: 「屈辱(国恥)」— 強い感情的評価、復興叙事へと接続'
        ],
        frame: [
          '同じ時代を、韓国は悲劇、日本は成功、中国は屈辱として記憶する。',
          '特に「脱亜入欧」と「百年国恥」は、正反対の方向の自己認識を映す鏡のような表現である。'
        ],
        peace: [
          '「成功」の叙事と「被害」の叙事が出会うとき、加害と被害の記憶をどう共有するかが問われる。',
          '近代化の光と影を共に見つめることが、歴史認識の溝を埋める出発点となる。',
          '青少年の国際交流では、「どちらが正しいか」ではなく「なぜこう記憶するのか」を共に問う姿勢が重要である。'
        ]
      },
      'dokdo': {
        common: [
          '韓国・日本とも「固有領土」という同一の表現を使うが、正反対の結論を導く。',
          '1905年の島根県編入が歴史的分岐点である点は共有される。'
        ],
        diff: [
          '韓国: 歴史的・実効的支配を強調(異斯夫・安龍福・実効支配)',
          '日本: 国際法・国際機関の活用を強調(島根県告示・ICJ付託)',
          '中国: 直接の当事者ではない立場から日本の右傾化を牽制する視点'
        ],
        frame: [
          '「固有領土」という同じ用語を使いながら、その根拠(歴史 vs 国際法)と時間(古代から vs 17世紀から)で差が生じる。',
          '名称の選択(独島/竹島)そのものが立場表明となる点で、最も先鋭な対立領域である。'
        ],
        peace: [
          '領土問題は感情的対立に陥りやすいが、史料を共に検証する「共同研究」の場が緊張緩和につながりうる。',
          '名称をめぐる対立を一旦保留し、まず「対話のテーブルを保つこと」自体に価値がある。',
          '次世代が事実に基づき冷静に議論できる素養を育てることが、長期的な解決の基盤となる。'
        ]
      },
      'memory': {
        common: [
          '三か国とも、戦争と植民地の記憶が現代のアイデンティティ形成に深く関わっている点を認める。',
          '記憶の継承(教育・追悼)が次世代にとって重要な課題である点で一致する。',
          'ヒロシマの被爆の記憶が、人類全体の平和への教訓として共有されうる点も広く認められている。'
        ],
        diff: [
          '韓国: 植民地支配の被害と在日朝鮮人の人権を出発点に、戦後補償と和解を語る',
          '日本: 被爆という被害の記憶と平和教育を中心に据えつつ、加害の記憶との向き合いが問われる',
          '中国: 抗日の記憶を民族的核としつつ、東アジア共同体という未来志向の協力を提示'
        ],
        frame: [
          '表現フレームの違い: 韓国「人権・和解」、日本「平和・共生」、中国「協力・共同体」',
          '「被害の記憶」と「加害の記憶」をどう同時に語るかが、和解の言説の核心となる。',
          '在日朝鮮人や多文化共生の主題は、歴史を「過去の対立」から「現在の共生」へと架橋する。'
        ],
        peace: [
          '記憶の違いは消し去るものではなく、互いに「聴き合う」ことで共生の資源となりうる。',
          '多文化共生の視点は、歴史認識を国家間の問題から、社会の中の多様性と人権の問題へと広げる。',
          'ヒロシマの記憶を起点とした平和教育は、東アジアの青少年が国境を越えて共有できる対話の言語となる。',
          '「東アジア共同体」は、対立の歴史を否定するのではなく、それを踏まえた上での未来志向の構想である。'
        ]
      }
    };

    const data = analysisMap[currentEventId];

    // 結果HTML出力 (記憶・フレーム・平和の観点を含む5セクション構成)
    resultBox.innerHTML = `
      <div class="ai-result__section">
        <div class="ai-result__heading">
          <span>✓</span>
          <span>1. 共通点 <span style="font-weight:400;font-size:0.8rem;color:var(--ink-mute)">／ 공통점</span></span>
        </div>
        <ul class="ai-result__list">
          ${data.common.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="ai-result__section">
        <div class="ai-result__heading">
          <span>≠</span>
          <span>2. 相違点 <span style="font-weight:400;font-size:0.8rem;color:var(--ink-mute)">／ 차이점</span></span>
        </div>
        <ul class="ai-result__list">
          ${data.diff.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="ai-result__section">
        <div class="ai-result__heading">
          <span>※</span>
          <span>3. 表現フレームの特徴 <span style="font-weight:400;font-size:0.8rem;color:var(--ink-mute)">／ 표현 프레임</span></span>
        </div>
        <ul class="ai-result__list">
          ${data.frame.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="ai-result__section" style="background: var(--accent-soft); border-left-color: var(--accent);">
        <div class="ai-result__heading">
          <span>🕊</span>
          <span>4. 対話のための示唆 <span style="font-weight:400;font-size:0.8rem;color:var(--ink-mute)">／ 평화・공생의 시사점</span></span>
        </div>
        <ul class="ai-result__list">
          ${data.peace.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      ${renderSocialKeywordSection(event)}
    `;
  }, 1500);
}

/**
 * [拡張] 社会・記憶キーワードのレーダー的考察セクション
 * 各事件に関連する現代社会キーワードを提示し、
 * 歴史記憶と現代日本社会(在日朝鮮人・多文化共生・ヒロシマ等)をつなぐ。
 */
function renderSocialKeywordSection(event) {
  // 事件ごとに関連づける社会・記憶キーワード
  const socialKeywordMap = {
    'imjin':   ['歴史認識', '記憶の継承', '和解'],
    'culture': ['文化的交流', '多文化共生', 'アイデンティティ', '東アジア共同体'],
    'tribute': ['東アジア共同体', '共存', '歴史認識'],
    'modern':  ['植民地支配', '戦後補償', '歴史認識', '記憶の継承'],
    'dokdo':   ['歴史認識', '対立', '和解'],
    'memory':  ['ヒロシマ', '被爆の記憶', '在日朝鮮人', '多文化共生', '平和教育', '和解', '共存', '東アジア共同体']
  };

  // キーワードごとの一行解説 (現代社会との接続)
  const keywordExplain = {
    'ヒロシマ': '被爆の記憶は日本の平和教育の核であり、人類共通の反核・平和の象徴として国境を越えて共有されうる。',
    '被爆の記憶': '被害の記憶をどう継承し、同時に加害の記憶とどう向き合うかが、戦後の歴史認識の中心的課題である。',
    '在日朝鮮人': '植民地支配の歴史が生んだ日本社会のマイノリティであり、歴史記憶と現代の多文化共生が交差する存在。',
    '多文化共生': '異なる背景を持つ人々が対等に共に生きる理念。歴史認識を「国家間」から「社会の中の共生」へと広げる。',
    '東アジア共同体': '対立の歴史を踏まえた上で、地域協力と平和を目指す未来志向の構想。',
    '歴史認識': '同じ事実を異なって記憶するという事実そのものを理解することが、対話の第一歩となる。',
    '平和教育': '過去の戦争の記憶を、次世代が平和を選び取る力へと転換する教育。',
    '戦後補償': '過去の被害に対する責任の問題であり、和解と信頼回復の前提として議論が続く。',
    '文化的交流': '対立ではなく共有された遺産を確認できる領域であり、共生の歴史的な原型である。',
    '和解': '「誰が正しいか」ではなく「なぜ異なるか」を理解し合うことから始まるプロセス。',
    '共存': '違いを消すのではなく、違いを認め合いながら共に生きること。',
    'アイデンティティ': '歴史の記憶は集団のアイデンティティを形づくる。その自覚が他者理解の出発点となる。',
    '植民地支配': '加害と被害の記憶が最も鋭く交差する主題であり、戦後補償・和解の議論の根幹をなす。',
    '記憶の継承': '記憶は自然に残るのではなく、教育・追悼・対話を通じて意識的に継承される。',
    '対立': '対立そのものを否定せず、それを対話の出発点として捉え直す視点が求められる。',
    '協力': '記憶の違いを抱えながらも、共通の未来のために協力する道を探ること。'
  };

  const keywords = socialKeywordMap[event.id] || ['歴史認識', '和解', '共存'];

  const listHtml = keywords.map(kw => {
    const explain = keywordExplain[kw] || '';
    return `<li><strong style="color:var(--accent)">${kw}</strong> — ${explain}</li>`;
  }).join('');

  return `
    <div class="ai-result__section">
      <div class="ai-result__heading">
        <span>🌏</span>
        <span>5. 現代社会・記憶文化との接続 <span style="font-weight:400;font-size:0.8rem;color:var(--ink-mute)">／ 사회 통합・다문화 공생 관점</span></span>
      </div>
      <ul class="ai-result__list">
        ${listHtml}
      </ul>
      <p style="margin-top:0.8rem;font-size:0.8rem;color:var(--ink-mute);padding-left:1.2rem;">
        ※ この事件を、現代日本社会の記憶文化(在日朝鮮人・多文化共生・ヒロシマの記憶など)や、青少年の国際交流の観点から考えてみましょう。
      </p>
    </div>
  `;
}


/* ============================================================
   📊 7. キーワード頻度チャート
   ============================================================ */
function renderKeywordChart(event) {
  const chart = document.getElementById('keywordsChart');
  if (!chart) return;

  // 各キーワードについて韓・日・中の頻度を棒グラフ化 (最大値10基準で%換算)
  chart.innerHTML = Object.entries(event.keywordFreq).map(([keyword, freqs]) => {
    return `
      <div class="keyword-row">
        <div class="keyword-row__label">${keyword}</div>
        <div class="keyword-row__bars">
          <div class="keyword-bar">
            <div class="keyword-bar__country keyword-bar__country--korea">韓国</div>
            <div class="keyword-bar__track">
              <div class="keyword-bar__fill keyword-bar__fill--korea" data-width="${freqs.korea * 10}"></div>
            </div>
            <div class="keyword-bar__value">${freqs.korea}</div>
          </div>
          <div class="keyword-bar">
            <div class="keyword-bar__country keyword-bar__country--japan">日本</div>
            <div class="keyword-bar__track">
              <div class="keyword-bar__fill keyword-bar__fill--japan" data-width="${freqs.japan * 10}"></div>
            </div>
            <div class="keyword-bar__value">${freqs.japan}</div>
          </div>
          <div class="keyword-bar">
            <div class="keyword-bar__country keyword-bar__country--china">中国</div>
            <div class="keyword-bar__track">
              <div class="keyword-bar__fill keyword-bar__fill--china" data-width="${freqs.china * 10}"></div>
            </div>
            <div class="keyword-bar__value">${freqs.china}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 棒グラフのアニメーション (少し遅らせてwidthを埋める)
  setTimeout(() => {
    chart.querySelectorAll('.keyword-bar__fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 100);
}


/* ============================================================
   🌐 8. 言語自動判定 (多言語入力対応)
   ============================================================
   原理: ユニコード(Unicode)の文字範囲で言語を識別します。
   - ハングル:   [가-힣]            → 韓国語
   - 仮名:       [\u3040-\u30FF]    → 日本語
   - アルファベット: [A-Za-z]        → 英語
*/
function detectLanguage(text) {
  if (!text || !text.trim()) return 'unknown';
  const hangulRegex = /[가-힣]/;
  const kanaRegex   = /[\u3040-\u309F\u30A0-\u30FF]/;
  const latinRegex  = /[A-Za-z]/;

  if (hangulRegex.test(text)) return 'ko';
  if (kanaRegex.test(text))   return 'ja';
  if (latinRegex.test(text))  return 'en';
  return 'unknown';
}

/** 言語コード → バッジ情報 */
function getLangBadge(code) {
  const map = {
    'ko':      { flag: '🇰🇷', label: '한국어' },
    'ja':      { flag: '🇯🇵', label: '日本語' },
    'en':      { flag: '🇺🇸', label: 'English' },
    'unknown': { flag: '🌐', label: '未判定' }
  };
  return map[code] || map['unknown'];
}


/* ============================================================
   ✍️ 9. 共同表現の作成機能
   ============================================================
   ※ サーバーが無いためブラウザのメモリ(変数)にのみ保存します。
     再読み込みすると消えます。(実サービスならDB連携が必要)
*/
function submitSharedNarrative() {
  const name = document.getElementById('userName').value.trim();
  const text = document.getElementById('userNarrative').value.trim();
  const reason = document.getElementById('userReason').value.trim();

  if (!name || !text) {
    alert('ニックネームと共同表現は必須項目です。／ 닉네임과 공동 표현은 필수입니다.');
    return;
  }

  // 入力テキストの言語を自動判定
  const detectedLang = detectLanguage(text);

  sharedNarratives.unshift({
    user: name,
    text: text,
    reason: reason,
    date: new Date().toLocaleDateString('ja-JP'),
    eventId: currentEventId,
    lang: detectedLang
  });

  document.getElementById('userName').value = '';
  document.getElementById('userNarrative').value = '';
  document.getElementById('userReason').value = '';

  renderSharedList();
}

function renderSharedList() {
  const list = document.getElementById('sharedList');
  if (!list) return;

  const items = sharedNarratives.filter(s => s.eventId === currentEventId);

  if (items.length === 0) {
    list.innerHTML = `<div class="shared-empty">まだ提案がありません。最初の提案を書いてみましょう。／ 아직 제안이 없습니다.</div>`;
    return;
  }

  list.innerHTML = items.map(item => {
    const badge = getLangBadge(item.lang || 'unknown');
    return `
      <div class="shared-item">
        <div class="shared-item__header">
          <div class="shared-item__user">
            ${escapeHtml(item.user)}
            <span class="narrative-card__keyword" style="font-size:0.72rem;">${badge.flag} ${badge.label}</span>
          </div>
          <div class="shared-item__date">${item.date}</div>
        </div>
        <div class="shared-item__text">「${escapeHtml(item.text)}」</div>
        ${item.reason ? `
          <div class="shared-item__reason">
            <strong>理由:</strong>${escapeHtml(item.reason)}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// XSS対策 (ユーザーが<script>等を入力しても文字として表示)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


/* ============================================================
   🚀 10. ページ読み込み時の初期化
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderEventCards();

  // ナビゲーション・ボタンのクリック (data-page属性を持つ全要素)
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(el.dataset.page);
    });
  });

  // タブのクリック
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // AI分析ボタン
  document.getElementById('aiAnalyzeBtn')?.addEventListener('click', runAIAnalysis);

  // 共同表現の登録ボタン
  document.getElementById('submitNarrative')?.addEventListener('click', submitSharedNarrative);

  console.log('🎌 Shared Memory Project (日本語版) 読み込み完了');
  console.log(`📚 登録された事件: ${eventsData.length}件`);
});
