declare module 'lunar-javascript' {
  namespace Lunar {
    class Lunar {
      static fromDate(date: Date): Lunar;
      getMonthInChinese(): string;
      getDayInChinese(): string;
    }
  }
  export = Lunar;
}
