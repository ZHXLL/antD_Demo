import React from 'react';
import {Tree, Input} from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const DirectoryTree = Tree.DirectoryTree;
const getParentKey = (title, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some(item => item.title === title)) {
                parentKey = node.key;
            } else if (getParentKey(title, node.children)) {
                parentKey = getParentKey(title, node.children);
            }
        }
    }
    return parentKey;
};

const dataList = [];

const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({key, title: node.title});
        if (node.children) {
            generateList(node.children);
        }
    }
};

/*对于异步加载的子节点使用该key进行自增赋值*/
let key = 10;

class SearchTree extends React.Component {
    state = {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        defaultExpandParent:false,
        gData: [
            {
                title: 'parent1',
                key: '1',
                children: [
                    {
                        title: 'parent2',
                        key: '2',
                        children: [
                            {
                                title: 'leaf1',
                                key: '3',
                                isLeaf:true,
                            },
                            {
                                title: 'leaf2',
                                key: '4',
                                isLeaf:true,
                            },
                            {
                                title: 'leaf3',
                                key: '5',
                                isLeaf:true,
                            }
                        ]
                    },
                    {
                        title: 'parent3',
                        key: '6',
                        children: [
                            {
                                title: 'leaf4',
                                key: '7',
                                isLeaf:true,
                            },
                            {
                                title: 'leaf5',
                                key: '8',
                                isLeaf:true,
                            },
                            {
                                title: 'leaf6',
                                key: '9',
                                isLeaf:true,
                            }
                        ]
                    },
                ]
            }
        ]
    }
    onSelect = (selectedKeys, info) => {
        /*用于打开该节点的详细信息*/
        // console.log('selected', selectedKeys, info);
        // console.log(this.state.expandedKeys);
    };
    onCheck = (e)=>{
        console.log(e);
    }
    onExpand = (expandedKeys) => {
        console.log(expandedKeys)
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return getParentKey(item.title, this.state.gData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };

    loop = data => data.map((item) => {
        let {searchValue} = this.state;
        let {isLeaf} = item;
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title = index > -1 ? (
            <span>
                {beforeStr}
                <span style={{color: '#f50'}}>{searchValue}</span>
                {afterStr}
                </span>
        ) : <span>{item.title}</span>;
        if (item.children) {
            return (
                <TreeNode key={item.key} title={title} dataRef={item} >
                    {this.loop(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode dataRef={item} key={item.key} title={title} isLeaf={isLeaf}/>
    });

    onLoadData = (treeNode) => {
        console.log(treeNode)
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            setTimeout(() => {
                // console.log(treeNode.props.dataRef.children)
                // treeNode.props.dataRef.children = [
                //     { title: 'Child', key: (++key + '')},
                //     { title: 'Child', key: (++key + '')},
                // ];
                
                this.setState({
                    gData: [...this.state.gData],
                });
                resolve();
            }, 1000);
        });
    };

    render() {
        const {expandedKeys, autoExpandParent, gData,defaultExpandParent} = this.state;
        // console.log(expandedKeys, autoExpandParent, gData)
        // 进行数组扁平化处理
        generateList(gData);
        return (
            <div style={{marginBottom: '200px'}}>
                {/* <Search style={{marginBottom: 8}} placeholder="Search" onChange={this.onChange}/> */}
                <DirectoryTree
                    onSelect={this.onSelect}
                    defaultExpandParent={defaultExpandParent}
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    loadData={this.onLoadData}
                    onCheck={this.onCheck}
                >
                    {this.loop(gData)}
                </DirectoryTree>
            </div>
        );
    }
}

export default SearchTree;