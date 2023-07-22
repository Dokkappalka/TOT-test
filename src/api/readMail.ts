import axios from 'axios'
import { IMail } from '../models/IMail'
//Можно было бы сделать по другому и использовать это для любого изменения письма в бд. Но я не сделал...
const readMail = async (id: string, mail: IMail) => {
  const data = { ...mail, isChecked: true }
  const response = await axios.put(`http://localhost:3001/mail/${id}`, data)
  return response.data
}

export default readMail
