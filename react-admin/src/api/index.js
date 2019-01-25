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

//添加或更新商品
export const reqAddUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

//删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

//搜索商品分页列表
export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax('/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName
})

//根据分类ID获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})


//获取指定的商品分类列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

//更新商品的上下架状态
export const reqUpdateStatus=(productId,status)=>ajax('/manage/product/updateStatus',{productId,status},'POST')

//添加角色
export const reqAddRole=(roleName)=>ajax('/manage/role/add',{roleName},'POST')

//获取角色列表
export const reqRoles=()=>ajax('/manage/role/list')

//更新角色
export const reqUpdateRoles=(role)=>ajax('/manage/role/update',role,'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

// 获取用户列表
export const reqUsers = () => ajax('/manage/user/list')

// 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')
