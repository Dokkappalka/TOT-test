import axios from 'axios'

const addDir = async (title: string) => {
  const response = await axios.post(`${process.env.REACT_APP_API}/dirs`, {
    title: title,
    type: 'universal',
  })
  return response.data
}

export default addDir
