import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ContactPage from "../components/ContactPage";
function Contact(){
    return (
        <>
        <section>
            <Navbar/>
            <ContactPage />
        </section>
        </>
    )
}
export default Contact;