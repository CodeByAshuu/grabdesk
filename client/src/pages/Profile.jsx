import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
const Profile = () => {
    return (
        <>
            <section className="min-h-screen w-full overflow-hidden text-[#5b3d25]"
                style={{
                    backgroundColor: "#f3eadc",
                    backgroundImage:
                        "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
                    backgroundSize: "14px 24px",
                }} >
                <Navbar />
                <div className="my-8 sm:my-10 md:my-12 lg:my-14 mx-4 sm:mx-5">
                    <h1 className="boldonse-bold  text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                        PROFILE
                    </h1>
                </div>
                <div className="w-full border border-dashed"></div>
                <div className="grid grid-cols-3">
                    {/*Profile image */}
                    <div>

                    </div>

                </div>

            </section>
        </>
    )
}
export default Profile;