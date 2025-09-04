import { useEffect, useState } from "react";

export default function Headline({ text }: { text: string }) {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setTyped(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [text]);

  return (
    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
      {typed}
      <span className="animate-pulse">|</span>
    </h1>
  );
}
