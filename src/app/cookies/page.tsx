export default function Cookies() {
  return (
    <div className="min-h-screen bg-bg text-text py-20 px-6 sm:px-10 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-display font-semibold">Politique de Cookies</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Cookies Techniques</h2>
        <p>Nous utilisons des cookies strictement nécessaires au fonctionnement du site (authentification, session).</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Cookies Analytiques</h2>
        <p>Nous pouvons utiliser des outils d&apos;analyse pour améliorer l&apos;expérience utilisateur. Vous pouvez les refuser via le bandeau de consentement.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Gestion des Cookies</h2>
        <p>Vous pouvez configurer vos préférences de cookies directement dans les paramètres de votre navigateur.</p>
      </section>
    </div>
  );
}
