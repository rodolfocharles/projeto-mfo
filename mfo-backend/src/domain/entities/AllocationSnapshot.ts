// src/domain/entities/AllocationSnapshot.ts
interface AllocationSnapshotProps {
  id?: string;
  clientId: string;
  date: Date;
  totalValue: number;
  // Adicione as novas propriedades aqui, tornando-as opcionais se for o caso
  financialValue?: number; // Adicionado
  immobilizedValue?: number; // Adicionado
  monthlyInterestRate?: number; // Adicionado
  monthlyInflationRate?: number; // Adicionado
  createdAt?: Date;
  updatedAt?: Date;
}

export class AllocationSnapshot {
  private _id: string;
  private _clientId: string;
  private _date: Date;
  private _totalValue: number;
  // Declare as novas propriedades como privadas na classe
  private _financialValue: number | undefined; // Adicionado
  private _immobilizedValue: number | undefined; // Adicionado
  private _monthlyInterestRate: number | undefined; // Adicionado
  private _monthlyInflationRate: number | undefined; // Adicionado
  private _createdAt: Date;
  private _updatedAt: Date | undefined;

  private constructor(props: AllocationSnapshotProps) {
    this._id = props.id || crypto.randomUUID();
    this._clientId = props.clientId;
    this._date = props.date;
    this._totalValue = props.totalValue;
    // Inicialize as novas propriedades com os valores de props
    this._financialValue = props.financialValue; // Adicionado
    this._immobilizedValue = props.immobilizedValue; // Adicionado
    this._monthlyInterestRate = props.monthlyInterestRate; // Adicionado
    this._monthlyInflationRate = props.monthlyInflationRate; // Adicionado
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
    // Você pode adicionar validações para as novas propriedades aqui se necessário
  }

  public static create(props: AllocationSnapshotProps): AllocationSnapshot {
    return new AllocationSnapshot(props);
  }

  // Getters
  get id(): string { return this._id; }
  get clientId(): string { return this._clientId; }
  get date(): Date { return this._date; }
  get totalValue(): number { return this._totalValue; }
  // Adicione os getters para as novas propriedades
  get financialValue(): number | undefined { return this._financialValue; } // Adicionado
  get immobilizedValue(): number | undefined { return this._immobilizedValue; } // Adicionado
  get monthlyInterestRate(): number | undefined { return this._monthlyInterestRate; } // Adicionado
  get monthlyInflationRate(): number | undefined { return this._monthlyInflationRate; } // Adicionado
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

  // Você pode adicionar métodos para atualizar as novas propriedades aqui, se necessário
  public updateFinancialValue(newValue: number): void {
    if (newValue < 0) {
      throw new Error('Financial value cannot be negative.');
    }
    this._financialValue = newValue;
    this._updatedAt = new Date();
  }
  // ... e assim por diante para as outras propriedades
}