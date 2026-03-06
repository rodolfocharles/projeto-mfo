// src/domain/entities/Insurance.ts

import { InsuranceType } from '../value-objects/InsuranceType'

interface InsuranceProps {
  id?: string
  clientId: string
  type: InsuranceType
  name: string
  coverage: number
  premium: number
  startDate: Date
  endDate?: Date | null
  createdAt?: Date
  updatedAt?: Date | null
}

export class Insurance {
  private _id: string
  private _clientId: string
  private _type: InsuranceType
  private _name: string
  private _coverage: number
  private _premium: number
  private _startDate: Date
  private _endDate?: Date | null
  private _createdAt: Date
  private _updatedAt?: Date | null

  private constructor(props: InsuranceProps) {
    this._id = props.id || crypto.randomUUID()
    this._clientId = props.clientId
    this._type = props.type
    this._name = props.name
    this._coverage = props.coverage
    this._premium = props.premium
    this._startDate = props.startDate
    this._endDate = props.endDate
    this._createdAt = props.createdAt || new Date()
    this._updatedAt = props.updatedAt

    // Validações iniciais
    if (!this._clientId) {
      throw new Error('Insurance must be associated with a client.')
    }
    if (!this._name || this._name.trim().length < 3) {
      throw new Error('Insurance name is required and must be at least 3 characters long.')
    }
    if (this._coverage < 0) {
      throw new Error('Insurance coverage cannot be negative.')
    }
    if (this._premium < 0) {
      throw new Error('Insurance premium cannot be negative.')
    }
    if (!(this._startDate instanceof Date) || isNaN(this._startDate.getTime())) {
      throw new Error('Insurance start date is required and must be a valid date.')
    }
  }

  public static create(props: InsuranceProps): Insurance {
    return new Insurance(props)
  }

  // Getters
  get id(): string { return this._id }
  get clientId(): string { return this._clientId }
  get type(): InsuranceType { return this._type }
  get name(): string { return this._name }
  get coverage(): number { return this._coverage }
  get premium(): number { return this._premium }
  get startDate(): Date { return this._startDate }
  get endDate(): Date | null | undefined { return this._endDate }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date | null | undefined { return this._updatedAt }

  // Métodos de negócio
  public updateDetails(
    newName: string,
    newType: InsuranceType,
    newCoverage: number,
    newPremium: number,
    newStartDate: Date,
    newEndDate?: Date | null,
  ): void {
    if (!newName || newName.trim().length < 3) {
      throw new Error('Insurance name must be at least 3 characters long.')
    }
    if (newCoverage < 0) {
      throw new Error('Insurance coverage cannot be negative.')
    }
    if (newPremium < 0) {
      throw new Error('Insurance premium cannot be negative.')
    }
    if (!(newStartDate instanceof Date) || isNaN(newStartDate.getTime())) {
      throw new Error('Insurance start date is required and must be a valid date.')
    }

    this._name = newName
    this._type = newType
    this._coverage = newCoverage
    this._premium = newPremium
    this._startDate = newStartDate
    this._endDate = newEndDate
    this._updatedAt = new Date()
  }
}