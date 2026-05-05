import { useState } from "react";
import msgpack from "msgpack-lite";
import protobuf from "protobufjs";

export default function App() {
  const [results, setResults] = useState([]);

  // 🔹 Protobuf Schema (no file loading issues)
  const root = protobuf.Root.fromJSON({
    nested: {
      User: {
        fields: {
          id: { type: "int32", id: 1 },
          name: { type: "string", id: 2 },
          email: { type: "string", id: 3 },
          interests: { rule: "repeated", type: "string", id: 4 },
          active: { type: "bool", id: 5 },
        },
      },
      UserList: {
        fields: {
          users: { rule: "repeated", type: "User", id: 1 },
        },
      },
    },
  });

  const UserList = root.lookupType("UserList");

  const fetchData = async (type) => {
    const start = performance.now();

    const res = await fetch(`http://localhost:5000/${type}`);
    const buffer = await res.arrayBuffer();
    const size = res.headers.get("X-Size") || "0";
    const serverTime = res.headers.get("X-Time") || "0";

    const end = performance.now();

    let parsed;

    if (type === "json") {
      parsed = JSON.parse(new TextDecoder().decode(buffer));
    } else if (type === "msgpack") {
      parsed = msgpack.decode(new Uint8Array(buffer));
    } else if (type === "protobuf") {
      parsed = UserList.decode(new Uint8Array(buffer));
    }

    setResults((prev) => [
      ...prev,
      {
        type: type.toUpperCase(),
        size: Number(size).toLocaleString(),
        serverTime: Number(serverTime).toFixed(2),
        latency: (end - start).toFixed(2),
      },
    ]);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>API Serialization Benchmark</h1>
      <p style={styles.subtitle}>JSON vs MessagePack vs Protobuf</p>

      <div style={styles.buttonRow}>
        <button style={styles.btnJSON} onClick={() => fetchData("json")}>
          Fetch JSON
        </button>
        <button style={styles.btnMP} onClick={() => fetchData("msgpack")}>
          Fetch MessagePack
        </button>
        <button style={styles.btnPB} onClick={() => fetchData("protobuf")}>
          Fetch Protobuf
        </button>
      </div>

      <div style={styles.card}>
        <h2>Results</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Format</th>
              <th>Size (bytes)</th>
              <th>Server Time (ms)</th>
              <th>Latency (ms)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#1f2937" : "transparent" }}>
                <td style={{ textAlign: "center", color: r.type === "JSON" ? "#f97316" : r.type === "MSGPACK" ? "#22c55e" : "#3b82f6" }}>{r.type}</td>
                <td style={{ textAlign: "center" }}>{r.size}</td>
                <td style={{ textAlign: "center" }}>{r.serverTime}</td>
                <td style={{ textAlign: "center" }}>{r.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <h2>Insight</h2>
        <p style={{ color: "#22c55e" }}>
          Smaller payload = faster APIs + better scalability
        </p>
      </div>
    </div>
  );
}

// 🎨 Styles (Clean dashboard look)
const styles = {
  container: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    padding: "40px",
    fontFamily: "Inter, sans-serif",
  },
  title: {
    fontSize: "28px",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#9ca3af",
    marginBottom: "20px",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "25px",
  },
  btnJSON: {
    background: "#f97316",
    border: "none",
    padding: "10px 16px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnMP: {
    background: "#22c55e",
    border: "none",
    padding: "10px 16px",
    color: "black",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnPB: {
    background: "#3b82f6",
    border: "none",
    padding: "10px 16px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
  card: {
    background: "#111827",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    borderBottom: "1px solid #374151",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #1f2937",
  },
};