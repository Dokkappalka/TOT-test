import axios from 'axios'
import { IMail } from '../models/IMail'

export const getAllMail = async (dir: string) => {
  const response = await axios.get<IMail[]>(
    `${process.env.REACT_APP_API}/mail?dir=${dir}`
  )
  return response.data
}
