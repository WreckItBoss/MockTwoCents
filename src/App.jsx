import { useEffect, useState } from "react";
import { getArticle, generateDebate } from "./mock/mockAPI.jsx";
import TopicChips from "./components/TopicChips.jsx";
import MessageList from "./components/MessageList.jsx";
import "./App.css";
import Navigator from "./components/Navigator/Navigator.jsx";

export default function Debate() {
  const [status, setStatus] = useState(null);
  const [rounds] = useState(3);
  const [teamSize] = useState(1);
  // const [userPosition, setUserPosition] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const [article, setArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [debateLoading, setDebateLoading] = useState(false);
  const [debateError, setDebateError] = useState("");
  const [debate, setDebate] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingArticle(true);

        const doc = await getArticle();

        setArticle(doc);
      } catch (e) {
        console.error(e);
        setArticle(null);
      } finally {
        setLoadingArticle(false);
      }
    })();
  }, []);

  const wait = (milliseconds) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };

  const onGenerate = async () => {
    try {
      setDebateLoading(true);
      setDebateError("");
      setStatus(null);

      const res = await generateDebate({
        numRounds: rounds,
        teamSize,
        // userPosition,
      });

      const allMessages = res.messages ?? [];

      // Show the debate panel with no messages yet.
      setDebate({
        ...res,
        messages: [],
      });

      setShowChat(true);

      // Display "Creating agents..." in the center.
      setStatus({
        type: "system",
        text: "Creating agents...",
      });

      await wait(1500);

      // Display "Agents created." in the center.
      setStatus({
        type: "system",
        text: "Agents created.",
      });

      await wait(1000);

      setStatus(null);

      // Reveal each predefined message one at a time.
      for (const message of allMessages) {
        const agent =
          typeof message.agentIndex === "number"
            ? res.agents?.[message.agentIndex]
            : null;

        const speaker = message.speaker || agent?.name || "Agent";
        const side = message.side || agent?.side || "left";

        // Display the thinking bubble on the agent's side.
        setStatus({
          type: "agent",
          speaker,
          side,
          text: `${speaker} is thinking...`,
        });

        await wait(1000);

        setStatus(null);

        // Add the completed message.
        setDebate((current) => ({
          ...current,
          messages: [...current.messages, message],
        }));

        await wait(400);
      }
    } catch (e) {
      setDebateError(e.message || String(e));
      setStatus(null);
    } finally {
      setDebateLoading(false);
    }
  };

  const topics = debate?.topics ?? [];
  const agents = debate?.agents ?? [];
  const messages = debate?.messages ?? [];

  return (
    <>
      <Navigator />

      <div className="debate-page">
        <div className="debate-body">
          <div className="control-bar">
            <button
              onClick={() => setShowChat((s) => !s)}
              title={showChat ? "Hide Chat" : "Show Chat"}
            >
              {showChat ? "Hide Chat" : "Show Chat"}
            </button>
          </div>

          {debateError && (
            <div style={{ color: "crimson", marginBottom: 12 }}>
              Error: {debateError}
            </div>
          )}

          <div
            className={`debate-container ${showChat ? "split" : "single"}`}
          >
            {/* Article panel */}
            <section className="panel">
              <div className="panel-header">
                <strong>News Article</strong>
              </div>

              <div className="panel-body">
                {loadingArticle && <div>Loading article…</div>}

                {!loadingArticle && !article && (
                  <div style={{ color: "#999" }}>
                    Article not found.
                  </div>
                )}

                {article && (
                  <>
                    <h3 style={{ margin: "0 0 6px" }}>
                      {article.title}
                    </h3>

                    <div className="meta">
                      {article.source} • {article.topic} •{" "}
                      {article.date
                        ? new Date(article.date).toLocaleDateString()
                        : ""}
                    </div>

                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        marginTop: 12,
                        lineHeight: 1.6,
                      }}
                    >
                      {article.content_original ||
                        article.content ||
                        "(No content)"}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Debate panel */}
            {showChat && (
              <section className="panel">
                <div className="panel-header">
                  <strong>Generate Opinion</strong>
                </div>

                <div className="panel-body">
                  {!debate ? (
                    <div className="debate-controls">
                      <div className="control-row">
                        <button
                          className="generate-btn"
                          onClick={onGenerate}
                          disabled={debateLoading}
                        >
                          {debateLoading
                            ? "生成中..."
                            : "意見を生成する"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <TopicChips topics={topics} />

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                          marginBottom: 12,
                        }}
                      >
                        <div>
                          <div className="team-title">
                            Support
                          </div>
                        </div>

                        <div>
                          <div className="team-title right">
                            Oppose
                          </div>
                        </div>
                      </div>

                      <div className="chat-divider" />
                      
                      <MessageList
                        agents={agents}
                        messages={messages}
                        status={status}
                      />
                    </>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}