import React, { Component } from 'react';
import Demo from "./newTables/Upload";
import DemoTrr from './newTables/Tree';
// import Table from "./newTables/Tables";
import Cheshi from "./cheshi/inputTables";
import BootTables from "./BootTables/BootTables"


import Table from "./newTablesUpname/Tables";
import './App.css';
import 'antd/dist/antd.css';
// import 'bootstrap/dist/css/bootstrap.css';
class App extends Component {
  render() {
    return (
      <div className="App"> 
        {/* <BootTables></BootTables> */}
        {/* <Cheshi></Cheshi> */}
        {/* <Demo></Demo> */}
        {/* <DemoTrr/> */}
        <Table></Table>
        
      </div>
    );
  }
}
export default App;
