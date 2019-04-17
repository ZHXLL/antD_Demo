import React, { Component } from 'react';
import { Table, Tag, Breadcrumb , Upload, Button, Icon } from 'antd';
import axios from 'axios';
import "./Tables.css";

let count = 0;
//表格的文件属性
const columns = [{
  title: '文件名',
  dataIndex: 'isPath',
  className: "tabLeft",
  width: "50px",
  render: text => {
    if (text) {
      return <Tag color="geekblue">文件夹</Tag>
    } else {
      return <Tag color="blue">文件</Tag>
    }
  },
}, {
  title: '',
  dataIndex: 'name',
  className: "tabRight",
  render: text => <a href="javascript:;">{text}</a>,
}, {
  title: '大小',
  dataIndex: 'age',
}, {
  title: '修改日期',
  dataIndex: 'address',
}];


// 显示面板的内容的数据结构
const data = [{
  key: '1',
  name: 'John Brown',
  isPath: true,
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  isPath: true,
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  isPath: true,
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Joe Black',
  isPath: true,
  age: 32,
  address: 'Sidney No. 1 Lake Park',
},
{
  key: '6',
  name: 'Joe Black',
  isPath: false,
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

export default class componentName extends Component {
  constructor() {
    super();
    this.state = {
      dataArr: data,//默认数据 根目录文件夹的信息
      selectedRowKeys: [],//默认选中事件
      bread: [{//存储所有路径的guid 路径名称  bread.length-1 代表当前路径信息
        uid:"0x001",
        name:"src"
      }]
      
    }
  }


  rename=()=>{//重命名
    // let data = 
    console.log()
  }
  onclickEx=(record) => {//单机文件模拟变动 and 双击文件夹
    return {
      onClick: () => {
        count += 1;
        setTimeout(() => {
          if (count === 1) {
            this.selectRow(record);
          } else if (count === 2) {// 双击文件夹发送请求进入下一个文件夹
            console.log(record)
            if(!record.isPath){return }
            this.setState({
              selectedRowKeys:[],//清除选中状态
              bread: [...this.state.bread, {uid:"0x002",name:record.name}],//添加面包屑
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
            })
          }
          count = 0;
        }, 150);
      }
    }
  }

  onChange = (e) => {//选中事件
    console.log(e)
  }
  selectRow = (record) => {//联动事件
    console.log(record);
    const selectedRowKeys = [record.key];
    this.setState({ selectedRowKeys });
  }
  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  render() {
    let _this = this;
    let prop = {
      action:"http://localhost:8081/file_upload",
      showUploadList:false,
      directory:true,
      name:"logo",
      supportServerRender:true,
      onPreview:(e)=>{//点击文件链接或预览图标时的回调
        // console.log(1,e)
      },
      onChange:(e)=>{//上传文件改变时的状态，详见 onChange
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
      }){
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
              dataArr:[
                {
                  key:file.uid,
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
      action:"http://localhost:8081/file_upload",
      name:'logo',
      showUploadList:false,
      directory:false,
      onChange(e){
        console.log(e);
      }
    }

    
    //联动选择时的功能不能动
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    return (
      <div>
        <div className="uploadq">
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
          <Button>
              <Icon type="plus" />新建文件夹
          </Button>
            {this.state.selectedRowKeys.length>0?(
                <Button disabled={this.state.selectedRowKeys.length>1?true:false} onClick={this.rename}>
                    <Icon type="plus" />重命名
                </Button>):""
            }
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



