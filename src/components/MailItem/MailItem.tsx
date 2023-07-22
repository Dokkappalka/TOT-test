import React, { useState, useEffect, useRef } from 'react'
import styles from './MailItem.module.scss'
import { Link } from 'react-router-dom'
import { IMail } from '../../models/IMail'
import MailStore from '../../stores/MailStore'

const MailItem = ({
  author,
  title,
  body,
  date,
  isChecked,
  to,
  id,
  type,
  dir,
}: IMail) => {
  const checkboxRef = useRef<HTMLInputElement>(null)
  const { EditChosenMessages, dirs, chosenMessages } = MailStore
  const currentDir = dirs.find((e) => Number(dir) === e.id)
  let result = ''
  const resultTitle = type === 'sent' ? `To: ${to}` : author
  const authorLetters = resultTitle.split('')
  if (authorLetters.length > 27) {
    authorLetters.forEach((e, i) => {
      if (i < 28) {
        result += e
      }
    })
    result += '...'
  } else {
    result = resultTitle
  }
  useEffect(() => {
    EditChosenMessages(0, 'clear')
  }, [])
  return (
    <Link
      to={`/message?id=${id}`}
      className={
        isChecked === false ? styles.container : styles.checkedContainer
      }
    >
      <div className='flex justify-start'>
        {currentDir?.type !== 'none' && (
          <input
            ref={checkboxRef}
            type='checkbox'
            className={styles.checkbox}
            checked={chosenMessages.includes(id)}
            onClick={(e) => {
              e.stopPropagation()
            }}
            onChange={(e) => {
              checkboxRef.current
                ? (checkboxRef.current.checked = !checkboxRef.current.checked)
                : alert('') //fix
              if (!checkboxRef.current?.checked) {
                EditChosenMessages(id, 'add')
              } else if (checkboxRef.current?.checked) {
                EditChosenMessages(id, 'remove')
              }
            }}
          />
        )}
        <p className={styles.title}>{result}</p>
        <span className={styles.body}>
          {title} - {body}
        </span>
      </div>
      <div>
        <span className={styles.date}>{date}</span>
      </div>
    </Link>
  )
}

export default MailItem
