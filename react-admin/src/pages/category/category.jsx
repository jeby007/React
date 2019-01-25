import React, {Component} from 'react'
import {Button, Table, Icon, Modal, Card, Form, Input, Select, message} from "antd";
import {reqCategorys, reqAddCategory, reqUpdateCategory} from "../../api";
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option


/*
管理的分类管理路由组件
 */
export default class Category extends Component {
  state = {
    categorys: [],  //一级分类列表
    subCategorys: [],   //二级分类列表
    isShowAdd: false,  //添加对话框
    isShowUpdate: false,  //修改分类名称对话框
    parentId: '0',
    parentName: ''
  }

  //获取一级分类
  getCategorys = async (Id) => {
    const parentId = Id || this.state.parentId
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.setState({
          categorys
        })
      } else {
        this.setState({subCategorys: categorys})
      }
    }
  }

  //添加分类
  addCategory = async () => {
    this.setState({
      isShowAdd: false
    })
    const {parentId, categoryName} = this.form.getFieldsValue()
    const result = await reqAddCategory(parentId, categoryName)
    this.form.resetFields()
    if (result.status === 0) {
      message.success('添加成功')
      if (parentId === this.state.parentId || parentId === '0') {
        this.getCategorys(parentId)
      }
    }
  }


  //显示更新分类界面
  showUpdate = (category) => {
    this.category = category
    this.setState({
      isShowUpdate: true
    })
  }
  //更新分类名称
  updateCategory = async () => {
    this.setState({
      isShowUpdate: false
    })
    const categoryId = this.category._id
    const {categoryName} = this.form.getFieldsValue()
    this.form.resetFields()
    const result = await reqUpdateCategory(categoryId, categoryName)
    if (result.status === 0) {
      message.success('修改分类成功')
      this.getCategorys()
    }
  }
  //显示二级分类
  showSubCategorys = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      this.getCategorys()
    })
  }

  //显示一级分类
  showCategory = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategory: []
    })
  }

  componentDidMount() {
    this.getCategorys()
  }

  componentWillMount() {
    this.columns = [{
      title: '分类名称',
      dataIndex: 'name',
    }, {
      title: '操作',
      width: 200,
      render: (category) => {
        return (
          <span>
            <a href="##" style={{marginRight: 15}} onClick={() => {
              this.showUpdate(category)
            }}>修改分类</a>
            <a href="##" onClick={() => this.showSubCategorys(category)}>查看子分类</a>
          </span>
        )
      }
    }]
  }

  render() {
    const columns = this.columns
    const {categorys, isShowAdd, isShowUpdate, parentId, subCategorys, parentName} = this.state
    const category = this.category || {}
    return (
      <div>
        <Card>
          {
            parentId === '0' ? <span style={{fontSize: 20}}>一级分类列表</span> : (
              <span>
                <a href='##' onClick={() => this.showCategory()}>一级分类</a>
                <Icon type="swap-right"/>
                <span>{parentName}</span>
              </span>
            )
          }

          <Button type='primary'
                  style={{float: 'right'}}
                  onClick={() => this.setState({isShowAdd: true})}>
            <Icon type='plus'/>
            添加分类
          </Button>
        </Card>

        <Table
          bordered
          rowKey='_id'
          columns={columns}
          dataSource={parentId === '0' ? categorys : subCategorys}
          //loading={!categorys || categorys.length===0}
          pagination={{defaultPageSize: 10, showSizeChanger: true, showQuickJumper: true}}
        />

        <Modal
          title="添加分类"
          visible={isShowAdd}
          onOk={this.addCategory}
          onCancel={() => this.setState({isShowAdd: false})}
          okText='确定'
          cancelText='取消'
        >
          <AddForm categorys={categorys} parentId={parentId} setForm={(form) => this.form = form}/>
        </Modal>
        <Modal
          title='更新分类'
          visible={isShowUpdate}
          onOk={this.updateCategory}
          onCancel={() => this.setState({isShowUpdate: false})}
          okText='确定'
          cancelText='取消'
        >
          <UpdateForm categoryName={category.name} setForm={(form) => this.form = form}/>
        </Modal>
      </div>
    )
  }
}


//添加分类的Form组件
class AddForm extends Component {

  static propTypes = {
    categorys: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired,
    parentId: PropTypes.string.isRequired,
  }


  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {

    const {getFieldDecorator} = this.props.form
    const {categorys,parentId} = this.props
    return (
      <Form>
        <Item label='所属分类'>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option key='0' value='0'>一级分类</Option>
                {
                  categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }
        </Item>

        <Item label='分类名称'>
          {
            getFieldDecorator('categoryName', {
              initialValue: ''
            })(
              <Input placeholder='请输入分类名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

AddForm = Form.create()(AddForm)

//更新分类的Form组件
class UpdateForm extends Component {

  static propTypes = {
    categoryName: PropTypes.string,
    setForm: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {

    const {getFieldDecorator} = this.props.form
    const {categoryName} = this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName
            })(
              <Input/>
            )
          }
        </Item>
      </Form>
    )
  }
}

UpdateForm = Form.create()(UpdateForm)

