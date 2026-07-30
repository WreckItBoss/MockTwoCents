import { useEffect, useState } from "react";
import { getArticle, generateDebate } from "./mock/mockAPI.jsx";
import MessageList from "./components/MessageList.jsx";
import "./App.css";
import Navigator from "./components/Navigator/Navigator.jsx";

const MOCK_TOPIC = "Nuclear Energy";

export default function Debate() {
  const [status, setStatus] = useState(null);
  const [rounds] = useState(3);
  const [teamSize] = useState(1);
  const [showChat, setShowChat] = useState(false);

  const [article, setArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [debateLoading, setDebateLoading] = useState(false);
  const [debateError, setDebateError] = useState("");
  const [debate, setDebate] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoadingArticle(true);

        const doc = await getArticle();
        setArticle(doc);
      } catch (error) {
        console.error(error);
        setArticle(null);
      } finally {
        setLoadingArticle(false);
      }
    };

    loadArticle();
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

      const response = await generateDebate({
        numRounds: rounds,
        teamSize,
      });

      const allMessages = response.messages ?? [];
      const allAgents = response.agents ?? [];

      /*
       * Open the generated debate view, but initially keep
       * the agents and messages hidden.
       */
      setDebate({
        ...response,
        agents: [],
        messages: [],
      });

      setShowChat(true);

      /*
       * Phase 1: Creating agents
       */
      setStatus({
        type: "system",
        text: "Creating agents",
      });

      await wait(1500);

      /*
       * Phase 2: Agents created
       *
       * The team badges are added here.
       */
      setDebate((current) => ({
        ...current,
        agents: allAgents,
      }));

      setStatus({
        type: "system",
        text: "Agents created.",
      });

      await wait(1200);

      /*
       * Phase 3: Preparing debate
       */
      setStatus({
        type: "system",
        text: "Preparing debate",
      });

      await wait(1200);

      setStatus(null);

      /*
       * Phase 4: Reveal each message one at a time.
       */
      for (const message of allMessages) {
        const agent =
          typeof message.agentIndex === "number"
            ? allAgents[message.agentIndex]
            : allAgents.find(
                (candidate) =>
                  candidate.name === message.speaker,
              );

        const speaker =
          message.speaker ||
          agent?.name ||
          "Agent";

        const stance =
          message.stance ||
          agent?.stance ||
          (message.side === "right" ||
          agent?.side === "right"
            ? "oppose"
            : "support");

        /*
         * Display the thinking bubble.
         */
        setStatus({
          type: "agent",
          speaker,
          stance,
        });

        await wait(1000);

        setStatus(null);

        /*
         * Add the finished message.
         */
        setDebate((current) => ({
          ...current,
          messages: [
            ...current.messages,
            {
              ...message,
              speaker,
              stance,
            },
          ],
        }));

        await wait(400);
      }
    } catch (error) {
      console.error(error);

      setDebateError(
        error.message || "Debate generation failed.",
      );

      setStatus(null);
    } finally {
      setDebateLoading(false);
    }
  };

  const agents = debate?.agents ?? [];
  const messages = debate?.messages ?? [];

  const supportAgents = agents.filter(
    (agent) =>
      agent.stance === "support" ||
      agent.side === "left",
  );

  const opposeAgents = agents.filter(
    (agent) =>
      agent.stance === "oppose" ||
      agent.side === "right",
  );

  return (
    <>
      <Navigator />

      <div className="debate-page">
        <div className="debate-body">
          <div className="control-bar">
            <button
              onClick={() =>
                setShowChat((current) => !current)
              }
              title={
                showChat ? "Hide Chat" : "Show Chat"
              }
            >
              {showChat ? "Hide Chat" : "Show Chat"}
            </button>
          </div>

          {debateError && (
            <div className="debate-error">
              Error: {debateError}
            </div>
          )}

          <div
            className={`debate-container ${
              showChat ? "split" : "single"
            }`}
          >
            {/* Article panel */}
            <section className="panel">
              <div className="panel-header">
                <strong>News Article</strong>
              </div>

              <div className="panel-body">
                {loadingArticle && (
                  <div>Loading article...</div>
                )}

                {!loadingArticle && !article && (
                  <div className="empty-state">
                    Article not found.
                  </div>
                )}

                {article && (
                  <>
                    <h3 className="article-title">
                      {article.title}
                    </h3>

                    <div className="meta">
                      {article.source} • {article.topic} •{" "}
                      {article.date
                        ? new Date(
                            article.date,
                          ).toLocaleDateString()
                        : ""}
                    </div>

                    <div className="article-content">
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
                          type="button"
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
                      <div className="topic-header">
                        <span className="topic-label">
                          Topic:
                        </span>{" "}
                        <span className="topic-name">
                          {MOCK_TOPIC}
                        </span>
                      </div>

                      <div className="team-columns">
                        <div>
                          <div className="team-title">
                            Support
                          </div>

                          <div className="team">
                            {supportAgents.map(
                              (agent, index) => (
                                <div
                                  key={`support-${agent.name}-${index}`}
                                  className="agent-badge support"
                                >
                                  {agent.name}
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="team-title right">
                            Oppose
                          </div>

                          <div className="team right">
                            {opposeAgents.map(
                              (agent, index) => (
                                <div
                                  key={`oppose-${agent.name}-${index}`}
                                  className="agent-badge oppose"
                                >
                                  {agent.name}
                                </div>
                              ),
                            )}
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