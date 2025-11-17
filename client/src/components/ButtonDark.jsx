export function ButtonDark({ label, className }) {
  return (
    <button
      className={`
        uppercase py-2 px-6 rounded-xl
        border-2 border-[#FFE9D5]
        bg-[#442314]
        text-[#FFE9D5]
        shadow-[4px_4px_0_#FFE9D5]
        active:shadow-none active:translate-x-1 active:translate-y-1
        transition-all duration-150
        ${className}
      `}
    >
      <span className="text-lg nunito-bold">{label}</span>
    </button>
  );
}
