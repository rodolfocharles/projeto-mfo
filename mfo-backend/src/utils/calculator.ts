export class Calculator {
  static compound(principal: number, rate: number, periods: number): number {
    return principal * Math.pow(1 + rate, periods)
  }

  static installment(principal: number, rate: number, periods: number): number {
    const monthlyRate = rate / 12 / 100
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, periods)) /
      (Math.pow(1 + monthlyRate, periods) - 1)
    )
  }

  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  static monthsDiff(start: Date, end: Date): number {
    return (
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth())
    )
  }

  static applyInflation(value: number, monthlyInflationRate: number, monthsPassed: number): number {
    return value * Math.pow(1 + monthlyInflationRate, monthsPassed);
  }

  static isMovementActive(movement: any, currentPeriod: Date): boolean {
    const movementStartDate = new Date(movement.startDate);
    const movementEndDate = movement.endDate ? new Date(movement.endDate) : null;

    // Verifica se a movimentação está dentro do período de validade
    if (currentPeriod < movementStartDate || (movementEndDate && currentPeriod > movementEndDate)) {
      return false;
    }

    // Lógica de frequência (ajuste conforme seus enums de Frequency)
    switch (movement.frequency) {
      case 'MONTHLY': // Assumindo que 'MONTHLY' é um valor do seu enum
        return true; // Se é mensal e está dentro do período, está sempre ativa
      case 'YEARLY': // Assumindo que 'YEARLY' é um valor do seu enum
        return currentPeriod.getMonth() === movementStartDate.getMonth(); // Ativa apenas no mês de início
      case 'ONE_TIME': // Assumindo que 'ONE_TIME' é um valor do seu enum
        return currentPeriod.getFullYear() === movementStartDate.getFullYear() &&
               currentPeriod.getMonth() === movementStartDate.getMonth() &&
               currentPeriod.getDate() === movementStartDate.getDate(); // Ativa apenas na data exata
      default:
        return false;
    }
  }

  static isInsuranceActive(insurance: any, currentPeriod: Date): boolean {
    const insuranceStartDate = new Date(insurance.startDate);
    const insuranceEndDate = insurance.endDate ? new Date(insurance.endDate) : null;

    const isActive = currentPeriod >= insuranceStartDate &&
                     (!insuranceEndDate || currentPeriod <= insuranceEndDate);
    return isActive;
  }

  // NOVO: Função para calcular a idade
  static calculateAge(birthDate: Date, currentDate: Date): number {
    const dob = new Date(birthDate);
    const now = new Date(currentDate);

    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
}
