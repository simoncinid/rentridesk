export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
export interface WasteProfile {
  id: string;
  code: string;
  name: string;
  hazardous: boolean;
  stock: number;
  unit: string;
  status: string;
  lastMovement: string;
}
export interface Movement {
  id: string;
  sequence: string;
  type: 'Carico' | 'Scarico';
  date: string;
  wasteCode: string;
  waste: string;
  quantity: number;
  unit: string;
  status: string;
  transmission: string;
}
export interface Fir {
  id: string;
  internalNumber: string;
  officialNumber: string;
  wasteCode: string;
  waste: string;
  carrier: string;
  destination: string;
  quantity: number;
  unit: string;
  status: string;
  statusKey: string;
  updatedAt: string;
  actor: string;
}

export const organization = {
  name: 'Officina Aurora S.r.l.',
  unit: 'Sede di Bologna',
  role: 'Responsabile ambientale',
  initials: 'DA',
};
export const wasteProfiles: WasteProfile[] = [
  {
    id: 'wp-1',
    code: '13 02 05*',
    name: 'Oli minerali per motori',
    hazardous: true,
    stock: 620,
    unit: 'kg',
    status: 'Confermato',
    lastMovement: '12 lug 2026',
  },
  {
    id: 'wp-2',
    code: '16 01 07*',
    name: 'Filtri dell’olio',
    hazardous: true,
    stock: 148,
    unit: 'kg',
    status: 'Confermato',
    lastMovement: '10 lug 2026',
  },
  {
    id: 'wp-3',
    code: '16 01 03',
    name: 'Pneumatici fuori uso',
    hazardous: false,
    stock: 38,
    unit: 'pz',
    status: 'Da rivedere',
    lastMovement: '8 lug 2026',
  },
  {
    id: 'wp-4',
    code: '16 06 01*',
    name: 'Batterie al piombo',
    hazardous: true,
    stock: 214,
    unit: 'kg',
    status: 'Confermato',
    lastMovement: '4 lug 2026',
  },
];
export const movements: Movement[] = [
  {
    id: 'mov-1',
    sequence: 'C-2026/0048',
    type: 'Carico',
    date: '12 lug 2026',
    wasteCode: '13 02 05*',
    waste: 'Oli minerali per motori',
    quantity: 120,
    unit: 'kg',
    status: 'Registrato',
    transmission: 'Da trasmettere',
  },
  {
    id: 'mov-2',
    sequence: 'S-2026/0019',
    type: 'Scarico',
    date: '11 lug 2026',
    wasteCode: '16 01 07*',
    waste: 'Filtri dell’olio',
    quantity: 84,
    unit: 'kg',
    status: 'Bloccato',
    transmission: 'Trasmesso',
  },
  {
    id: 'mov-3',
    sequence: 'C-2026/0047',
    type: 'Carico',
    date: '10 lug 2026',
    wasteCode: '16 01 07*',
    waste: 'Filtri dell’olio',
    quantity: 36,
    unit: 'kg',
    status: 'Registrato',
    transmission: 'Da trasmettere',
  },
  {
    id: 'mov-4',
    sequence: 'C-2026/0046',
    type: 'Carico',
    date: '8 lug 2026',
    wasteCode: '16 01 03',
    waste: 'Pneumatici fuori uso',
    quantity: 12,
    unit: 'pz',
    status: 'Bozza',
    transmission: 'Non applicabile',
  },
  {
    id: 'mov-5',
    sequence: 'S-2026/0018',
    type: 'Scarico',
    date: '5 lug 2026',
    wasteCode: '13 02 05*',
    waste: 'Oli minerali per motori',
    quantity: 420,
    unit: 'kg',
    status: 'Bloccato',
    transmission: 'Trasmesso',
  },
];
export const firs: Fir[] = [
  {
    id: 'fir-1',
    internalNumber: 'FIR-2026-0028',
    officialNumber: 'ABXTF-000028-26',
    wasteCode: '16 01 07*',
    waste: 'Filtri dell’olio',
    carrier: 'EcoTrasporti Emilia S.r.l.',
    destination: 'Recuperi Adriatica S.p.A.',
    quantity: 84,
    unit: 'kg',
    status: 'In viaggio',
    statusKey: 'in_transit',
    updatedAt: 'Oggi, 10:42',
    actor: 'Trasportatore',
  },
  {
    id: 'fir-2',
    internalNumber: 'FIR-2026-0027',
    officialNumber: 'ABXTF-000027-26',
    wasteCode: '13 02 05*',
    waste: 'Oli minerali per motori',
    carrier: 'EcoTrasporti Emilia S.r.l.',
    destination: 'Oli Rigenerati Nord S.p.A.',
    quantity: 420,
    unit: 'kg',
    status: 'Copia ricevuta',
    statusKey: 'complete_copy_received',
    updatedAt: 'Ieri, 17:18',
    actor: 'Tu',
  },
  {
    id: 'fir-3',
    internalNumber: 'FIR-2026-0029',
    officialNumber: '—',
    wasteCode: '16 06 01*',
    waste: 'Batterie al piombo',
    carrier: 'Logistica Verde S.r.l.',
    destination: 'Metalli Circolari S.r.l.',
    quantity: 180,
    unit: 'kg',
    status: 'Da correggere',
    statusKey: 'validation_failed',
    updatedAt: '12 lug, 16:20',
    actor: 'Tu',
  },
  {
    id: 'fir-4',
    internalNumber: 'FIR-2026-0026',
    officialNumber: 'ABXTF-000026-26',
    wasteCode: '16 01 03',
    waste: 'Pneumatici fuori uso',
    carrier: 'Gomma Service Trasporti',
    destination: 'EcoPneus Centro S.r.l.',
    quantity: 34,
    unit: 'pz',
    status: 'Conservato',
    statusKey: 'conserved',
    updatedAt: '6 lug, 09:12',
    actor: 'Sistema',
  },
];
export const alerts = [
  {
    id: 'a1',
    severity: 'danger' as const,
    title: 'FIR-2026-0029 richiede una correzione',
    detail: 'Manca il numero di autorizzazione del destinatario.',
    due: 'Intervieni ora',
    href: '/app/firs/fir-3',
  },
  {
    id: 'a2',
    severity: 'warning' as const,
    title: '3 movimenti da trasmettere',
    detail: 'La prossima trasmissione automatica è prevista alle 18:00.',
    due: 'Entro oggi',
    href: '/app/movements',
  },
  {
    id: 'a3',
    severity: 'warning' as const,
    title: 'Autorizzazione in scadenza',
    detail: 'EcoTrasporti Emilia: scadenza tra 22 giorni.',
    due: '5 ago 2026',
    href: '/app/authorizations',
  },
  {
    id: 'a4',
    severity: 'info' as const,
    title: 'Copia completa ricevuta',
    detail: 'Il FIR-2026-0027 è pronto per lo scarico.',
    due: 'Ieri',
    href: '/app/firs/fir-2',
  },
];
export const parties = [
  {
    id: 'party-1',
    name: 'EcoTrasporti Emilia S.r.l.',
    roles: 'Trasportatore',
    vat: 'IT00000000001',
    city: 'Bologna',
    auth: 'Valida · 5 ago 2026',
    tone: 'warning' as const,
  },
  {
    id: 'party-2',
    name: 'Recuperi Adriatica S.p.A.',
    roles: 'Destinatario',
    vat: 'IT00000000002',
    city: 'Ravenna',
    auth: 'Valida · 18 mar 2027',
    tone: 'success' as const,
  },
  {
    id: 'party-3',
    name: 'Oli Rigenerati Nord S.p.A.',
    roles: 'Destinatario',
    vat: 'IT00000000003',
    city: 'Mantova',
    auth: 'Valida · 2 nov 2026',
    tone: 'success' as const,
  },
  {
    id: 'party-4',
    name: 'Logistica Verde S.r.l.',
    roles: 'Trasportatore',
    vat: 'IT00000000004',
    city: 'Modena',
    auth: 'Documento mancante',
    tone: 'danger' as const,
  },
];
export const activity = [
  ['Copia FIR ricevuta e verificata', 'FIR-2026-0027', 'Ieri, 17:18', 'Sistema'],
  ['Movimento di scarico trasmesso', 'S-2026/0019', '11 lug, 18:04', 'Sistema'],
  ['FIR firmato dal trasportatore', 'FIR-2026-0028', '11 lug, 09:38', 'EcoTrasporti'],
  ['Nuovo carico registrato', 'C-2026/0048', '10 lug, 17:02', 'Diego A.'],
];
export const documents = [
  {
    name: 'Copia completa FIR-2026-0027.xfir',
    type: 'Copia FIR completa',
    entity: 'FIR-2026-0027',
    date: '13 lug 2026',
    size: '184 KB',
    status: 'Protetto',
  },
  {
    name: 'Autorizzazione EcoTrasporti.pdf',
    type: 'Autorizzazione',
    entity: 'EcoTrasporti Emilia',
    date: '1 giu 2026',
    size: '2,4 MB',
    status: 'Valido',
  },
  {
    name: 'Analisi oli esausti Q2.pdf',
    type: 'Analisi',
    entity: '13 02 05*',
    date: '18 apr 2026',
    size: '865 KB',
    status: 'Valido',
  },
  {
    name: 'Registro giugno 2026.pdf',
    type: 'Registro',
    entity: 'Registro rifiuti 2026',
    date: '1 lug 2026',
    size: '1,1 MB',
    status: 'Da conservare',
  },
];
