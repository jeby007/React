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
    categorys: [],
    isShowAdd: false
  }

  //获取一级分类
  getCategorys = async () => {
    const result = await reqCategorys('0')
    if (result.status === 0) {
      const categorys = result.data
      this.setState({
        categorys
      })
    }
  }

  //添加分类
  addCategory = async () => {
    this.setState({
      isShowAdd: false
    })
    const {parentId, categoryName} = this.form.getFieldsValue()
    const result = await reqAddCategory(parentId, categoryName)
    if (result.status === 0) {
      message.success('添加成功')
      this.getCategorys()
    }
  }


  componentDidMount () {
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
            <a href="##" style={{marginRight: 5}}>修改分类</a>
            <a href="##">查看子分类</a>
          </span>
        )
      }
    }]
  }
  render() {
    const columns = this.columns
    const {categorys, isShowAdd} = this.state
    return (
      <div>
        <Card>
          <span style={{fontSize: 20}}>一级分类列表</span>
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
          dataSource={categorys}
          loading={!categorys || categorys.length===0}
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
          <AddForm categorys={categorys} setForm={(form) => this.form = form}/>
        </Modal>
      </div>
    )
  }
}

class AddForm extends Component {

  static propTypes = {
    categorys: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired,
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render () {

    const {getFieldDecorator} = this.props.form
    const {categorys} = this.props
    return (
      <Form>
        <Item label='所属分类'>
          {
            getFieldDecorator('parentId', {
              initialValue: '0'
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
