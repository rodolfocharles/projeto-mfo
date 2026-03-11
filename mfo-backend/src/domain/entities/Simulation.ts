// src/domain/entities/Simulation.ts

import { LifeStatus } from '../value-objects/LifeStatus'

interface SimulationProps {
  id?: string
  clientId: string
  name: string
  startDate: Date
  realRate: number
  inflation: number
  lifeStatus: LifeStatus
  version: number
  scenario?: string | null
  endDate?: Date | null
  retirementAge?: number | null
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date | null
}

export class Simulation {
  private _id: string
  private _clientId: string
  private _name: string
  private _startDate: Date
  private _realRate: number
  private _inflation: number
  private _lifeStatus: LifeStatus
  private _version: number
  private _scenario?: string | null
  private _endDate?: Date | null
  private _retirementAge?: number | null
  private _isActive?: boolean
  private _createdAt: Date
  private _updatedAt: Date | null

  private constructor(props: SimulationProps) {
    this._id = props.id || crypto.randomUUID()
    this._clientId = props.clientId
    this._name = props.name
    this._startDate = props.startDate
    this._realRate = props.realRate
    this._inflation = props.inflation
    this._lifeStatus = props.lifeStatus
    this._version = props.version || 1
    this._scenario = props.scenario ?? null
    this._endDate = props.endDate ?? null
    this._retirementAge = props.retirementAge ?? null
    this._isActive = props.isActive ?? true
    this._createdAt = props.createdAt || new Date()
    this._updatedAt = props.updatedAt ?? null

    // Validações iniciais
    if (!this._clientId) {
      throw new Error('Simulation must be associated with a client.')
    }
    if (!this._name || this._name.trim().length < 3) {
      throw new Error('Simulation name is required and must be at least 3 characters long.')
    }
    if (this._realRate < 0 || this._realRate > 1) {
      throw new Error('Real rate must be between 0 and 1.')
    }
    if (this._inflation < 0 || this._inflation > 1) {
      throw new Error('Inflation must be between 0 and 1.')
    }
    if (!(this._startDate instanceof Date) || isNaN(this._startDate.getTime())) {
      throw new Error('Simulation start date is required and must be a valid date.')
    }
    if (this._version < 1) {
      throw new Error('Simulation version must be at least 1.')
    }
  }

  public static create(props: SimulationProps): Simulation {
    return new Simulation(props)
  }

  // Getters
  get id(): string { return this._id }
  get clientId(): string { return this._clientId }
  get name(): string { return this._name }
  get startDate(): Date { return this._startDate }
  get realRate(): number { return this._realRate }
  get inflation(): number { return this._inflation }
  get lifeStatus(): LifeStatus { return this._lifeStatus }
  get version(): number { return this._version }
  get scenario(): string | null { return this._scenario ?? null }
  get endDate(): Date | null { return this._endDate ?? null }
  get retirementAge(): number | null { return this._retirementAge ?? null }
  get isActive(): boolean | undefined { return this._isActive }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date | null | undefined { return this._updatedAt }

  // Métodos de negócio
  public updateDetails(
    newName: string,
    newStartDate: Date,
    newRealRate: number,
    newInflation: number,
    newLifeStatus: LifeStatus,
    newScenario?: string,
    newEndDate?: Date,
    newRetirementAge?: number,
    newIsActive?: boolean,
  ): void {
    if (!newName || newName.trim().length < 3) {
      throw new Error('Simulation name must be at least 3 characters long.')
    }
    if (newRealRate < 0 || newRealRate > 1) {
      throw new Error('Real rate must be between 0 and 1.')
    }
    if (newInflation < 0 || newInflation > 1) {
      throw new Error('Inflation must be between 0 and 1.')
    }
    if (!(newStartDate instanceof Date) || isNaN(newStartDate.getTime())) {
      throw new Error('Simulation start date is required and must be a valid date.')
    }

    this._name = newName
    this._startDate = newStartDate
    this._realRate = newRealRate
    this._inflation = newInflation
    this._lifeStatus = newLifeStatus
    if (newScenario !== undefined) this._scenario = newScenario
    if (newEndDate !== undefined) this._endDate = newEndDate
    if (newRetirementAge !== undefined) this._retirementAge = newRetirementAge
    if (newIsActive !== undefined) this._isActive = newIsActive
    this._updatedAt = new Date()
  }

  public createVersion(): Simulation {
    return Simulation.create({
      clientId: this._clientId,
      name: this._name,
      startDate: this._startDate,
      realRate: this._realRate,
      inflation: this._inflation,
      lifeStatus: this._lifeStatus,
      version: this._version + 1,
    })
  }
}