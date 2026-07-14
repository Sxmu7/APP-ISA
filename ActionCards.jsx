import { useState } from "react";
import { Pencil, Upload, Plus, Trash2, FileText } from "lucide-react";
import LoadingBar from "./LoadingBar.jsx";

function ManualEntryCard() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [items, setItems] = useState([]);

  function addItem(e) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setItems((prev) => [...prev, { id: Date.now(), question, answer }]);
    setQuestion("");
    setAnswer("");
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="card">
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          all: "unset",
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          cursor: "pointer",
        }}
      >
        <Pencil size={18} color="var(--accent)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Frage eintippen</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            {items.length > 0 ? `${items.length} manuell hinzugefügt` : "Manuell hinzufügen"}
          </div>
        </div>
      </button>

      {open && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <form onSubmit={addItem} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              className="field"
              placeholder="Frage"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <input
              className="field"
              placeholder="Antwort"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button type="submit" className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }}>
              <Plus size={14} />
              Hinzufügen
            </button>
          </form>

          {items.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              {items.map((i) => (
                <div
                  key={i.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "8px 12px",
                  }}
                >
                  <div style={{ fontSize: 13 }}>
                    <strong style={{ fontWeight: 600 }}>{i.question}</strong>
                    <span style={{ color: "var(--text-secondary)" }}> — {i.answer}</span>
                  </div>
                  <button
                    onClick={() => removeItem(i.id)}
                    style={{ all: "unset", cursor: "pointer", color: "var(--text-muted)" }}
                    aria-label="Löschen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UploadCard() {
  const [fileName, setFileName] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("processing");
    setProgress(0);
    requestAnimationFrame(() => {
      setTimeout(() => setProgress(80), 150);
      setTimeout(() => {
        setProgress(100);
        setStatus("queued");
      }, 1300);
    });
  }

  return (
    <div className="card">
      <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <Upload size={18} color="var(--accent)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Datei hochladen</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>PDF, DOCX, XLSX, TXT</div>
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.xlsm,.txt"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </label>

      {fileName && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <FileText size={14} color="var(--text-secondary)" />
            <span style={{ color: "var(--text-primary)" }}>{fileName}</span>
          </div>
          <LoadingBar
            progress={progress}
            label={status === "queued" ? "In Warteschlange — Themen-Import folgt in Kürze" : "Datei wird verarbeitet…"}
          />
        </div>
      )}
    </div>
  );
}

export default function ActionCards() {
  return (
    <div className="action-grid">
      <ManualEntryCard />
      <UploadCard />
    </div>
  );
}
