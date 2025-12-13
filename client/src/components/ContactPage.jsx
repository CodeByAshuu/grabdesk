import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Women");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("https://formspree.io/f/mgvglkjr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#3c261f] text-[#f5e6d3] p-8 font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('/images/paper-texture.jpg')" }}
    >
      <header className="text-center mb-12 animate-fade-in">

        
        <div className="flex justify-center gap-3 text-xs tracking-widest text-[#f5e6d3] uppercase mb-10">

          {["Women", "Men", "Lookbook", "About Us"].map((item) => (
            <div
              key={item}
              onClick={() => setActiveMenu(item)}
              className={`px-4 py-2 cursor-pointer border-2 rounded-lg transition-all duration-300 font-semibold tracking-wider ${
                activeMenu === item
                  ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/50"
                  : "border-[#f5e6d3] hover:border-orange-500 hover:shadow-[0_0_15px_#ff8c0040]"
              }`}
            >
              {item}
            </div>
          ))}

        </div>

        <h1 className="text-7xl font-extrabold font-avant font-bold tracking-wide drop-shadow-lg">CONTACT US</h1>
        <p className="text-[#d4c5b9] mt-3 tracking-widest text-sm">We'd love to hear from you</p>
      </header>

      <section className="max-w-5xl mx-auto space-y-16">

        
        <div className="border-b border-[#6b4a3f] pb-6 hover:bg-[#2a1a15]/30 transition-all duration-300 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-orange-400">LONDON</h2>

            <div className="space-y-3 text-left w-1/2">
              <p className="flex items-center hover:text-orange-400 transition"><i className="fas fa-phone text-orange-500" style={{marginRight: '8px', minWidth: '20px'}}></i>+44 (0)20 7123 4567</p>
              <p className="flex items-center hover:text-orange-400 transition"><i className="fas fa-envelope text-orange-500" style={{marginRight: '8px', minWidth: '20px'}}></i>london@fadedandfound.com</p>
              <p className="flex items-start hover:text-orange-400 transition">
                <i className="fas fa-map-marker-alt text-orange-500" style={{marginRight: '8px', marginTop: '2px', minWidth: '20px'}}></i>14 Rosewood Lane, Shoreditch,
                <br /> London E2 7QJ, United Kingdom
              </p>
            </div>
          </div>
        </div>

       
        <div className="pb-6 hover:bg-[#2a1a15]/30 transition-all duration-300 p-4 rounded-lg">
          <div className="flex justify-between items-start mt-8">
            <h2 className="text-3xl font-bold text-orange-400">MANCHESTER</h2>

            <div className="space-y-3 text-left w-1/2">
              <p className="flex items-center hover:text-orange-400 transition"><i className="fas fa-phone text-orange-500" style={{marginRight: '8px', minWidth: '20px'}}></i>+44 (0)161 234 5678</p>
              <p className="flex items-center hover:text-orange-400 transition"><i className="fas fa-envelope text-orange-500" style={{marginRight: '8px', minWidth: '20px'}}></i>manchester@fadedandfound.com</p>
              <p className="flex items-start hover:text-orange-400 transition">
                <i className="fas fa-map-marker-alt text-orange-500" style={{marginRight: '8px', marginTop: '2px', minWidth: '20px'}}></i>22 Whitmore Street, Northern Quarter,
                <br /> Manchester M4 1LX, United Kingdom
              </p>
            </div>
          </div>
        </div>

        
        <div className="flex justify-between items-start gap-12">

          <div className="w-1/2 space-y-10">
            <div className="space-y-4 bg-[#2a1a15]/40 p-6 rounded-xl border-l-4 border-orange-500 hover:bg-[#2a1a15]/60 transition">
              <h3 className="text-2xl text-orange-400 font-bold flex items-center"><i className="fas fa-envelope-open-text mr-3"></i>Contact Us</h3>
              <p className="leading-relaxed">
                At Faded&Found, we believe every conversation matters. Whether you're
                searching for the perfect piece, need help with an order, or simply want
                to share your thoughts, our team is always here for you. You can reach us
                directly at our London and Manchester boutiques.
              </p>
            </div>

            <div className="space-y-4 bg-[#2a1a15]/40 p-6 rounded-xl border-l-4 border-orange-500 hover:bg-[#2a1a15]/60 transition">
              <h3 className="text-2xl text-orange-400 font-bold flex items-center"><i className="fas fa-briefcase mr-3"></i>Job Applications</h3>
              <p className="leading-relaxed">
                We're always looking for passionate people who share our love for
                timeless style. If you're interested in joining the Faded&Found team,
                send your CV and a short cover letter to the store you'd like to apply
                for. We'll be in touch if there's a role that feels like the right fit.
              </p>
            </div>
          </div>

          
          <div className="w-1/2 group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-500">
              <img
                src="https://i.pinimg.com/1200x/d3/3c/c5/d33cc576988273862180667a5dded4ef.jpg"
                alt="Contact Collage"
                className="w-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#4a2d26]/80 to-[#2a1a15]/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300">

          <h3 className="text-3xl font-bold mb-2 text-center tracking-wide text-orange-400 flex items-center justify-center gap-2">
            <i className="fas fa-paper-plane"></i>
            Send Us a Message
          </h3>
          <p className="text-center text-[#d4c5b9] text-sm mb-8">We'll get back to you within 24 hours</p>

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 flex items-center gap-2 animate-pulse">
              <i className="fas fa-check-circle"></i>
              <span>Message sent successfully! Thank you for reaching out.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
           
            <div>
              <label className="block mb-2 font-semibold text-sm text-orange-300 flex items-center gap-2">
                <i className="fas fa-user text-orange-500"></i>Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg bg-[#f5e6d3] text-black outline-none shadow-inner transition ${
                  errors.name ? "border-2 border-red-500" : "hover:shadow-md"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i>{errors.name}</p>}
            </div>

            
            <div>
              <label className="block mb-2 font-semibold text-sm text-orange-300 flex items-center gap-2">
                <i className="fas fa-envelope text-orange-500"></i>Your Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg bg-[#f5e6d3] text-black outline-none shadow-inner transition ${
                  errors.email ? "border-2 border-red-500" : "hover:shadow-md"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i>{errors.email}</p>}
            </div>

          
            <div>
              <label className="block mb-2 font-semibold text-sm text-orange-300 flex items-center gap-2">
                <i className="fas fa-message text-orange-500"></i>Message
              </label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg bg-[#f5e6d3] text-black outline-none shadow-inner transition resize-none ${
                  errors.message ? "border-2 border-red-500" : "hover:shadow-md"
                }`}
                placeholder="Tell us what's on your mind..."
              ></textarea>
              {errors.message && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i>{errors.message}</p>}
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-300 text-white 
                         py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/50 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-send"></i>
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

      </section>
    </div>
  );
}
