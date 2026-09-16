export default function Remboursement() {
  return (
    <div className="min-h-screen bg-bg text-text py-20 px-6 sm:px-10 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-display font-semibold">Politique de Remboursement</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Droit de Rétractation</h2>
        <p>Conformément au droit européen, vous disposez d&apos;un délai de 14 jours après l&apos;achat pour demander un remboursement intégral.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Procédure</h2>
        <p>Pour demander un remboursement, veuillez envoyer un email à antoine.drutel@gmail.com en précisant votre adresse email de compte et le numéro de commande Stripe.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Conditions</h2>
        <p>Le remboursement sera traité dans un délai de 14 jours suivant la réception de votre demande.</p>
      </section>
    </div>
  );
}
