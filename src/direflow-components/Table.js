import React from "react";

const Table = () => {
  return <div>Table</div>;
};
export default Table;
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

export default Table;
