// src/domain/value-objects/InsuranceType.ts

/**
 * Define os tipos possíveis de seguro.
 * Você pode adicionar ou remover tipos conforme a necessidade do seu domínio.
 */
export type InsuranceType =
  | 'LIFE' // Seguro de Vida
  | 'HEALTH' // Seguro Saúde
  | 'AUTO' // Seguro Automóvel
  | 'PROPERTY' // Seguro Residencial/Imóvel
  | 'TRAVEL' // Seguro Viagem
  | 'OTHER'; // Outros tipos de seguro