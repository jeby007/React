//保存local(本地)数据的工具
import store from 'store'
const USER_KEY='user_key'
function setItem(name,value) {
  if (value&&typeof value!=='function'){
    store.set(name,value)
  }else {
    alert('不支持此类型的数据的存储')
  }
}
function getItem(name) {
  return store.get(name)||''
}
function removeItem(name) {
  store.remove(name)
}
export default {
  saveUser(user){
    setItem(USER_KEY,user)
  },
  getUser(){
    return getItem(USER_KEY)
  },
  removeUser(){
    removeItem(USER_KEY)
  }
}