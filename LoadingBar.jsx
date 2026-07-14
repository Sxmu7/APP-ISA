export default function LoadingBar({ progress, label }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div className="loading-track">
        <div className="loading-fill" style={{ width: `${progress}%` }} />
      </div>
      {label && (
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{label}</div>
      )}
    </div>
  );
}
