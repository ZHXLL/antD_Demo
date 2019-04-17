import React, { Component } from 'react'
import { Upload, Button, Icon } from 'antd';
import axios from 'axios';
import { Tree } from 'antd';
const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;
export default class upload extends Component {
  constructor(){
    super();
    this.data={
        guid:"0x001",
        pathName:"src",
        isPath:true,
        children:[
          {
            guid:"0x001",
            pathName:"src",
            isPath:true,
          }
        ]
    }
  }
  onSelect = (keys, event) => {
    console.log('Trigger Select', keys, event);
  }
  onExpand = () => {
    console.log('Trigger Expand');
  }
  
  render() {
    let prop = {
      action:"http://localhost:8081/file_upload",
      showUploadList:false,
      directory:true,
      name:"logo",
      supportServerRender:true,
      onPreview:(e)=>{
        // console.log(1,e)
      },
      onChange:(e)=>{
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
    }
    return (
      <div>
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
      </div>
    )
  }
};

//<input title="点击选择文件夹" id="h5Input2" multiple="" webkitdirectory="" accept="*/*" type="file" name="html5uploader"/>