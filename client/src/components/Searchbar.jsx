// components/Searchbar.jsx
function Searchbar({ value = "", onChange, width = "100%", height = "45px", placeholder = "Search..." }) {
    return (
        <>
            <div className="mx-auto" style={{ width }}>
                <div 
                    className="rounded-md border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41] bg-[#FFE9D5] flex items-center px-3 gap-2"
                    style={{ height }}
                >
                    {/* <svg xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-[#452215]"
                        viewBox="0 -960 960 960" fill="#452215">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109
                         0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5
                         T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                    </svg> */}

                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-full bg-transparent outline-none text-[#452215] placeholder-[#8F5E41]"
                        placeholder={placeholder}
                    />
                </div>
            </div>
        </>
    );
}
export default Searchbar;