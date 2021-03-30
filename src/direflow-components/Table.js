import React from "react";
import { Table, Button, Space } from "antd";

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];

class TableOfEntities extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
  };
  //componentDidUpdate//useEffect

  handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: "descend",
        columnKey: "age",
      },
    });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        filters: [
          { text: "Joe", value: "Joe" },
          { text: "Jim", value: "Jim" },
        ],
        filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
        sorter: (a, b) => a.age - b.age,
        sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        filters: [
          { text: "London", value: "London" },
          { text: "New York", value: "New York" },
        ],
        filteredValue: filteredInfo.address || null,
        onFilter: (value, record) => record.address.includes(value),
        sorter: (a, b) => a.address.length - b.address.length,
        sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
        ellipsis: true,
      },
    ];
    return (
      <>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={this.setAgeSort}>Sort age</Button>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </Space>
        <Table
          columns={columns}
          dataSource={data}
          onChange={this.handleChange}
        />
      </>
    );
  }
}

export default TableOfEntities;

/*import React from "react";

const Table = () => {
  return <div>Table</div>;
};
export default Table;*/
// class Table extends Component {
//    constructor(props) {
//       super(props)
//       //hardcoded data to test
//       this.state = {
//          students: [
//             { id: 1, name: 'Joel', age: 21, email: 'joel@simtlix.com' },
//             { id: 2, name: 'Monse', age: 19, email: 'monse@simtlix.com' },
//             { id: 3, name: 'Marian', age: 16, email: 'marian@simtlix.com' },
//             { id: 4, name: 'Emi', age: 25, email: 'emi@simtlix.com' }
//          ]
//       }
//    }

//    renderTableData(){
//     return this.state.students.map((student, index) => {
//         const { id, name, age, email } = student //destructuring
//         console.log(student);
//         return (
//            <tr key={id}>
//               <td>{id}</td>
//               <td>{name}</td>
//               <td>{age}</td>
//               <td>{email}</td>
//            </tr>
//         )
//      })
//    }

//    renderTableHeader(){
//     let header = Object.keys(this.state.students[0])
//     return header.map((key, index) => {
//        return <th key={index}>{key.toUpperCase()}</th>
//     })
//    }

//    render() {
//     return (
//         <Styled styles={tableStyles}>
//             <div>
//                 <h1 id='title'>Render a table to display all the entries of an entity</h1>
//                 <table id='students'>
//                     <tbody>
//                         <tr>{this.renderTableHeader()}</tr>
//                         {this.renderTableData()}
//                     </tbody>
//                 </table>
//             </div>
//         </Styled>
//      )
//    }
// }
