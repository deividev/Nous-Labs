export interface ServiceItem {
  title: string;
  description: string;
  route?: string;
  comingSoon?: boolean;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaLabel: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContactConfig {
  whatsappNumber: string;
  whatsappMessage: string;
  responseTimeText: string;
}

export const CONTACT_CONFIG: ContactConfig = {
  whatsappNumber: '34111111111',
  whatsappMessage:
    'Hola, vengo desde la web de Nous Labs. Me interesa el Servicio D (Asistente IA Operativo) y me gustaría solicitar diagnóstico gratuito.',
  responseTimeText: 'Te responderemos en 24-48h con el siguiente paso para el diagnóstico.',
};

export const SERVICES: ServiceItem[] = [
  {
    title: 'Asistente IA Operativo — Nivel Entry',
    description:
      'Servicio activo en esta fase: implantación operativa para agenda, correo y documentación con IA aplicada.',
    route: '/servicios/asistente-ia-operativo',
  },
];

export const FUTURE_SERVICES: ServiceItem[] = [
  {
    title: 'Asistente IA Operativo — Nivel Core',
    description: 'Nivel avanzado en preparación (no disponible todavía).',
    comingSoon: true,
  },
  {
    title: 'Asistente IA Operativo — Nivel Pro',
    description: 'Nivel premium en preparación (no disponible todavía).',
    comingSoon: true,
  },
  {
    title: 'Desarrollo de Software a medida',
    description: 'Servicio futuro en definición de alcance y precios.',
    comingSoon: true,
  },
  {
    title: 'Automatizaciones IA',
    description: 'Servicio futuro en definición de alcance y precios.',
    comingSoon: true,
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'D-Entry (Activo)',
    price: '299€ - 490€',
    description: 'Arranque guiado con configuración base y entrega usable en días.',
    features: [
      'Setup inicial',
      'Flujo mínimo operativo',
      'Checklist de handover',
      'Guía de uso para empezar desde el día 1',
    ],
    ctaLabel: 'Solicitar D-Entry',
  },
];

export const SERVICE_D_FAQ: FaqItem[] = [
  {
    question: '¿Cuánto tarda la implementación?',
    answer: 'Entre 3 y 10 días laborables según el nivel contratado y disponibilidad de accesos.',
  },
  {
    question: '¿Necesito conocimientos técnicos?',
    answer: 'No. Nosotros guiamos setup, validación y entrega para que puedas operar sin fricción.',
  },
  {
    question: '¿Incluye soporte posterior?',
    answer: 'Sí, D-Entry incluye una ventana inicial de soporte para ajustes y dudas tras el handover.',
  },
  {
    question: '¿Cómo se protege la información?',
    answer: 'Trabajamos bajo buenas prácticas de seguridad y acceso mínimo necesario durante la implantación.',
  },
];
