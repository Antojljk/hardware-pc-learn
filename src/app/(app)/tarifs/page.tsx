import { redirect } from 'next/navigation';

export default function TarifsPage() {
  // La page /tarifs n'a pas de contenu propre : elle est remplacée par
  // la page de vente `/vente` qui présente les 4 offres en détail.
  redirect('/vente');
}