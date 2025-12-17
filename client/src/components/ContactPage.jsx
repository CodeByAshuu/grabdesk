import { useState } from "react";

const PhoneIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12 1.05.4 2.07.83 3.03a2 2 0 0 1-.45 2.11L9.91 11.09a16 16 0 0 0 6 6l1.23-1.23a2 2 0 0 1 2.11-.45c.96.43 1.98.71 3.03.83A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16v16H4z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LocationIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 6-9 11-9 11s-9-5-9-11a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      {/* HEADER */}
      <header className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg">
          CONTACT US
        </h1>
        <p className="text-[#d4c5b9] mt-3 tracking-wide text-sm max-w-lg mx-auto">
          We'd love to hear from you — questions, feedback or collaborations.
        </p>
      </header>

      <section className="max-w-5xl mx-auto space-y-16">

        {/* Locations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[#2a1a15]/30 border border-[#6b4a3f] hover:shadow-lg transition">
            <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">LPU</h2>
            <div className="space-y-3 text-sm text-[#f5e6d3]">
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-orange-300" />
                <span>+44 (0)20 7123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-orange-300" />
                <span>lpun@fadedandfound.com</span>
              </div>
              <div className="flex items-start gap-3">
                <LocationIcon className="w-5 h-5 text-orange-300 mt-1" />
                <span>GT Road, phagwara, Punjab</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#2a1a15]/30 border border-[#6b4a3f] hover:shadow-lg transition">
            <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">MANCHESTER</h2>
            <div className="space-y-3 text-sm text-[#f5e6d3]">
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-orange-300" />
                <span>+44 (0)161 234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-orange-300" />
                <span>manchester@fadedandfound.com</span>
              </div>
              <div className="flex items-start gap-3">
                <LocationIcon className="w-5 h-5 text-orange-300 mt-1" />
                <span>22 Whitmore Street, Northern Quarter, Manchester M4 1LX</span>
              </div>
            </div>
          </div>
        </div>

        {/* INFO + IMAGE */}
        <div className="flex gap-12">
          <div className="w-1/2 space-y-10">
            <div className="bg-[#2a1a15]/40 p-6 rounded-xl border-l-4 border-orange-500">
              <h3 className="text-xl md:text-2xl text-orange-400 font-bold">Contact Us</h3>
              <p className="text-sm text-[#d4c5b9]">
                At Faded&Found, we believe every conversation matters. Whether you're searching for the perfect piece, need help with an order, or simply want to share your thoughts, our team is always here for you. You can reach us directly at our LPU and Manchester boutiques.
              </p>
            </div>

            <div className="bg-[#2a1a15]/40 p-6 rounded-xl border-l-4 border-orange-500">
              <h3 className="text-xl md:text-2xl text-orange-400 font-bold">Job Applications</h3>
              <p className="text-sm text-[#d4c5b9]">
               We're always looking for passionate people 
               who share our love for timeless style. If you're
                interested in joining the Faded&Found team,
                send your CV and a short cover letter to the
                store you'd like to apply for. We'll be in touch if
                there's a role that feels like the right fit.
              </p>
            </div>
          </div>

          <div className="w-1/2">
            <img
              src="https://i.pinimg.com/1200x/d3/3c/c5/d33cc576988273862180667a5dded4ef.jpg"
              alt="Contact"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="p-10 rounded-2xl bg-[#2a1a15]/70 border border-orange-500/40">
          <h3 className="text-2xl md:text-3xl text-center font-bold text-orange-400 mb-6">
            Send Us a Message
          </h3>

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded">
              Message sent successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={errors.name ? "true" : "false"}
                className="w-full p-3 rounded bg-[#f5e6d3] text-black focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : "false"}
                className="w-full p-3 rounded bg-[#f5e6d3] text-black focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                aria-invalid={errors.message ? "true" : "false"}
                className="w-full p-3 rounded bg-[#f5e6d3] text-black focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-bold disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
