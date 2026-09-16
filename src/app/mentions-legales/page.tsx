export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-bg text-text py-20 px-6 sm:px-10 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-display font-semibold">Mentions Légales</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Éditeur</h2>
        <p>Le site HardwarePC est édité par : [NOM_EDITEUR], situé à [ADRESSE].<br />Contact : [EMAIL_CONTACT]</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Hébergement</h2>
        <p>Le site est hébergé par Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, USA.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Propriété Intellectuelle</h2>
        <p>L&apos;ensemble du contenu (textes, logos, graphismes) est la propriété exclusive de HardwarePC, sauf mention contraire.</p>
      </section>
    </div>
  );
}
