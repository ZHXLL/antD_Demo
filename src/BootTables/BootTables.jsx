import React, { Component } from 'react'
import { Table, Tag, Breadcrumb, Upload, Button, Icon, Input, Popconfirm } from 'antd';

import "./BootTables.css";
export default class BootTables extends Component {
    state = {
        dataArr: [
            {
                key: '1',
                name: 'John Brown',
                isPath: true,
                age: 32,
                address: 'New York No. 1 Lake Park',
                displayInp: false
            },
            {
                key: '2',
                name: 'John Room',
                isPath: true,
                age: 32,
                address: 'New York No. 1 Lake Park',
                displayInp: false
            }
        ]
    }
    render() {
        let { dataArr } = this.state;
        return (
            <div>
                <div className="list-group">
                    {
                        dataArr.map((item) => {
                            return (
                                <div key={item.key} className="list-group-item list_item">
                                    <div className="item_input_che"><input type="checkbox" /></div>
                                    <div className="item_txt"><Icon style={{ fontSize: "20px" }} type="folder" />{item.name}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
