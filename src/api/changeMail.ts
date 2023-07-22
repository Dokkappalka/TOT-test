import axios from 'axios'
import { IMail } from '../models/IMail'

const changeMail = async (elem: number, mail: IMail) => {
  const response = await axios.put(`http://localhost:3001/mail/${elem}`, mail)
  return response.data
}

export default changeMail
