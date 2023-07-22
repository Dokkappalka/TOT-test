import axios from 'axios'
import { IDir } from '../models/IDir'
const getAllDirs = async () => {
  const response = await axios.get<IDir[]>(`${process.env.REACT_APP_API}/dirs`)
  return response.data
}

export default getAllDirs
