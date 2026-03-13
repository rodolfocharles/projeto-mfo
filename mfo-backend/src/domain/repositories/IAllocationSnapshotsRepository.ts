// src/domain/repositories/IAllocationSnapshotsRepository.ts
import { AllocationSnapshot } from '../entities/AllocationSnapshot';

export interface IAllocationSnapshotsRepository {
  /**
   * Encontra um snapshot de alocações pelo seu ID.
   * @param id O ID do snapshot.
   * @returns Uma Promise que resolve para o snapshot encontrado ou null se não existir.
   */
  findById(id: string): Promise<AllocationSnapshot | null>;

  /**
   * Lista todos os snapshots para um cliente específico.
   * @param clientId O ID do cliente.
   * @returns Uma Promise que resolve para um array de snapshots.
   */
  findByClientId(clientId: string): Promise<AllocationSnapshot[]>;

  /**
   * Cria um novo snapshot de alocações.
   * @param snapshot A entidade AllocationSnapshot a ser criada.
   * @returns Uma Promise que resolve para o snapshot criado.
   */
  create(snapshot: AllocationSnapshot): Promise<AllocationSnapshot>;

  /**
   * Atualiza um snapshot existente.
   * @param snapshot A entidade AllocationSnapshot com os dados atualizados.
   * @returns Uma Promise que resolve para o snapshot atualizado.
   */
  update(id: string, snapshot: Partial<AllocationSnapshot>): Promise<AllocationSnapshot>

  findLatestByClientId(clientId: string): Promise<AllocationSnapshot | null>

  /**
   * Deleta um snapshot pelo seu ID.
   * @param id O ID do snapshot a ser deletado.
   * @returns Uma Promise que resolve quando o snapshot é deletado.
   */
  delete(id: string): Promise<void>;
}