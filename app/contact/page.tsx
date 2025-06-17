import React from "react";

export default function Contact() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen p-6 sm:p-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-center mb-8">Have questions or suggestions? Reach out below.</p>
        <form className="space-y-4" action="mailto:info@digitalmetazone.com" method="post" encType="text/plain">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1">Name</label>
            <input type="text" id="name" name="name" className="p-2 rounded text-black" required />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">Email</label>
            <input type="email" id="email" name="email" className="p-2 rounded text-black" required />
          </div>
          <div className="flex flex-col">
            <label htmlFor="message" className="mb-1">Message</label>
            <textarea id="message" name="message" rows={5} className="p-2 rounded text-black" required />
          </div>
          <button type="submit" className="px-6 py-2 bg-accent-color rounded-lg hover:bg-blue-700 transition">Send</button>
        </form>
      </div>
    </div>
  );
}
