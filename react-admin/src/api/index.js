import ajax from './ajax'
import jsonp from 'jsonp'
const BASE = 'http://localhost:5000'

//登录
export const reqLogin=(username,password)=>ajax('/login',{username,password},'POST')


//获取天气
export function reqWeather(city) {
  return new Promise( (resolve,reject)=> {
    const url=`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    //const url=`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=5slgyqGDENN7Sy7pw29IUvrZ`
    jsonp(url,{
      param:'callback'
    },(error,data)=>{
      if (!error){
        const {dayPictureUrl,weather}=data.results[0].weather_data[0]
        resolve({dayPictureUrl,weather})
      } else {
        alert('天气接口请求出错')
      }
    })
  })
}

//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')
//分类管理
//1.获取分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})

//2.添加分类
export const reqAddCategory=(parentId,categoryName)=>ajax('/manage/category/add',{
  parentId,categoryName
},'POST')

//3.更新（修改）品类名称
export const reqUpdateCategory=(categoryId,categoryName)=>ajax('/manage/category/update',{
  categoryId,categoryName
},'POST')