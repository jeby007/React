import React, {Component} from 'react'
import {Row, Col, Modal} from 'antd'
import {reqWeather} from "../../api";
import {formateDate} from "../../utils/utils";
import MemoryUtils from '../../utils/MemoryUtils'
import storageUtils from '../../utils/storageUtils'
import {withRouter} from "react-router-dom";
import './header.less'
import menuList from "../../config/menuConfig";

/*
头部组件
 */
class Header extends Component {
  state = {
    sysTime: formateDate(Date.now()),
    dayPictureUrl: '',
    weather: ''
  }

  //发送ajax获取天气状态
  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('北京')
    this.setState({
      dayPictureUrl, weather
    })
  }
  //每个1s跟新一次时间
  getSysTime = () => {
    this.timer = setInterval(() => {
      this.setState({
        sysTime: formateDate(Date.now())
      })
    }, 1000)
  }
  //退出登录
  outlogin = () => {
    Modal.confirm({
      cancelText: '取消',
      okText: '确定',
      content: '你确定要退出吗?',
      onOk: () => {
        console.log('确定');
        storageUtils.removeUser()
        MemoryUtils.user = {}
        this.props.history.replace('/login')
      },
      onCancel() {
        console.log('取消');
      },
    })
  }

  componentWillMount() {
    this.getWeather()
    this.getSysTime()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  //根据请求path得到对应的标题
  getTitle = (path) => {
    let menuName
    for (let i = 0; i < menuList.length; i++) {
      let menu = menuList[i]
      if (menu.key == path) {
        menuName = menu.title
        break
      } else if (menu.children) {
        for (let j = 0; j < menu.children.length; j++) {
          const menuL = menu.children[j]
          if (path.indexOf(menuL.key) === 0) {
            menuName = menuL.title
            break
          }
        }
        if (menuName) {
          break
        }
      }
    }
    return menuName || '首页'
  }


  render() {
    const {sysTime, dayPictureUrl, weather} = this.state
    const user = MemoryUtils.user
    const path = this.props.location.pathname
    const title = this.getTitle(path)

    return (
      <div className='header'>
        <Row className='header-top'>
          <span style={{float:'left',color:'red',fontWeight:'bold'}}>React贼啦难!</span>
          <span>欢迎，{user.username}</span>
          <a href="##" onClick={this.outlogin}>退出</a>
        </Row>
        <Row className='breadcrumb'>
          <Col span={4} className='breadcrumb-title'>
            {title}
          </Col>
          <Col span={20} className='weather'>
            <span className='date'>{sysTime}</span>
            <span className='weather-img'>
              <img src={dayPictureUrl} alt="weather"/>
            </span>
            <span className='weather-detail'>{weather}</span>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(Header)