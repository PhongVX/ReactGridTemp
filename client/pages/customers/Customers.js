import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DateFnsUtils from '@date-io/date-fns'

import {
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TableCell,
    Select,
    Input,
    MenuItem,
    TextField,
    Grid
} from '@material-ui/core';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Add as AddIcon
} from '@material-ui/icons';

import {
    EditingState,
    SearchState,
    PagingState,
    IntegratedPaging,
    IntegratedFiltering,
    CustomPaging
} from '@devexpress/dx-react-grid';

import {
    Grid as GridDevEx,
    Table,
    Toolbar,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
    TableColumnResizing,
    SearchPanel,
    PagingPanel
} from '@devexpress/dx-react-grid-material-ui';

import Pagination from "material-ui-flat-pagination";

import * as customerActions from '../../actions/customerActions'
// import {
//     generateRows,
//     defaultColumnValues,
// } from './demo-data/generator';

const getRowId = row => row.id;


const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
        <Button
            color="primary"
            onClick={onExecute}
            title="Create new row"
        >
            <AddIcon color="primary" /> Thêm Mới
      </Button>
    </div>
);

const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Sửa">
        <EditIcon color="primary" />
    </IconButton>
);

const DeleteButton = ({ onExecute }) => (
    <IconButton
        onClick={onExecute}
        title="Xóa"
    >
        <DeleteIcon color="secondary" />
    </IconButton>
);

const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Lưu">
        <SaveIcon />
    </IconButton>
);

const CancelButton = ({ onExecute }) => (
    <IconButton color="secondary" onClick={onExecute} title="Hủy thao tác">
        <CancelIcon />
    </IconButton>
);

const commandComponents = {
    add: AddButton,
    edit: EditButton,
    delete: DeleteButton,
    commit: CommitButton,
    cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id];
    return (
        <CommandButton
            onExecute={onExecute}
        />
    );
};

///////////////////////////////
const availableValues = {
    sex: ['Nam', 'Nữ']
};

const LookupEditCellBase = ({
    availableColumnValues, value, onValueChange, classes,
}) => (
        <TableCell

        >
            <Select
                defaultValue={"Nam"}
                value={value}
                onChange={event => onValueChange(event.target.value)}
                // MenuProps={{
                //   className: classes.selectMenu,
                // }}
                input={(
                    <Input

                    />
                )}
            >
                {availableColumnValues.map(item => (
                    <MenuItem key={item} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </TableCell>
    );

const LookupEditCellNumberBase = ({
    value, onValueChange, classes,
}) => (
        <TableCell
            width={10}
        >
            <TextField
                defaultValue={1}
                value={value}
                onChange={event => onValueChange(event.target.value)}
                type="number"
                margin="normal"
            />
        </TableCell>
    );

const LookupEditCellDatePickerBase = ({
    value, onValueChange, classes,
}) => (
        <TableCell

        >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    format="dd/MM/yyyy"
                    value={value}
                    onChange={date => onValueChange(date)}
                />
            </MuiPickersUtilsProvider>
        </TableCell>
    );

const Cell = (props) => {
    const { column, value } = props;
    if (column.name === 'birth_day') {
        return (
            <TableCell>
                {new Date(value).toLocaleString().split(',')[1]}
            </TableCell>
        );
    }
    return <Table.Cell {...props} />;
};

const EditCell = (props) => {
    const { column } = props;
    const availableColumnValues = availableValues[column.name];
    if (availableColumnValues) {
        return <LookupEditCellBase {...props} availableColumnValues={availableColumnValues} />;
    }
    if (column.name == "buy_count") {
        return <LookupEditCellNumberBase  {...props} />
    }
    if (column.name == "birth_day") {
        return <LookupEditCellDatePickerBase  {...props} />
    }
    return <TableEditRow.Cell {...props} />;
};

class Customers extends Component {
    constructor(props) {
        super(props)
        this.timer = null;
        this.state = {
            searchValue: '',
            lastQuery: '',
            loading: false,
            columns: [
                { name: 'first_name', title: 'Tên' },
                { name: 'last_name', title: 'Họ' },
                { name: 'phone_number', title: 'SĐT' },
                { name: 'birth_day', title: 'Ngày Sinh' },
                { name: 'sex', title: 'G/T' },
                { name: 'address', title: 'Địa Chỉ' },
                { name: 'buy_count', title: 'Số Lần Mua' }
            ],
            defaultColumnWidths: [
                { columnName: 'first_name', width: 100 },
                { columnName: 'last_name', width: 180 },
                { columnName: 'phone_number', width: 150 },
                { columnName: 'birth_day', width: 200 },
                { columnName: 'sex', width: 70 },
                { columnName: 'address', width: 250 },
                { columnName: 'buy_count', width: 100 }
            ],
            rows: [],
            sorting: [],
            editingRows: [],
            addedRows: [],
            changedRows: {},
            currentPage: 0,
            oldCurrentPage: 0,
            deletingRows: [],
            totalCount: 100,
            pageSize: 5,
            pageSizes: [5, 10, 20, 50, 100],
            columnOrder: ['product', 'region', 'amount', 'discount', 'saleDate', 'customer'],
        }

        this.changeSorting = sorting => this.setState({ sorting });
        this.changeEditingRows = editingRows => this.setState({ editingRows });
        this.changeAddedRows = addedRows => this.setState({
            addedRows: addedRows.map(row => (Object.keys(row).length ? row : {
                amount: 0,
                discount: 0,
                saleDate: new Date().toISOString().split('T')[0],
                product: availableValues.product[0],
                region: availableValues.region[0],
                customer: availableValues.customer[0],
            })),
        });
        this.changeChangedRows = changedRows => this.setState({ changedRows });
        this.changeFilters = filters => this.setState({ filters });

        this.commitChanges = ({ added, changed, deleted }) => {
            let rows = this.props.listCustomer;
            const { customerActionCreators } = this.props
            const { createCustomerRequest, updateCustomerRequest } = customerActionCreators
            if (added) {
                added.forEach((data) => {
                    createCustomerRequest(data)
                })
            }
            if (changed) {
                Object.keys(changed).forEach(function (index) {
                    let customer = rows[index]
                    let id = customer.id
                    let dataChange = changed[index]
                    let payload = { id, ...dataChange }
                    updateCustomerRequest(payload)
                })

                // 
                // changed.forEach((data)=>{

                // })
                // rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
            }
            this.setState({ deletingRows: deleted || this.state.deletingRows });
        };
        this.cancelDelete = () => this.setState({ deletingRows: [] });
        this.deleteRows = () => {
            const rows = this.props.listCustomer.slice();
            this.state.deletingRows.forEach((rowId) => {
                const rowData = rows[rowId]
                if (rowData) {
                    //DELETE REQUEST
                    const { customerActionCreators } = this.props
                    const { deleteCustomerRequest } = customerActionCreators
                    deleteCustomerRequest(rowData.id)
                }
            });
            this.setState({ deletingRows: [] });
        };
        this.changeColumnOrder = (order) => {
            this.setState({ columnOrder: order });
        };


    }

    changePageSize = (event, objectPage) => {
        let pageSize = objectPage.props.value
        this.setState({ pageSize })
        this.handleFetchCustomerData(this.state.currentPage, pageSize)
    }


    changeCurrentPage = (event, currentPage) => {
        this.setState({ currentPage })
        console.log(currentPage)
        this.handleFetchCustomerData(currentPage, this.state.pageSize)
    }

    handleFetchCustomerData(currentPage, pageSize) {
        const { customerActionCreators } = this.props
        const { fetchListCustomerRequest } = customerActionCreators
        let query = { currentPage, pageSize }
        fetchListCustomerRequest(query)
    }

    componentDidMount() {
        this.handleFetchCustomerData(this.state.currentPage, this.state.pageSize)
    }

    handleSearch = (value) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const { customerActionCreators } = this.props
            const { findCustomerRequest } = customerActionCreators
            if (value == '') {
                this.handleFetchCustomerData(this.state.currentPage, this.state.pageSize)
            } else {
                findCustomerRequest(value)
            }
        }, 600);
    }

    render() {
        return (
            <>
                <h1>Quản Lý Khách Hàng</h1>
                <Paper>
                    <GridDevEx
                        rows={this.props.listCustomer}
                        columns={this.state.columns}
                        getRowId={this.getRowId}
                    >
                        <SearchState onValueChange={this.handleSearch} />
                        <EditingState
                            onCommitChanges={this.commitChanges}
                        />
                        {/* <PagingState
                            currentPage={this.state.currentPage}
                            pageSize={this.state.pageSize}
                            onCurrentPageChange={this.changeCurrentPage}
                            onPageSizeChange={this.changePageSize}
                        /> */}

                        {/* <IntegratedPaging />  */}
                        <IntegratedFiltering />

                        <Table
                            cellComponent={Cell}
                        />

                        <TableColumnResizing defaultColumnWidths={this.state.defaultColumnWidths} />
                        <TableHeaderRow allowSorting allowDragging />
                        <TableEditRow
                            cellComponent={EditCell}
                        />
                        <TableEditColumn
                            showAddCommand={!this.state.addedRows.length}
                            showEditCommand
                            showDeleteCommand
                            commandComponent={Command}
                        />
                        <Toolbar />
                        <SearchPanel />
                        {/* <CustomPaging
                        
                        
                            totalCount={12}
                        /> */}
                        {/* <PagingPanel
                            pageSizes={this.state.pageSizes}
                        /> */}
                    </GridDevEx>
                    <br />
                    <Grid
                        container
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                    >
                        {/* <select>
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select> */}
                        <Pagination
                            limit={this.state.pageSize}
                            offset={this.state.currentPage}
                            total={12}
                            onClick={(e, offset) => {
                                this.changeCurrentPage(e, offset)
                            }}
                        />
                    </Grid>
                    <br />
                    {this.state.loading && <h1>Loading..</h1>}
                </Paper>
                <Dialog
                    open={!!this.state.deletingRows.length}
                    onRequestClose={this.cancelDelete}
                >
                    <DialogTitle>Delete Row</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn chắc chắn muốn xóa dữ liệu này chứ?
            </DialogContentText>
                        {/* <Grid
                            rows={this.props.listCustomer.indexOf(row => this.state.deletingRows.indexOf(row.id) > -1)}
                            columns={this.state.columns}
                        >
                            <Table />
                            <TableHeaderRow />
                        </Grid> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.cancelDelete} color="primary">Thoát</Button>
                        <Button onClick={this.deleteRows} color="secondary">Xóa</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        listCustomer: state.customers.listCustomer,
        totalCount: state.customers.totalCount,
        pageSize: state.customers.pageSize,
        currentPage: state.customers.currentPage
    }
}

const mapDispatchToProps = dispatch => {
    return {
        customerActionCreators: bindActionCreators(customerActions, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Customers)
