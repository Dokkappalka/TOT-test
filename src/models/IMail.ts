export interface IMail {
  id: number
  title: string
  body: string
  to: string
  author: string
  type: string
  isChecked?: boolean
  date: string
  dir: string | number
}
