// src/domain/entities/Allocation.ts
import { AllocationType } from '../value-objects/AllocationType'; // Vamos criar este enum/VO

interface AllocationProps {
  id?: string;
  clientId: string;
  snapshotId?: string; // Opcional
  name: string;
  type: AllocationType;
  value: number;
  startDate: Date;
  contribution?: number;
  rate?: number;
  isTaxable?: boolean;
  isFinanced?: boolean;
  downPayment?: number | null;
  installments?: number | null;
  interestRate?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Allocation {
  private _id: string;
  private _clientId: string;
  private _snapshotId?: string;
  private _name: string;
  private _type: AllocationType;
  private _value: number;
  private _startDate: Date;
  private _contribution: number;
  private _rate: number;
  private _isTaxable: boolean;
  private _isFinanced: boolean;
  private _downPayment?: number | null;
  private _installments?: number | null;
  private _interestRate?: number | null;
  private _createdAt: Date;
  private _updatedAt?: Date;

  private constructor(props: AllocationProps) {
    this._id = props.id || crypto.randomUUID();
    this._clientId = props.clientId;
    this._snapshotId = props.snapshotId;
    this._name = props.name;
    this._type = props.type;
    this._value = props.value;
    this._startDate = props.startDate;
    this._contribution = props.contribution ?? 0;
    this._rate = props.rate ?? 0;
    this._isTaxable = props.isTaxable ?? false;
    this._isFinanced = props.isFinanced ?? false;
    this._downPayment = props.downPayment;
    this._installments = props.installments;
    this._interestRate = props.interestRate;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt;

    // Validações iniciais
    if (!this._clientId) {
      throw new Error('Allocation must be associated with a client.');
    }
    if (!this._name || this._name.trim().length < 3) {
      throw new Error('Allocation name is required and must be at least 3 characters long.');
    }
    if (this._value < 0) {
      throw new Error('Allocation value cannot be negative.');
    }
    if (!(this._startDate instanceof Date) || isNaN(this._startDate.getTime())) {
      throw new Error('Allocation start date is required and must be a valid date.');
    }
  }

  public static create(props: AllocationProps): Allocation {
    return new Allocation(props);
  }

  // Getters
  get id(): string { return this._id; }
  get clientId(): string { return this._clientId; }
  get snapshotId(): string | undefined { return this._snapshotId; }
  get name(): string { return this._name; }
  get type(): AllocationType { return this._type; }
  get value(): number { return this._value; }
  get startDate(): Date { return this._startDate; }
  get contribution(): number { return this._contribution; }
  get rate(): number { return this._rate; }
  get isTaxable(): boolean { return this._isTaxable; }
  get isFinanced(): boolean { return this._isFinanced; }
  get downPayment(): number | null | undefined { return this._downPayment; }
  get installments(): number | null | undefined { return this._installments; }
  get interestRate(): number | null | undefined { return this._interestRate; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  // Métodos de negócio
  public updateDetails(
    newName: string,
    newValue: number,
    newType: AllocationType,
    newStartDate: Date
  ): void {
    if (!newName || newName.trim().length < 3) {
      throw new Error('Allocation name must be at least 3 characters long.');
    }
    if (newValue < 0) {
      throw new Error('Allocation value cannot be negative.');
    }
    if (!(newStartDate instanceof Date) || isNaN(newStartDate.getTime())) {
      throw new Error('Allocation start date is required and must be a valid date.');
    }

    this._name = newName;
    this._value = newValue;
    this._type = newType;
    this._startDate = newStartDate;
    this._updatedAt = new Date();
  }

  public updateFinancialDetails(
    newContribution: number,
    newRate: number,
    newIsTaxable: boolean
  ): void {
    if (newContribution < 0 || newRate < 0) {
      throw new Error('Contribution and rate cannot be negative.');
    }
    this._contribution = newContribution;
    this._rate = newRate;
    this._isTaxable = newIsTaxable;
    this._updatedAt = new Date();
  }

  public updateFinancingDetails(
    isFinanced: boolean,
    downPayment?: number | null,
    installments?: number | null,
    interestRate?: number | null
  ): void {
    this._isFinanced = isFinanced;
    this._downPayment = isFinanced ? (downPayment ?? null) : null;
    this._installments = isFinanced ? (installments ?? null) : null;
    this._interestRate = isFinanced ? (interestRate ?? null) : null;
    this._updatedAt = new Date();
  }
}
