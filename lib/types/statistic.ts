export type SingleStatisticElement = {
  total: number
  yesterdayTotal: number
  todayTotal: number
  title: number
}

export type StatisticResponse = {
  data: {
    users?: SingleStatisticElement[]
    content?: SingleStatisticElement[]
    groups?: SingleStatisticElement[]
  }
}
