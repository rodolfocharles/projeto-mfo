// src/domain/entities/Client.ts

import { LifeStatus } from '../value-objects/LifeStatus'; // Vamos criar este enum/VO

interface ClientProps {
  id?: string | undefined; // Opcional, pois pode ser gerado no momento da criação
  name: string;
  email: string;
  password?: string | undefined; // Opcional, pois pode ser um hash e nem sempre carregado
  birthDate?: Date | undefined;
  lifeStatus?: LifeStatus | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export class Client {
  private _id: string;
  private _name: string;
  private _email: string;
  private _password?: string; // Armazenará o hash da senha
  private _birthDate?: Date;
  private _lifeStatus: LifeStatus;
  private _createdAt: Date;
  private _updatedAt?: Date;

  private constructor(props: ClientProps) {
    this._id = props.id || crypto.randomUUID(); // Gera um UUID se não for fornecido
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._birthDate = props.birthDate;
    this._lifeStatus = props.lifeStatus || LifeStatus.NORMAL; // Valor padrão
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt;

    // Aqui você pode adicionar validações iniciais
    if (!this._name) {
      throw new Error('Client name is required.');
    }
    if (!this._email || !this.isValidEmail(this._email)) {
      throw new Error('Client email is required and must be valid.');
    }
  }

  // Método estático para criar uma instância de Client (factory method)
  public static create(props: ClientProps): Client {
    return new Client(props);
  }

  // Getters para acessar as propriedades (tornando-as imutáveis externamente)
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string | undefined {
    return this._password;
  }

  get birthDate(): Date | undefined {
    return this._birthDate;
  }

  get lifeStatus(): LifeStatus {
    return this._lifeStatus;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Métodos de negócio (comportamento da entidade)
  public updateName(newName: string): void {
    if (!newName || newName.trim().length < 3) {
      throw new Error('Client name must be at least 3 characters long.');
    }
    this._name = newName;
    this._updatedAt = new Date();
  }

  public updateEmail(newEmail: string): void {
    if (!newEmail || !this.isValidEmail(newEmail)) {
      throw new Error('New email must be valid.');
    }
    this._email = newEmail;
    this._updatedAt = new Date();
  }

  public updateLifeStatus(newStatus: LifeStatus): void {
    this._lifeStatus = newStatus;
    this._updatedAt = new Date();
  }

  public setPasswordHash(passwordHash: string): void {
    if (!passwordHash || passwordHash.length < 20) { // bcrypt sempre gera 60 chars
      throw new Error('Invalid password hash.');
    }
    this._password = passwordHash;
    this._updatedAt = new Date();
  }

  // Método de validação de e-mail (pode ser movido para um Value Object de Email)
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // <-- Provavelmente aqui!
    return emailRegex.test(email);
  }
}