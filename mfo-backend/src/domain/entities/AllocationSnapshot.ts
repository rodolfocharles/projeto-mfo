// src/domain/entities/AllocationSnapshot.ts
interface AllocationSnapshotProps {
  id?: string;
  clientId: string;
  date: Date;
  totalValue: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AllocationSnapshot {
  private _id: string;
  private _clientId: string;
  private _date: Date;
  private _totalValue: number;
  private _createdAt: Date;
  private _updatedAt: Date | undefined;

  private constructor(props: AllocationSnapshotProps) {
    this._id = props.id || crypto.randomUUID();
    this._clientId = props.clientId;
    this._date = props.date;
    this._totalValue = props.totalValue;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt;

    // Validações
    if (!this._clientId) {
      throw new Error('AllocationSnapshot must be associated with a client.');
    }
    if (!(this._date instanceof Date) || isNaN(this._date.getTime())) {
      throw new Error('AllocationSnapshot date is required and must be a valid date.');
    }
    if (this._totalValue < 0) {
      throw new Error('AllocationSnapshot total value cannot be negative.');
    }
  }

  public static create(props: AllocationSnapshotProps): AllocationSnapshot {
    return new AllocationSnapshot(props);
  }

  // Getters
  get id(): string { return this._id; }
  get clientId(): string { return this._clientId; }
  get date(): Date { return this._date; }
  get totalValue(): number { return this._totalValue; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  // Métodos de negócio
  public updateTotalValue(newTotalValue: number): void {
    if (newTotalValue < 0) {
      throw new Error('Total value cannot be negative.');
    }
    this._totalValue = newTotalValue;
    this._updatedAt = new Date();
  }

  public updateDate(newDate: Date): void {
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
      throw new Error('Date must be a valid date.');
    }
    this._date = newDate;
    this._updatedAt = new Date();
  }
}