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
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  }

  static monthsDiff(start: Date, end: Date): number {
    return (
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth())
    )
  }
}
