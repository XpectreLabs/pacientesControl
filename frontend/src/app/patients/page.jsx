'use client';

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './patients.module.css';
import Navbar from '@/components/molecules/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


export default function Patients() {
  const router = useRouter();
  const [ patients, setPatients ] = useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [showAlert,setShowAlert] = React.useState(false);
  const [textError,setTextError] = React.useState("");

  function Logout() {
    localStorage.setItem('user_id', "");
    localStorage.setItem('token', "");
    router.push('/');
  }

  function data() {
    const user_id = localStorage.getItem('user_id');
    const scriptURL = "http://localhost:3001/api/v1/patients/"+user_id+"/patients";    

    fetch(scriptURL, {
      method: 'GET',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+localStorage.getItem('token'),
      },
    })
    .then((resp) => resp.json())
    .then(function(data) {
      console.log(data);
      if(data.message==="succes") {
        setLoadingData(true);
        setLoading(false);
        setPatients(data.listPatients);
        //setShowAlert(false);
      }
      else if(data.message==="schema") {
        setTextError(data.error);
        setShowAlert(true);
        setTimeout(()=>{
          Logout();
        },3500)
      }
      else {
        setTextError(data.message);
        setShowAlert(true);
        setTimeout(()=>{
          Logout();
        },3500)
      }

      setTimeout(()=>{
        setShowAlert(false);
      },3400)
    })
    .catch(error => {
      console.log(error.message);
      console.error('Error!', error.message);
    });
  }

  loadingData===false?data():null;

  const columns = [
    {
      field: 'ssn',
      headerName: 'SSN',
      flex: 1.3,
    },
    {
      field: 'firstName',
      headerName: 'First name',
      flex: 1.2,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      flex: 1.2,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      type: 'tel',
      flex: 1.2,
    },
    {
      field: 'email',
      headerName: 'Email',
      sortable: false,
      flex: 2,
    },
    {
      field: 'edit',
      headerName: '',
      sortable: false,
      flex: 0.4,
      renderCell: (params) => (
        <CreateIcon
          onClick={() => {
            setPatientToEdit(params.row);
            setIsEditPatientModalOpen(true);
          }}
        />
      ),
    },
    {
      field: 'delete',
      headerName: '',
      sortable: false,
      flex: 0.4,
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => {
            onDeletePatient(params.row.patient_id, params.row.firstName);
          }}
        />
      ),
    },
  ];

  return (
    <main
      className={styles.main}
    >
      <Grid container spacing={2} className={styles.BorderBottom}>
        <Grid item xs={2}>
          <Item className={styles.DeleteBorder}>
            <figure className={styles.Logo}>
              <img src="https://assets.website-files.com/640e73434d6821d825eadf94/640e8406f661a7392010e264_Vectors-Wrapper.svg"alt="" />
            </figure>
          </Item>
        </Grid>
        <Grid item xs={10}>
          <Item className={styles.DeleteBorder}>
            <Grid container spacing={2}>
              <Grid item xs={11} align="left">
                <Navbar activeMain="0" />
              </Grid>
              <Grid item xs={1} align="right">
                <Paper sx={{ width: 320, maxWidth: '100%' }}>
                  <MenuList  className={styles.ListNav}>
                    <MenuItem className={styles.BtnLogIn}>
                      <div
                        role="button"
                        onClick={() => {
                          localStorage.setItem('user_id', "");
                          localStorage.setItem('token', "");
                          router.push('/');
                        }}
                      >
                        <ListItemIcon>
                          <PowerSettingsNewIcon fontSize="small" />
                        </ListItemIcon>
                      </div>
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </Grid>


      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item className={styles.DeleteBorder}>
            <Grid container spacing={0}>
              <Grid item xs={12} align="right">
                <Button
                  variant="outlined"
                  className={styles.addPatientButton}
                  onClick={() => {
                    setIsAddPatientModalOpen(true);
                  }}
                >
                  <span>+</span> Add a New Patients
                </Button>
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </Grid>

      {showAlert?(<p className={`${styles.message} slideLeft`}><strong>Message:</strong><br />{textError}</p>):null}

      <DataGrid
        rows={patients.map((patient) => ({
          id: patient.patient_id,
          patient_id: patient.patient_id,
           firstName: patient.firstname,
          lastName: patient.lastname,
           phone: patient.phone,
          email: patient.email,
           ssn: patient.ssn,
        }))}
        columns={columns}
        initialState={{
          pagination: {
             paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
      {Object.keys(patients).length===0?<p className={styles.NoData}><strong>There is no data yet</strong></p>:null}


      <div className={styles.ContentLoadding}>
        <CircularProgress  className={loading?'Loading show':'Loading'}/>
      </div>
    </main>
  );
}
