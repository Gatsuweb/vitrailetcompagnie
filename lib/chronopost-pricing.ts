// Chrono 18, France métropolitaine, tarif standard du document Chronopost Pro
// transmis par l'atelier. Montants publics calculés avec 20 % de TVA sur le
// tarif transporteur HT, sans remise, assurance ni enlèvement sur demande.
export const CHRONO_18_TIERS = [
 {maxGrams:1000,priceCents:1920},
 {maxGrams:3000,priceCents:2160},
 {maxGrams:10000,priceCents:2460},
 {maxGrams:20000,priceCents:3720},
 {maxGrams:30000,priceCents:5040},
] as const;

export function chronopostHomePriceCents(weightGrams:number):number|null{
 if(!Number.isFinite(weightGrams)||weightGrams<=0)return null;
 return CHRONO_18_TIERS.find(tier=>weightGrams<=tier.maxGrams)?.priceCents??null;
}
