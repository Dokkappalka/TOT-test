import axios from 'axios'
import { IMail } from '../models/IMail'
const getCurrentMail = async (id: string) => {
  const response = await axios.get<IMail[]>(
    `${process.env.REACT_APP_API}/mail?id=${id}`
  )
  return response.data
}

export default getCurrentMail
