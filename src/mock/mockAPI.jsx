// src/mock/mockAPI.jsx

export async function getArticle() {
  // const res = await fetch("/SelfDrivingCars.html");
  const res = await fetch("/NuclearEnergy.html");
  // const res = await fetch("/Surveillance.html");

  if (!res.ok) {
    throw new Error("Failed to load article");
  }

  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  const title =
    doc.querySelector("header h1")?.textContent.trim() ?? "Untitled";

  const metaText =
    doc.querySelector(".meta")?.textContent.trim() ?? "";

  const parts = metaText.split("・").map((part) => part.trim());

  const source = parts[0] || "";
  const topic = parts[1] || "";
  const date = parts[2] || null;

  const articleEl = doc.querySelector("article");

  const content = articleEl
    ? articleEl.textContent.trim()
    : "(No content)";

  return {
    id: "news-1",
    title,
    source,
    topic,
    date,
    content,
  };
}

export async function generateDebate({ userPosition } = {}) {
  // Small delay to imitate generation
  await new Promise((resolve) => setTimeout(resolve, 600));

  const agents = [
    {
      name: "データセンター運営会社の電力調達責任者",
      side: "left",
      stance: "support",
    },
    {
      name: "原発立地自地域の住民団体代表",
      side: "right",
      stance: "oppose",
    },
  ];

  const messages = [
    // ======================== Round 1 ========================
    {
      speaker: "データセンター運営会社の電力調達責任者",
      agentIndex: 0,
      side: "left",
      stance: "support",
      round: 1,
      text: "データセンターの電力調達をしている立場から言うと、記事の「賛否より必要性」という見方はかなり現実に近いです。AI向けのサーバーは、夜も雨の日も止められません。太陽光や風力を否定しているのではなく、あれだけで24時間の大電力を約束するのは難しい、という話です。足りない分を火力で埋めれば脱炭素に逆行します。安全審査や地域合意は当然必要ですが、原子力を最初から外すのは、安定供給と低炭素の両方を狭めます。",
    },
    {
      speaker: "原発立地自地域の住民団体代表",
      agentIndex: 1,
      side: "right",
      stance: "oppose",
      round: 1,
      text: "記事は「賛否でなく必要性」と言いますが、立地地域に住む私たちから見ると、その聞き方自体がずるいんです。AIやデータセンターに電気が要る、だから川内に新しい炉を、という話になる。でも事故時に避難するのは都市のIT企業ではなく、私たち高齢者や子どもです。田畑、漁場、家、墓まで失うかもしれない。必要性を問うなら、まず「そのリスクを誰が引き受けるのか」を同じ重さで聞くべきです。",
    },

    // ======================== Round 2 ========================
    {
      speaker: "データセンター運営会社の電力調達責任者",
      agentIndex: 0,
      side: "left",
      stance: "support",
      round: 2,
      text: "その不安は当然です。記事も「必要性」を言うなら、そこをもっと正面から書くべきでした。でも、だから原子力を外す、とは私は思いません。データセンター側も受益者ですから、安い電気だけ買って終わりではなく、立地地域の避難計画、訓練、医療・交通、補償基金まで電力契約の条件に入れるべきです。必要性とリスク負担はセットです。むしろ見える形で負担を分ける議論に進めるべきです。",
    },
    {
      speaker: "原発立地自地域の住民団体代表",
      agentIndex: 1,
      side: "right",
      stance: "oppose",
      round: 2,
      text: "エネルギー調達責任者さんの「負担も契約に入れる」という提案は、少なくとも記事より誠実だと思います。でも正直、補償基金で戻らないものがあるんです。避難が長引けば、集落のつながり、農地の信用、漁業の販路、子どもの通学先まで壊れる。訓練しても、台風や地震と重なった時に高齢者を本当に動かせるのか。データセンターの電気が止められないから、住民の暮らしを担保にする。それって本当に公平でしょうか。",
    },

    // ======================== Round 3 ========================
    {
      speaker: "Support",
      agentIndex: 0,
      side: "left",
      stance: "support",
      round: 3,
      text: "正直、その「戻らないもの」は軽く見てはいけません。記事はデータセンター需要を強く出す一方で、地域の生活リスクの書き方が薄い。そこは弱点です。でも「リスクがあるから原子力なし」にすると、火力依存、燃料高、停電リスク、脱炭素遅れを全国に広げます。公平性は、川内ありきではなく、避難できる道路・病院・受け入れ先まで検証し、満たせないなら進めない。ただし原子力という選択肢自体は残すべきです。",
    },
    {
      speaker: "Oppose",
      agentIndex: 1,
      side: "right",
      stance: "oppose",
      round: 3,
      text: "エネルギー調達責任者さんの言う「満たせないなら進めない」は大事です。でも現場では、いったん記事のように「AI社会に必要」と大きな話にされると、避難計画の穴は後から埋める扱いになりがちです。道路も病院も受け入れ先も、紙の計画と災害時の現実は違う。火力や停電のリスクは全国で議論すべきですが、原発事故の損害は土地に縛られた住民へ集中します。選択肢として残すだけでも、立地地域には強い圧力なんです。",
    },
  ];

  return {
    topics: [],
    agents,
    messages,
  };
}