import React, { Component } from 'react';
import { Table, Tag, Breadcrumb, Upload, Button, Icon,Input,Popconfirm } from 'antd';
import axios from 'axios';
import "./Tables.css";
import {EditableFormRow,EditableCell} from "./Upname";
const ButtonGroup = Button.Group;
let count = 0;
//表格的文件属性
// let columns = ;
// 显示面板的内容的数据结构
const data = [{
  key: '1',
  name: 'John Brown',
  isPath: true,
  age: 32,
  address: 'New York No. 1 Lake Park',
  displayInp:false
}, {
  key: '2',
  name: 'Jim Green',
  isPath: true,
  age: 42,
  address: 'London No. 1 Lake Park',
  displayInp:false
}, {
  key: '3',
  name: 'Joe Black',
  isPath: true,
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  displayInp:false
}, {
  key: '4',
  name: 'Joe Black',
  isPath: true,
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  displayInp:false
},
{
  key: '6',
  name: 'Joe Black',
  isPath: false,
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  displayInp:false
}];

export default class componentName extends Component {
  constructor() {
    super();
    this.state = {
      dataArr: data,//默认数据 根目录文件夹的信息
      columns: [{
        title: '',
        dataIndex: 'isPath',
        className: "tabLeft",
        width: "50px",
        render: text => {
          if (text) {
            return <Icon style={{ fontSize: "20px" }} type="folder" />
          } else {
            return <Icon style={{ fontSize: "20px" }} type="file" />
          }
        },
      }, {
        title: '',
        dataIndex: 'name',
        className: "tabRight",
        editable: true,
        render: (text,e) => <a onClick={(on)=>{this.toPath(e,on)}} className="path_have">{text}</a>,
      }, {
        title: '',
        dataIndex: 'age',
      }, {
        title: '',
        dataIndex: 'address',
      }],
      selectedRowKeys: [],//默认选中事件
      bread: [{//存储所有路径的guid 路径名称  bread.length-1 代表当前路径信息
        uid: "0x001",
        name: "src"
      }]
    }
  }


  rename = () => {//重命名
    const key = this.state.selectedRowKeys[0];
    let newData = [...this.state.dataArr];
    newData.find((item)=>item.key==key).displayInp = true;
    this.setState({
      dataArr:newData
    });
  }
  newFolder = ()=>{//新建文件夹
    console.log(1);
    let data = [...this.state.dataArr];
    data.unshift({
      key: parseInt(Math.random()*10*100),
      name: '新建文件夹',
      isPath: true,
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      displayInp:true
    })
    this.setState({
      dataArr:data,
      selectedRowKeys:[data[0].key]
    });

  }
  deleteName = ()=>{
    let {selectedRowKeys:keyArr,dataArr} = this.state;
    let newDataArr = dataArr;
    keyArr.forEach((item)=>{
      newDataArr = newDataArr.filter((items)=>items.key!=item)
    });
    this.setState({
      dataArr:newDataArr,
      selectedRowKeys:[]
    })
  }

  toPath(record,e){
    // console.log(e)
    e?e.stopPropagation():
    setTimeout(()=>{clearTimeout(this.state.t)},0)
    this.setState({
      selectedRowKeys: [],//清除选中状态
      bread: [...this.state.bread, { uid: "0x002", name: record.name }],//添加面包屑
      dataArr: [{
        key: '1',
        name: '路飞',
        isPath: true,
        age: 32,
        address: 'Nk',
      }, {
        key: '2',
        name: '索隆',
        isPath: true,
        age: 42,
        address: 'London No. 1 Lake Park',
      }, {
        key: '3',
        name: '山治',
        isPath: true,
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      }]
    });
  }


  onclickEx = (record) => {//单机文件模拟变动 and 双击文件夹
    return {
      onClick: () => {
        count += 1;
        this.state.t = setTimeout(() => {
          if (count === 1) {
            this.selectRow(record);
          } else if (count === 2) {// 双击文件夹发送请求进入下一个文件夹
            if (!record.isPath) { return }
            // console.log(e)
            this.toPath(record);
          }
          count = 0;
        }, 150);
      }
    }
  }
  onChange = (e) => {//选中事件
    console.log(1);
    console.log(e);
  }
  selectRow = (record) => {//联动事件
    const selectedRowKeys = [record.key];
    this.setState({ selectedRowKeys });
  }
  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  handleSave = (row) => {
    const newData = [...this.state.dataArr];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataArr: newData });
    console.log("重命名好了")
  }

  render() {
    let _this = this;
    let prop = {
      action: "http://localhost:8081/file_upload",
      showUploadList: false,
      directory: true,
      name: "logo",
      supportServerRender: true,
      onPreview: (e) => {//点击文件链接或预览图标时的回调
        // console.log(1,e)
      },
      onChange: (e) => {//上传文件改变时的状态，详见 onChange
        // console.log(e.file.originFileObj.webkitRelativePath)
      },
      customRequest({
        action,
        data,
        file,
        filename,
        headers,
        onError,
        onProgress,
        onSuccess,
        withCredentials,
      }) {
        console.log(file);
        const formData = new FormData();
        if (data) {
          Object.keys(data).map(key => {
            formData.append(key, data[key]);
          });
        }
        formData.append(filename, file);

        axios
          .post(action, formData, {
            withCredentials,
            headers,
            onUploadProgress: ({ total, loaded }) => {
              onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
            },
          })
          .then(({ data: response }) => {
            let pathAff = file.webkitRelativePath.split("/");//上传成功后应返回新文件夹的guid
            _this.setState({
              dataArr: [
                {
                  key: file.uid,
                  name: pathAff[0],
                  isPath: true,
                  age: 32,
                  address: 'New York No. 1 Lake Park',
                },
                ..._this.state.dataArr
              ]
            })
            onSuccess(response, file);
          })
          .catch(onError);

        return {
          abort() {
            console.log('upload progress is aborted.');
          },
        };
      }

    }
    let SingleProp = {
      action: "http://localhost:8081/file_upload",
      name: 'logo',
      showUploadList: false,
      directory: false,
      onChange(e) {
        console.log(e);
      }
    }
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.state.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
           return {
              record,
              editable: col.editable,
              dataIndex: col.dataIndex,
              title: col.title,
              handleSave: this.handleSave,
            }
        },
      };
    });
    //联动选择时的功能不能动
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
      getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
      })
    };
    return (
      <div>
        <div className="uploadq">

          <ButtonGroup>
            <Upload {...SingleProp}>
              <Button>
                <Icon type="upload" />上传文件
              </Button>
            </Upload>
            <Upload {...prop}>
              <Button>
                <Icon type="upload" />上传文件夹
              </Button>
            </Upload>
            <Button onClick={this.newFolder}>
                <Icon type="plus" />新建文件夹
            </Button>
            {this.state.selectedRowKeys.length > 0 ? (
              <Button onClick={this.deleteName}>
                <Icon type="delete" />删除文件
                </Button>) : ""
            }
            {this.state.selectedRowKeys.length > 0 ? (
              <Button disabled={this.state.selectedRowKeys.length > 1 ? true : false} onClick={this.rename}>
                <Icon type="plus" />重命名
                </Button>) : ""
            }
          </ButtonGroup>

        </div>
        <div className="breadBox">
          <div>
            {
              this.state.bread.length > 1 ? <a href="">返回上一页</a> : ""
            }
          </div>
          <Breadcrumb >
            {
              this.state.bread.map((item) => {
                return (
                  <Breadcrumb.Item key={item.uid}>{item.name}</Breadcrumb.Item>
                )
              })
            }
          </Breadcrumb>
        </div>
        <Table
          components={components}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.dataArr}
          onChange={this.onChange}
          onRow={this.onclickEx}
        />
      </div>
    )
  }
}



