import PageAnalytics from "@/components/PageAnalytics";

export default function Contact() {
  return (
    <div className="page-shell">
      <PageAnalytics event="contact_page_view" payload={{ page: "/contact" }} />

      <section className="page-intro">
        <h1 className="page-title">Contact</h1>
        <p className="page-subtitle">Have questions or suggestions? Reach out below.</p>
      </section>

      <section className="glass-card max-w-2xl mx-auto w-full">
        <form
          className="space-y-4"
          action="mailto:info@digitalmetazone.com"
          method="post"
          encType="text/plain"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required />
          </div>
          <button type="submit" className="primary-btn">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
