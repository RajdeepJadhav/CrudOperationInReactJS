import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

const CrudTable = () => {
  const [employees, setEmployees] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [addEmployee, setAddEmployee] = React.useState(false);
  const [newEmployee, setNewEmployee] = React.useState({
    empId: '',
    empName: '',
    address: '',
    contact: '',
    dept: { deptName: '' },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/employees/getAll");

        if (!response.ok) {
          console.log("Error while calling the API");
          return;
        }

        const data = await response.json(); // Parse the JSON response
        setEmployees(data);
        const employeeKeys = data.length > 0 ? Object.keys(data[0]) : [];
        setHeaders(employeeKeys);
      } catch (error) {
        console.error(`An error occurred: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  const handleEdit = (employee) => {
    setEditMode({ [employee.empId]: true });
  };

  const handleSave = () => {
    // Perform the save operation here
    console.log("Saving changes for employee:", selectedEmployee);
    setEditMode({});
  };

  const handleCancel = () => {
    setEditMode({});
  };

  const handleConfirmDelete = () => {
    // Perform the actual delete operation here
    console.log("Deleting employee:", selectedEmployee.empId);
    fetch("http://localhost:8080/employees/dEmp/" + selectedEmployee.empId, {
      method: "DELETE"
    });
    console.log("Deleted successfully");
    setOpenDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  const handleAddEmployee = () => {
    setAddEmployee(true);
  };

  const cancelhandleAddEmployee = () => {
    setAddEmployee(false);
    setNewEmployee({
      empId: '',
      empName: '',
      address: '',
      contact: '',
      dept: { deptName: '' },
    });
  };

  const handleAddEmployeeSave = () => {
    
    console.log("Adding new employee:", newEmployee);
    fetch("http://localhost:8080/employees/saveEmp",{
        method:'PATCH',
    });
    setAddEmployee(false);
    setNewEmployee({
      empId: '',
      empName: '',
      address: '',
      contact: '',
      dept: { deptName: '' },
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <TableContainer component={Paper} sx={{ minWidth: 200, ml: 60 }}>
        <AddCircleRoundedIcon
          onClick={() => handleAddEmployee()}
        >
        </AddCircleRoundedIcon>
        <Table sx={{ minWidth: 150, maxWidth: 500, borderCollapse: 'collapse' }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={{ '& td, & th': { border: 1, fontSize: 15 } }}>
              {headers.map((header) => (
                <TableCell align="center" key={header}>
                  {header}
                </TableCell>
              ))}
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.empId} sx={{ '& td, & th': { border: 1 } }}>
                <TableCell component="th" scope="row" align="center">
                  {editMode[employee.empId] ? (
                    <TextField
                      value={employee.empId}
                      onChange={(e) => console.log(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    employee.empId
                  )}
                </TableCell>
                <TableCell align="center">
                  {editMode[employee.empId] ? (
                    <TextField
                      value={employee.empName}
                      onChange={(e) => console.log(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    employee.empName
                  )}
                </TableCell>
                <TableCell align="center">
                  {editMode[employee.empId] ? (
                    <TextField
                      value={employee.address}
                      onChange={(e) => console.log(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    employee.address
                  )}
                </TableCell>
                <TableCell align="center">
                  {editMode[employee.empId] ? (
                    <TextField
                      value={employee.contact}
                      onChange={(e) => console.log(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    employee.contact
                  )}
                </TableCell>
                <TableCell align="center">
                  {editMode[employee.empId] ? (
                    <TextField
                      value={employee.dept.deptName}
                      onChange={(e) => console.log(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    employee.dept.deptName
                  )}
                </TableCell>
                <TableCell align="center">
                  {editMode[employee.empId] ? (
                    <>
                      <Button size="small" variant="outlined" onClick={handleSave}>
                        Save
                      </Button>
                      <Button size="small" variant="outlined" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="small" variant="outlined" onClick={() => handleEdit(employee)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(employee)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the employee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>No</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Employee dialog */}
      <Dialog open={addEmployee} onClose={cancelhandleAddEmployee}>
        <DialogTitle>Add Employee</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              label="Employee ID"
              value={newEmployee.empId}
              onChange={(e) => setNewEmployee({ ...newEmployee, empId: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Employee Name"
              value={newEmployee.empName}
              onChange={(e) => setNewEmployee({ ...newEmployee, empName: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              value={newEmployee.address}
              onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact"
              value={newEmployee.contact}
              onChange={(e) => setNewEmployee({ ...newEmployee, contact: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Department Name"
              value={newEmployee.dept.deptName}
              onChange={(e) => setNewEmployee({ ...newEmployee, dept: { deptName: e.target.value } })}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelhandleAddEmployee}>Cancel</Button>
          <Button onClick={handleAddEmployeeSave} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CrudTable;
