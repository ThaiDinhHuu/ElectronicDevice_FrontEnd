import { Button, Divider, Radio, Table } from 'antd';
import React, { useMemo, useState } from 'react'
import Loading from '../LoadingComponent/Loading'
import { Excel } from "antd-table-saveas-excel";

const TableComponent = (props) => {
      const { data: dataSource = [], isLoading = false, columns = [] } = props

      const newColumnExport = useMemo(() => {
            const arr = columns?.filter((col) => col.dataIndex !== 'action')
            return arr
      }, [columns])

      const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: (record) => ({
                  disabled: record.name === 'Disabled User',
                  // Column configuration not to be checked
                  name: record.name,
            }),
      };
      const { selectionType = 'checkbox' } = props
      const exportExcel = () => {
            const excel = new Excel();
            excel
                  .addSheet("test")
                  .addColumns(newColumnExport)
                  .addDataSource(dataSource, {
                        str2Percent: true
                  })
                  .saveAs("Excel.xlsx");
      };

      return (

            <div>


                  <Divider />
                  <Loading isLoading={isLoading}>
                        <Button style={{ marginLeft: '1450px' }} onClick={exportExcel}>Export Excel</Button>
                        <Table style={{ marginTop: '20px' }}
                              rowSelection={{
                                    type: selectionType,
                                    ...rowSelection,
                              }}
                              columns={columns}
                              dataSource={dataSource}
                              {...props}
                        />
                  </Loading>
            </div>
      )
}

export default TableComponent