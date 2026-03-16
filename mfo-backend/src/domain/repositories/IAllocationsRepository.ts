// src/domain/repositories/IAllocationsRepository.ts
import { Allocation } from '../entities/Allocation';

export interface IAllocationsRepository {
  /**
   * Encontra uma alocação pelo seu ID.
   * @param id O ID da alocação.
   * @returns Uma Promise que resolve para a alocação encontrada ou null se não existir.
   */
  findById(id: string): Promise<Allocation | null>;

  /**
   * Lista todas as alocações para um cliente específico.
   * @param clientId O ID do cliente.
   * @returns Uma Promise que resolve para um array de alocações.
   */
  findByClientId(clientId: string): Promise<Allocation[]>;

  /**
   * Cria uma nova alocação.
   * @param allocation A entidade Allocation a ser criada.
   * @returns Uma Promise que resolve para a alocação criada.
   */
  create(allocation: Allocation): Promise<Allocation>;

  /**
   * Atualiza uma alocação existente.
   * @param allocation A entidade Allocation com os dados atualizados.
   * @returns Uma Promise que resolve para a alocação atualizada.
   */
  update(allocation: Allocation): Promise<Allocation>;

  /**
   * Deleta uma alocação pelo seu ID.
   * @param id O ID da alocação a ser deletada.
   * @returns Uma Promise que resolve quando a alocação é deletada.
   */
  delete(id: string): Promise<void>;
}
