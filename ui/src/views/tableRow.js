function TableRow(index, to, amount, txnHash) {
    return (
        <tr>
        <td>{index+1}</td>
        <td>{to}</td>
        <td>{amount}</td>
        <td>{txnHash}</td>
      </tr>
    );
}

export default TableRow;