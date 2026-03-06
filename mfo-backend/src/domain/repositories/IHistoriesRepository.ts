// src/domain/repositories/IHistoriesRepository.ts
import { History } from '../entities/History';

export interface IHistoriesRepository {
  /**
   * Encontra um histórico pelo seu ID.
   * @param id O ID do histórico.
   * @returns Uma Promise que resolve para o histórico encontrado ou null se não existir.
   */
  findById(id: string): Promise<History | null>;

  /**
   * Lista todos os históricos para um cliente específico.
   * @param clientId O ID do cliente.
   * @returns Uma Promise que resolve para um array de históricos.
   */
  findByClientId(clientId: string): Promise<History[]>;

  /**
   * Cria um novo histórico.
   * @param history A entidade History a ser criada.
   * @returns Uma Promise que resolve para o histórico criado.
   */
  create(history: History): Promise<History>;

  /**
   * Atualiza um histórico existente.
   * @param history A entidade History com os dados atualizados.
   * @returns Uma Promise que resolve para o histórico atualizado.
   */
  update(history: History): Promise<History>;

  /**
   * Deleta um histórico pelo seu ID.
   * @param id O ID do histórico a ser deletado.
   * @returns Uma Promise que resolve quando o histórico é deletado.
   */
  delete(id: string): Promise<void>;
}