// src/domain/entities/Movement.ts

export class Movement {
  private constructor(
    public readonly id: string,
    public clientId: string,
    public name: string,
    public type: string,
    public value: number,
    public startDate: Date,
    public endDate: Date | null,
    public frequency: string,
    public isRecurrent: boolean,
    public isIndexed: boolean,
    public indexationRate: number | null,
    public readonly createdAt: Date,
    public updatedAt: Date | null,
  ) {}

  static create(props: {
    id: string
    clientId: string
    name: string
    type: string
    value: number
    startDate: Date
    endDate?: Date | null
    frequency: string
    isRecurrent: boolean
    isIndexed: boolean
    indexationRate?: number | null
    createdAt: Date
    updatedAt?: Date | null
  }): Movement {
    return new Movement(
      props.id,
      props.clientId,
      props.name,
      props.type,
      props.value,
      props.startDate,
      props.endDate ?? null,
      props.frequency,
      props.isRecurrent,
      props.isIndexed,
      props.indexationRate ?? null,
      props.createdAt,
      props.updatedAt ?? null,
    )
  }

  updateDetails(props: {
    name?: string
    type?: string
    value?: number
    startDate?: Date
    endDate?: Date | null
    frequency?: string
    isRecurrent?: boolean
    isIndexed?: boolean
    indexationRate?: number | null
  }): void {
    if (props.name !== undefined) this.name = props.name
    if (props.type !== undefined) this.type = props.type
    if (props.value !== undefined) this.value = props.value
    if (props.startDate !== undefined) this.startDate = props.startDate
    if (props.endDate !== undefined) this.endDate = props.endDate
    if (props.frequency !== undefined) this.frequency = props.frequency
    if (props.isRecurrent !== undefined) this.isRecurrent = props.isRecurrent
    if (props.isIndexed !== undefined) this.isIndexed = props.isIndexed
    if (props.indexationRate !== undefined) this.indexationRate = props.indexationRate
  }
}