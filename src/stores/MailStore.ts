import { makeAutoObservable, runInAction } from 'mobx'
import { IMail } from '../models/IMail'
import { getAllMail } from '../api/getAllMail'
import readMail from '../api/readMail'
import { IDir } from '../models/IDir'
import getAllDirs from '../api/getAllDirs'
import addDir from '../api/addDir'
import deleteDir from '../api/deleteDir'
import getCurrentMail from '../api/getCurrentMail'
import changeMail from '../api/changeMail'
import searchMessages from '../api/searchMessages'

class MailStore {
  searchMail: IMail[] = []
  mail: IMail[] = []
  dirs: IDir[] = []
  error: unknown
  chosenMessages: number[] = []
  currentMail: IMail[] = []
  isLoading = false
  constructor() {
    makeAutoObservable(this)
  }
  //Поисковая строка
  getSearchMail = async (search: string) => {
    try {
      const res = await searchMessages(search)
      this.searchMail = res
    } catch (e) {
      console.log(e)
    }
  }
  //Получение всех писем папки
  getMail = async (href: string) => {
    try {
      this.isLoading = true
      const res = await getAllMail(href)
      runInAction(() => {
        this.mail = res
        this.isLoading = false
      })
    } catch {
      this.isLoading = false
      console.log('Error')
    }
  }
  //Получение всех папок
  getDirs = async () => {
    try {
      const res = await getAllDirs()
      runInAction(() => {
        this.dirs = res
      })
    } catch {
      console.log('Error')
    }
  }
  //Метка "прочитано"
  checkMail = async (href: string, mail: IMail) => {
    try {
      const res = await readMail(href, mail)
      this.mail.forEach((e) => {
        if (e.id === mail.id) {
          e.isChecked = true
        }
      })
    } catch {
      //Надо бы нормально обработать ошибки...
      console.log('Error')
    }
  }
  //Добавить новую папку
  AddNewDir = async (title: string) => {
    try {
      const res = await addDir(title)
    } catch {
      console.log('Error')
    }
  }
  //Удалить выбранную папку
  deleteCurrentDir = async (href: number) => {
    try {
      const res = await deleteDir(href)
    } catch {
      console.log('Error')
    }
  }
  //Получение определенного письма по id
  GetOneMail = async (id: string) => {
    try {
      const res = await getCurrentMail(id)
      if (res[0]) {
        this.currentMail = res
      } else {
        throw new Error('Не удалось найти письмо')
      }
    } catch (e) {
      this.error = e
      console.log(e)
    }
  }
  //Редактировать что-либо в письме
  changeMailAction = async (href: number, mail: IMail) => {
    try {
      const res = await changeMail(href, mail)
    } catch {
      console.log('Error')
    }
  }
  //Обновить список писем, которые выбраны галочкой для перемещения
  EditChosenMessages = (id: number, mode: 'add' | 'remove' | 'clear') => {
    if (mode === 'add') {
      this.chosenMessages = [...this.chosenMessages, id]
    } else if (mode === 'clear') {
      this.chosenMessages = []
    } else if (mode === 'remove') {
      this.chosenMessages = this.chosenMessages.filter(
        (message) => id !== message
      )
    }
    console.log(this.chosenMessages)
  }
  //Указать ошибку
  setError = (error: unknown) => {
    this.error = error
  }
}

export default new MailStore()
