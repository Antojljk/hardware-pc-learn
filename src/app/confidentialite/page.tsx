export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-bg text-text py-20 px-6 sm:px-10 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-display font-semibold">Politique de Confidentialité</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Données Collectées</h2>
        <p>Nous collectons les informations suivantes :<br />- Email, pseudo et nom pour la gestion du compte.<br />- Données de progression dans les cours et quiz.<br />- Informations de paiement traitées sécurisées via Stripe.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Utilisation et Conservation</h2>
        <p>Vos données sont utilisées pour fournir le service et sont conservées pendant la durée de vie de votre compte, ou jusqu&apos;à votre demande de suppression.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent">Vos Droits (RGPD)</h2>
        <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez : antoine.drutel@gmail.com.</p>
      </section>
    </div>
  );
}
