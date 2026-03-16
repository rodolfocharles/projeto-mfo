// src/domain/entities/History.ts
interface HistoryProps {
  id?: string;
  clientId: string;
  name: string;
  version: number;
  startDate: Date;
  realRate: number;
  inflation: number;
  lifeStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class History {
  private _id: string;
  private _clientId: string;
  private _name: string;
  private _version: number;
  private _startDate: Date;
  private _realRate: number;
  private _inflation: number;
  private _lifeStatus: string;
  private _createdAt: Date;
  private _updatedAt: Date | undefined;

  private constructor(props: HistoryProps) {
    this._id = props.id || crypto.randomUUID();
    this._clientId = props.clientId;
    this._name = props.name;
    this._version = props.version;
    this._startDate = props.startDate;
    this._realRate = props.realRate;
    this._inflation = props.inflation;
    this._lifeStatus = props.lifeStatus;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt;

    // Validações
    if (!this._clientId) {
      throw new Error('History must be associated with a client.');
    }
    if (!this._name || this._name.trim().length < 1) {
      throw new Error('History name is required.');
    }
    if (this._version < 1) {
      throw new Error('Version must be at least 1.');
    }
    if (!(this._startDate instanceof Date) || isNaN(this._startDate.getTime())) {
      throw new Error('Start date is required and must be a valid date.');
    }
    if (this._realRate < 0) {
      throw new Error('Real rate cannot be negative.');
    }
    if (this._inflation < 0) {
      throw new Error('Inflation cannot be negative.');
    }
    if (!this._lifeStatus) {
      throw new Error('Life status is required.');
    }
  }

  public static create(props: HistoryProps): History {
    return new History(props);
  }

  // Getters
  get id(): string { return this._id; }
  get clientId(): string { return this._clientId; }
  get name(): string { return this._name; }
  get version(): number { return this._version; }
  get startDate(): Date { return this._startDate; }
  get realRate(): number { return this._realRate; }
  get inflation(): number { return this._inflation; }
  get lifeStatus(): string { return this._lifeStatus; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  // Métodos de negócio
  public updateVersion(newVersion: number): void {
    if (newVersion < 1) {
      throw new Error('Version must be at least 1.');
    }
    this._version = newVersion;
    this._updatedAt = new Date();
  }

  public updateDetails(
    newName: string,
    newRealRate: number,
    newInflation: number,
    newLifeStatus: string
  ): void {
    if (!newName || newName.trim().length < 1) {
      throw new Error('Name is required.');
    }
    if (newRealRate < 0 || newInflation < 0) {
      throw new Error('Rates cannot be negative.');
    }
    if (!newLifeStatus) {
      throw new Error('Life status is required.');
    }
    this._name = newName;
    this._realRate = newRealRate;
    this._inflation = newInflation;
    this._lifeStatus = newLifeStatus;
    this._updatedAt = new Date();
  }
}