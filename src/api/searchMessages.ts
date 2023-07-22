import axios from 'axios'
import { IMail } from '../models/IMail'
const searhMessages = async (search: string) => {
  const response = await axios.get<IMail[]>(
    `${process.env.REACT_APP_API}/mail?q=${search}`
  )
  return response.data
}

export default searhMessages
