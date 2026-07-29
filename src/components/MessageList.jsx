export default function MessageList({
  agents = [],
  messages = [],
  status = null,
}) {
  const getAgentByIndex = (idx) => agents[idx] || null;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {messages.map((m, i) => {
        const agent =
          typeof m.agentIndex === "number"
            ? getAgentByIndex(m.agentIndex)
            : null;

        const side = m.side || agent?.side || "left";
        const who = m.speaker || agent?.name || "Agent";

        const alignSelf = side === "right" ? "end" : "start";
        const bg = side === "right" ? "#ed8989ff" : "#80b7f2ff";
        const border = side === "right" ? "#ed8989ff" : "#80b7f2ff";

        return (
          <div
            key={i}
            style={{
              justifySelf: alignSelf,
              maxWidth: "78%",
              border: `1px solid ${border}`,
              borderRadius: 10,
              padding: 12,
              fontSize: 13,
              background: bg,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "white",
                marginBottom: 6,
              }}
            >
              <strong>{who}</strong>
            </div>

            <div style={{ lineHeight: 1.5 }}>
              {m.text}
            </div>
          </div>
        );
      })}

      {status?.type === "system" && (
        <div
          style={{
            justifySelf: "center",
            padding: "8px 14px",
            borderRadius: 8,
            background: "#f3f4f6",
            color: "#555",
            fontSize: 14,
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {status.text}
        </div>
      )}

      {status?.type === "agent" && (
        <div
          style={{
            justifySelf: status.side === "right" ? "end" : "start",
            maxWidth: "78%",
            border: `1px solid ${
              status.side === "right" ? "#ed8989ff" : "#80b7f2ff"
            }`,
            borderRadius: 10,
            padding: 12,
            fontSize: 13,
            background:
              status.side === "right" ? "#ed8989ff" : "#80b7f2ff",
            opacity: 0.75,
            fontStyle: "italic",
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "white",
              marginBottom: 6,
            }}
          >
            <strong>{status.speaker}</strong>
          </div>

          <div style={{ lineHeight: 1.5 }}>
            {status.text || "Thinking..."}
          </div>
        </div>
      )}
    </div>
  );
}