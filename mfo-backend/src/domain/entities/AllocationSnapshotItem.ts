// src/domain/entities/AllocationSnapshotItem.ts
interface AllocationSnapshotItemProps {
  id?: string;
  snapshotId: string;
  allocationId: string;
  valueAtSnapshot: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AllocationSnapshotItem {
  private _id: string;
  private _snapshotId: string;
  private _allocationId: string;
  private _valueAtSnapshot: number;
  private _createdAt: Date;
  private _updatedAt: Date | undefined;

  private constructor(props: AllocationSnapshotItemProps) {
    this._id = props.id || crypto.randomUUID();
    this._snapshotId = props.snapshotId;
    this._allocationId = props.allocationId;
    this._valueAtSnapshot = props.valueAtSnapshot;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt;

    // Validações
    if (!this._snapshotId) {
      throw new Error('AllocationSnapshotItem must be associated with a snapshot.');
    }
    if (!this._allocationId) {
      throw new Error('AllocationSnapshotItem must be associated with an allocation.');
    }
    if (this._valueAtSnapshot < 0) {
      throw new Error('Value at snapshot cannot be negative.');
    }
  }

  public static create(props: AllocationSnapshotItemProps): AllocationSnapshotItem {
    return new AllocationSnapshotItem(props);
  }

  // Getters
  get id(): string { return this._id; }
  get snapshotId(): string { return this._snapshotId; }
  get allocationId(): string { return this._allocationId; }
  get valueAtSnapshot(): number { return this._valueAtSnapshot; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  // Métodos de negócio
  public updateValueAtSnapshot(newValue: number): void {
    if (newValue < 0) {
      throw new Error('Value at snapshot cannot be negative.');
    }
    this._valueAtSnapshot = newValue;
    this._updatedAt = new Date();
  }
}