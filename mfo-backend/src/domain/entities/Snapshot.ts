// src/domain/entities/Snapshot.ts

interface SnapshotProps {
  id?: string
  clientId: string
  date: Date
  name?: string
  financialTotal?: number
  immobilizedTotal?: number
  totalValue?: number
  createdAt?: Date
  updatedAt?: Date
}

export class Snapshot {
  private _id: string
  private _clientId: string
  private _date: Date
  private _name?: string
  private _financialTotal: number
  private _immobilizedTotal: number
  private _totalValue: number
  private _createdAt: Date
  private _updatedAt?: Date

  private constructor(props: SnapshotProps) {
    this._id = props.id || crypto.randomUUID()
    this._clientId = props.clientId
    this._date = props.date
    this._name = props.name
    this._financialTotal = props.financialTotal ?? 0
    this._immobilizedTotal = props.immobilizedTotal ?? 0
    this._totalValue = props.totalValue ?? 0
    this._createdAt = props.createdAt || new Date()
    this._updatedAt = props.updatedAt

    // Validações
    if (!this._clientId) {
      throw new Error('Snapshot must be associated with a client.')
    }
    if (!(this._date instanceof Date) || isNaN(this._date.getTime())) {
      throw new Error('Snapshot date is required and must be a valid date.')
    }
    if (this._financialTotal < 0) {
      throw new Error('Financial total cannot be negative.')
    }
    if (this._immobilizedTotal < 0) {
      throw new Error('Immobilized total cannot be negative.')
    }
    if (this._totalValue < 0) {
      throw new Error('Total value cannot be negative.')
    }
  }

  public static create(props: SnapshotProps): Snapshot {
    return new Snapshot(props)
  }

  // Getters
  get id(): string {
    return this._id
  }

  get clientId(): string {
    return this._clientId
  }

  get date(): Date {
    return this._date
  }

  get name(): string | undefined {
    return this._name
  }

  get financialTotal(): number {
    return this._financialTotal
  }

  get immobilizedTotal(): number {
    return this._immobilizedTotal
  }

  get totalValue(): number {
    return this._totalValue
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  // Métodos de negócio
  public updateFinancialTotal(newValue: number): void {
    if (newValue < 0) {
      throw new Error('Financial total cannot be negative.')
    }
    this._financialTotal = newValue
    this._updatedAt = new Date()
  }

  public updateImmobilizedTotal(newValue: number): void {
    if (newValue < 0) {
      throw new Error('Immobilized total cannot be negative.')
    }
    this._immobilizedTotal = newValue
    this._updatedAt = new Date()
  }

  public updateTotalValue(newValue: number): void {
    if (newValue < 0) {
      throw new Error('Total value cannot be negative.')
    }
    this._totalValue = newValue
    this._updatedAt = new Date()
  }

  public updateDate(newDate: Date): void {
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
      throw new Error('Date must be a valid date.')
    }
    this._date = newDate
    this._updatedAt = new Date()
  }

  public updateName(newName: string | undefined): void {
    this._name = newName
    this._updatedAt = new Date()
  }

  public recalculateTotalValue(): void {
    this._totalValue = this._financialTotal + this._immobilizedTotal
    this._updatedAt = new Date()
  }
}