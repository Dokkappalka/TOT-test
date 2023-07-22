import React, { useEffect, useState } from 'react'
import styles from './MessagePage.module.scss'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import MailStore from '../../stores/MailStore'
import { observer } from 'mobx-react-lite'
import Modal from '../../components/Modal/Modal'

//Немного неправильно сделал, пожалуй...
const MessagePage = observer(() => {
  const [active, setActive] = useState(false) //Отображение модального окна перемещения папки
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)
  const id = query.get('id')
  const {
    currentMail,
    GetOneMail,
    dirs,
    changeMailAction,
    error,
    setError,
    checkMail,
  } = MailStore
  useEffect(() => {
    id && GetOneMail(id)
  }, [])
  if (id && currentMail[0] && currentMail[0].isChecked === false) {
    checkMail(id, currentMail[0])
  }
  const dirsFilter = (currentType: string) => {
    return (
      <>
        {dirs.map((dir) => {
          if (
            (dir.type === currentType || dir.type === 'universal') &&
            currentMail[0].dir !== dir.id
          ) {
            return (
              <button
                key={dir.id}
                className={styles.dirElement}
                onClick={() => {
                  changeMailAction(currentMail[0]?.id, {
                    ...currentMail[0],
                    dir: dir.id,
                  })
                  setActive(false)
                }}
              >
                {dir.title}
              </button>
            )
          }
        })}
      </>
    )
  }

  if (currentMail[0]) {
    return (
      <div className={styles.container}>
        <p className={styles.paragraph}>
          Отправитель: {currentMail[0]?.author}
        </p>
        <p className={styles.paragraph}>Получатель: {currentMail[0]?.to}</p>
        <h2 className={styles.title}>{currentMail[0]?.title}</h2>
        <p className={styles.body}>{currentMail[0]?.body}</p>
        <p className={styles.date}>{currentMail[0]?.date}</p>
        {currentMail[0].dir !== 3 && (
          <button
            className={styles.moveButton}
            onClick={() => {
              setActive(true)
            }}
          >
            Переместить в папку
          </button>
        )}
        <Modal active={active} setActive={setActive}>
          <h2 className={styles.modalTitle}>Выберите папку</h2>
          <div>{dirsFilter(currentMail[0].type)}</div>
          <button
            className={styles.modalCloseButton}
            onClick={() => {
              setActive(false)
            }}
          >
            Отмена
          </button>
        </Modal>
      </div>
    )
  } else if (error) {
    setError(null)
    return <Navigate to='/mail/?dir=1' />
  } else {
    return <></>
  }
})
//Я этим не горжусь...
export default MessagePage
