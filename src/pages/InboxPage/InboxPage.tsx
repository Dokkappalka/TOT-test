import React, { useEffect, useState } from 'react'
import styles from './Inboxpage.module.scss'
import MailItem from '../../components/MailItem/MailItem'
import { observer } from 'mobx-react-lite'
import mailStore from '../../stores/MailStore'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Modal from '../../components/Modal/Modal'
import { IDir } from '../../models/IDir'
const InboxPage = observer(() => {
  const [moveActive, setMoveActive] = useState(false) //Отображение модального окна при перемещении писем
  const [active, setActive] = useState(false) //Отображение модального окна удаления
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)
  const dir = query.get('dir')
  const {
    getMail,
    mail,
    isLoading,
    deleteCurrentDir,
    changeMailAction,
    dirs,
    chosenMessages,
    EditChosenMessages,
    currentMail,
  } = mailStore
  useEffect(() => {
    dir && getMail(dir)
  }, [dir, currentMail])

  const draftsDirId = dirs.find((e) => e.type === 'none')?.id //Ищет id директории с черновиками, чтобы обрабатывать её отедьно
  //Возвращает только нуужные директории Возможно, есть смысл убрать это в другое место и сделать всё аккуратнее...
  const dirsFilter = () => {
    const handleButton = (e: IDir) => {
      chosenMessages.forEach((elem) => {
        const resMail = mail.find((mes) => mes.id === elem)
        resMail &&
          changeMailAction(elem, {
            ...resMail,
            dir: e.id,
          })
      })
      //Я понимаю, что отправляю много запросов. Сваливаю всё на json-server.
      EditChosenMessages(0, 'clear')
      setMoveActive(false)
      window.location.reload()
      navigate(`mail/?dir=${e.id}`)
    }
    const handleInboxButton = () => {
      chosenMessages.forEach((elem) => {
        const resMail = mail.find((mes) => mes.id === elem)
        if (resMail?.type === 'inbox') {
          changeMailAction(elem, {
            ...resMail,
            dir: 1,
          })
        } else if (resMail?.type === 'sent') {
          changeMailAction(elem, {
            ...resMail,
            dir: 2,
          })
        }
      })
      EditChosenMessages(0, 'clear')
      setMoveActive(false)
      window.location.reload()
      navigate(`/mail/?dir=1`)
    }
    return (
      <>
        {Number(dir) !== 1 &&
          Number(dir) !== 2 && ( //Возможно, хардкод. Но вроде бы и нет)))
            <button className={styles.dirElement} onClick={handleInboxButton}>
              Входящие/исходящие
            </button>
          )}
        {dirs.map((e) => {
          if (e.type === 'universal' && Number(dir) !== e.id) {
            return (
              <button
                key={e.id}
                className={styles.dirElement}
                onClick={() => {
                  handleButton(e)
                }}
              >
                {e.title}
              </button>
            )
          }
        })}
      </>
    )
  }
  if (isLoading) {
    return <div className='text-center text-2xl font-semibold'>Loading...</div>
  }
  //Вот тут я запутался... Пытался обработать переход в папку, которой нету с помощью <Navigate /> Но столкнулся с проблемой, при которой после каждого перемещения/удаления меня возвращало во "Вхлдящие." Я понимаю, почему так работает, но не понимаю, как мне сделать так, чтобы работало правильно. Скорее всего мне просто не хватило времени...
  if (!dirs.find((e) => e.id === Number(dir)) && !isLoading) {
    return <div>Что-то пошло не так...</div>
  }
  return (
    <div className={styles.container}>
      <div className='flex justify-between items-center'>
        {Number(dir) !== draftsDirId && mail.length > 0 && (
          <button
            className='flex justify-center items-center mb-5 text-white bg-orange-400 rounded py-1 px-2 hover:bg-orange-300 duration-200'
            onClick={() => {
              chosenMessages.length === 0
                ? mail.forEach((e) => {
                    EditChosenMessages(e.id, 'add')
                  })
                : EditChosenMessages(0, 'clear')
            }}
          >
            Выбрать всё
          </button>
        )}
        {Number(dir) !== draftsDirId && chosenMessages.length > 0 && (
          <button
            className='flex justify-center items-center mb-5 text-white bg-teal-400 rounded py-1 px-2 hover:bg-teal-300 duration-200'
            onClick={() => {
              setMoveActive(true)
            }}
          >
            Переместить в...
          </button>
        )}
        <Modal active={moveActive} setActive={setMoveActive}>
          <h2 className='text-xl mb-5'>
            Выберите папку, в которые хотите поместить сообщения:
          </h2>
          <div>
            {dirsFilter()}
            <button
              className={styles.modalCloseButton}
              onClick={() => {
                setMoveActive(false)
              }}
            >
              Отмена
            </button>
          </div>
        </Modal>
        {Number(dir) >= 6 && (
          <div className='flex justify-end'>
            <button
              className='flex justify-center items-center mb-5 text-white bg-red-500 rounded py-1 px-2 hover:bg-red-300 duration-200'
              onClick={async () => {
                setActive(true)
              }}
            >
              Удалить папку
            </button>
            <Modal active={active} setActive={setActive}>
              <h2 className='text-xl'>
                Вы действительно хотите удалить эту папку? Все письма из неё
                будут перемещены в корзину.
              </h2>
              <button
                className='flex justify-center items-center mb-1 text-white bg-red-500 rounded py-1 px-2 hover:bg-red-300 duration-200 mx-auto mt-10'
                onClick={async () => {
                  await deleteCurrentDir(Number(dir))
                  mail.forEach(async (e) => {
                    //Пожалуй, из-за возможностей json-server (или моих познаниях в нём) я не смог сделать лучше... Ну, разве что директорию корзины выделить не только по id...
                    if (e.dir == dir) {
                      await changeMailAction(e.id, {
                        ...e,
                        dir: 4,
                      })
                    }
                  })
                  navigate('/mail/?dir=1')
                  window.location.reload()
                }}
              >
                Удалить папку
              </button>
            </Modal>
          </div>
        )}
      </div>
      {mail.length ? (
        mail.map((item) => {
          if (item.dir == dir) {
            return (
              <MailItem
                key={item.id}
                author={item.author}
                title={item.title}
                body={item.body}
                date={item.date}
                isChecked={item.isChecked}
                type={item.type}
                id={item.id}
                to={item.to}
                dir={item.dir}
              />
            )
          }
        })
      ) : (
        <div className='text-center text-xl'>Здесь нет писем...</div>
      )}
    </div>
  )
})

export default InboxPage
