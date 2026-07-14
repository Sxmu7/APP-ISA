export default function AnimatedHeadline({ text, tag = "h1", className = "", style = {}, delayStart = 0 }) {
  const words = text.split(" ");
  const Tag = tag;

  return (
    <Tag className={`animated-headline ${className}`} style={style}>
      {words.map((word, i) => (
        <span key={i} className="ah-word" style={{ animationDelay: `${delayStart + i * 0.09}s` }}>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
