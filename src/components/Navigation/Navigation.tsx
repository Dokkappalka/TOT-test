import React, { FormEvent, useEffect, useState } from 'react'
import styles from './Navigation.module.scss'
import { NavLink, useLocation } from 'react-router-dom'
import inputMail from '../../assets/inputMail.png'
import sentMail from '../../assets/sentMail.png'
import draftMail from '../../assets/draftMail.png'
import trashMail from '../../assets/trashMail.png'
import spamMail from '../../assets/spamMail.png'
import { observer } from 'mobx-react-lite'
import MailStore from '../../stores/MailStore'
import Modal from '../Modal/Modal'
const Navigation = observer(() => {
  const [modalInput, setModalInput] = useState<string>('')
  const [error, setError] = useState('')
  const [active, setActive] = useState(false)
  //Набор картинок для навигации. По хорошему нужно было хранить это на стороне сервера, но передо мной не стояло задачи по созданию и настройке качественного сервера
  const images = [inputMail, sentMail, draftMail, trashMail, spamMail]
  const { getDirs, dirs, AddNewDir } = MailStore
  const location = useLocation()
  const checkTitle = () => {
    var res: boolean = true
    dirs.map((e) => {
      if (e.title === modalInput.trim()) {
        res = false
      }
    })
    return res
  }
  useEffect(() => {
    if (active === false) {
      getDirs()
    }
  }, [active])
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (modalInput.trim() && checkTitle()) {
      await AddNewDir(modalInput)
      setActive(false)
      setError('')
      setModalInput('')
    } else {
      setError('Введите корректное и уникальное название')
    }
  }
  return (
    <nav className={styles.container}>
      {dirs.map((e, i) => {
        return (
          <NavLink
            key={e.id}
            to={`mail/?dir=${e.id}`}
            className={() =>
              location.pathname + location.search === `/mail/?dir=${e.id}`
                ? styles.activeLink
                : styles.link
            }
          >
            {images[i] && <img src={images[i]} alt='dirIcon' />}
            {e.title}
          </NavLink>
        )
      })}
      <button className={styles.addButton} onClick={() => setActive(true)}>
        Добавить папку
      </button>
      <Modal active={active} setActive={setActive}>
        <h2 className={styles.modalTitle}>Создание новой папки</h2>
        <form onSubmit={handleSubmit}>
          <p className={styles.modalP}>Придумайте название папке:</p>
          <input
            placeholder='Введите название...'
            className={styles.modalInput}
            value={modalInput}
            onChange={(e) => {
              setModalInput(e.target.value)
            }}
          />
          <button className={styles.modalButton} type='submit'>
            Создать
          </button>
        </form>
        <div className='text-center text-red-500 mt-5'>{error}</div>
      </Modal>
    </nav>
  )
})

export default Navigation
