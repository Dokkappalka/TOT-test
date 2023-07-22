import React, { useState, useEffect, useRef } from 'react'
import styles from './Header.module.scss'
import useDebounce from '../../hooks/useDebounce'
import MailStore from '../../stores/MailStore'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
const Header = observer(() => {
  const [search, setSearch] = useState('')
  const [listVliew, setListView] = useState(false)
  const { searchMail, getSearchMail } = MailStore
  const debounced = useDebounce(search)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: any) =>
      searchRef.current &&
      (searchRef.current.contains(e.target) || setListView(false))
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])
  useEffect(() => {
    if (debounced.length > 3) {
      getSearchMail(debounced)
    }
  }, [debounced])
  //Не хватает времени на страницу с результатами поиска...
  return (
    <div className={styles.container}>
      <p className={styles.title}>ReactM@il</p>
      <div className='mx-auto' ref={searchRef}>
        <input
          onFocus={() => {
            setListView(true)
          }}
          className={styles.search}
          placeholder='Поиск по почте...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className={styles.messagesContainer}>
          {searchMail.length > 0 &&
            search.length > 3 &&
            listVliew &&
            searchMail.map((mail) => {
              return (
                <li
                  className='py-2 px-4 hover:bg-sky-100 duration-200 border-b'
                  key={mail.id}
                >
                  <Link
                    className='w-full h-full block'
                    to={`/message?id=${mail.id}`}
                    onClick={() => {
                      setSearch('')
                      setListView(false)
                    }}
                  >
                    {mail.title}
                  </Link>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
})

export default Header
