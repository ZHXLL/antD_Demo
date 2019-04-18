import React from 'react';
import {
  Table, Input, Button, Popconfirm, Form,
} from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext(); 

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  constructor(props){
    super();
  }
  componentDidMount(){
    if(this.props.record&&this.props.record.displayInp){
        this.input.focus();
    }
  }
  componentDidUpdate(){
    if(this.props.record&&this.props.record.displayInp){
        this.input.focus();
    }
  }
  save = (e) => {
    const { record, handleSave} = this.props;
    console.log(this.props);
    record.displayInp = false;
    this.setState()
    console.log(this.props)
    console.log()
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  }
  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                record.displayInp ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}//按下回车
                        onBlur={this.save}//失去焦点
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}


export {
    FormItem,
    EditableFormRow,
    EditableContext,
    EditableCell
};