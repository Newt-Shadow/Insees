export default function Accessibility({ active }: { active: boolean }) {
  return (
    <div className="sr-only" aria-live="polite">
      {active ? "Celebration overlay active" : ""}
    </div>
  );
}
