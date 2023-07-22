import axios from 'axios'

const deleteDir = async (dir: number) => {
  const response = await axios.delete(`http://localhost:3001/dirs/${dir}`)
  return response.data
}

export default deleteDir
