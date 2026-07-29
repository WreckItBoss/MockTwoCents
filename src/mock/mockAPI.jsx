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
      name: "Support",
      side: "left",
      stance: "support",
    },
    {
      name: "Oppose",
      side: "right",
      stance: "oppose",
    },
  ];

  const messages = [
    // ======================== Round 1 ========================
    {
      speaker: "Support",
      agentIndex: 0,
      side: "left",
      stance: "support",
      round: 1,
      text: "Add the first Support message here.",
    },
    {
      speaker: "Oppose",
      agentIndex: 1,
      side: "right",
      stance: "oppose",
      round: 1,
      text: "Add the first Oppose message here.",
    },

    // ======================== Round 2 ========================
    {
      speaker: "Support",
      agentIndex: 0,
      side: "left",
      stance: "support",
      round: 2,
      text: "Add the second Support message here.",
    },
    {
      speaker: "Oppose",
      agentIndex: 1,
      side: "right",
      stance: "oppose",
      round: 2,
      text: "Add the second Oppose message here.",
    },

    // ======================== Round 3 ========================
    {
      speaker: "Support",
      agentIndex: 0,
      side: "left",
      stance: "support",
      round: 3,
      text: "Add the third Support message here.",
    },
    {
      speaker: "Oppose",
      agentIndex: 1,
      side: "right",
      stance: "oppose",
      round: 3,
      text: "Add the third Oppose message here.",
    },
  ];

  return {
    topics: [],
    agents,
    messages,
  };
}