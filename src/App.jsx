import { useEffect, useState } from "react";
import { getArticle, generateDebate } from "./mock/mockAPI.jsx";
import TopicChips from "./components/TopicChips.jsx";
import MessageList from "./components/MessageList.jsx";
import "./App.css";
import Navigator from "./components/Navigator/Navigator.jsx";
export default function Debate() {

  const [rounds, setRounds] = useState(1);
  const [teamSize] = useState(3);
  const [userPosition, setUserPosition] = useState(null);
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
        const doc = await getArticle();   // ✅ no articleId needed; loads /News.html
        setArticle(doc);
      } catch (e) {
        console.error(e);
        setArticle(null);
      } finally {
        setLoadingArticle(false);
      }
    })();
  }, []); // ✅ load once on mount

  const onGenerate = async () => {
    try {
      setDebateLoading(true);
      setDebateError("");
      const res = await generateDebate({
        // numRounds: rounds, // you can re-enable if your mock uses it
        numRounds: 1,
        teamSize,
        userPosition,        // ✅ only thing we pass now
      });
      setDebate(res);
      setShowChat(true);
    } catch (e) {
      setDebateError(e.message || String(e));
    } finally {
      setDebateLoading(false);
    }
  };

  const topics = debate?.topics ?? [];
  const agents = debate?.agents ?? [];
  const messages = debate?.messages ?? [];

  return (
    <>
    <Navigator />   {/* add this line */}
    <div className="debate-page">
      <div className="debate-body">
        <div className="control-bar">
          <button
            onClick={() => setShowChat((s) => !s)}
            // title={showChat ? "チャットを隠す" : "チャットを表示"}
            title={showChat ? "Hide Chat" : "Show Chat"}
          >
            {/* {showChat ? "チャットを隠す" : "チャットを表示"} */}
            {showChat ? "Hide Chat" : "Show Chat"}
          </button>
        </div>

        {debateError && (
          <div style={{ color: "crimson", marginBottom: 12 }}>
            Error: {debateError}
          </div>
        )}

        <div className={`debate-container ${showChat ? "split" : "single"}`}>
          {/* Article panel */}
          <section className="panel">
            <div className="panel-header">
              {/* <strong>ニュース記事</strong> */}
              <strong>News Article</strong>
            </div>
            <div className="panel-body">
              {loadingArticle && <div>Loading article…</div>}
              {!loadingArticle && !article && (
                <div style={{ color: "#999" }}>Article not found.</div>
              )}
              {article && (
                <>
                  <h3 style={{ margin: "0 0 6px" }}>{article.title}</h3>
                  <div className="meta">
                    {article.source} • {article.topic} •{" "}
                    {article.date ? new Date(article.date).toLocaleDateString() : ""}
                  </div>
                  <div
                    style={{ whiteSpace: "pre-wrap", marginTop: 12, lineHeight: 1.6 }}
                  >
                    {article.content_original || article.content || "(No content)"}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Debate panel */}
          {showChat && (
            <section className="panel">
              <div className="panel-header">
                {/* <strong>意見生成チャット</strong> */}
                <strong>Generate Opinion</strong>
              </div>
              <div className="panel-body">
                {!debate ? (
                  <div className="debate-controls">
                    <div className="control-row">
                      <p className="toggle-question">
                        {/* <strong>{article?.topic || article?.title || "this article"}</strong>{" "}
                        について賛成ですか？反対ですか？ */}
                        Do you support or oppose <strong>{"Nuclear Energy"}</strong>?
                      </p>
                      <div className="toggle-buttons">
                        <button
                          className={userPosition === "agree" ? "active" : ""}
                          onClick={() => setUserPosition("agree")}
                        >
                          Support
                        </button>
                        <button
                          className={userPosition === "disagree" ? "active" : ""}
                          onClick={() => setUserPosition("disagree")}
                        >
                          Oppose
                        </button>
                      </div>
                    </div>

                    <div className="control-row">
                      <button
                        className="generate-btn"
                        onClick={onGenerate}
                        disabled={debateLoading || !userPosition}
                      >
                        {/* {debateLoading ? "生成中..." : "意見を生成"} */}
                        {debateLoading ? "生成中..." : "Generate Opinion"}
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
                      <div><div className="team-title">Support</div></div>
                      <div><div className="team-title right">Against</div></div>
                    </div>

                    <MessageList agents={agents} messages={messages} />
                    {/* <p>キーワード: ワニ</p> */}
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
