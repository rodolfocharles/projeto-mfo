// src/domain/repositories/IAllocationSnapshotItemsRepository.ts
import { AllocationSnapshotItem } from '../entities/AllocationSnapshotItem';

export interface IAllocationSnapshotItemsRepository {
  /**
   * Encontra um item de snapshot pelo seu ID.
   * @param id O ID do item.
   * @returns Uma Promise que resolve para o item encontrado ou null se não existir.
   */
  findById(id: string): Promise<AllocationSnapshotItem | null>;

  /**
   * Lista todos os itens para um snapshot específico.
   * @param snapshotId O ID do snapshot.
   * @returns Uma Promise que resolve para um array de itens.
   */
  findBySnapshotId(snapshotId: string): Promise<AllocationSnapshotItem[]>;

  /**
   * Cria um novo item de snapshot.
   * @param item A entidade AllocationSnapshotItem a ser criada.
   * @returns Uma Promise que resolve para o item criado.
   */
  create(item: AllocationSnapshotItem): Promise<AllocationSnapshotItem>;

  /**
   * Atualiza um item existente.
   * @param item A entidade AllocationSnapshotItem com os dados atualizados.
   * @returns Uma Promise que resolve para o item atualizado.
   */
  update(item: AllocationSnapshotItem): Promise<AllocationSnapshotItem>;

  /**
   * Deleta um item pelo seu ID.
   * @param id O ID do item a ser deletado.
   * @returns Uma Promise que resolve quando o item é deletado.
   */
  delete(id: string): Promise<void>;
}