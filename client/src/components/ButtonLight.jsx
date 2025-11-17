export function ButtonLight({ label, className }) {
  return (
    <button
      className={`
        uppercase py-2 px-6 rounded-xl
        border-2 border-[#F0A322]
        bg-[#FFEAD5]
        text-[#442314c8]
        shadow-[4px_4px_0_#F0A322]
        active:shadow-none active:translate-x-1 active:translate-y-1
        transition-all duration-150
        ${className}
      `}
    >
      <span className="text-lg nunito-bold">{label}</span>
    </button>
  );
}
