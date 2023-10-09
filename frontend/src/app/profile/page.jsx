'use client';

import React, { useState } from 'react';
import styles from './profile.module.css';
import Navbar from '@/components/molecules/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { Formik, Form } from "formik";
import CircularProgress from '@mui/material/CircularProgress';
import * as Yup from "yup";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showAlert,setShowAlert] = React.useState(false);
  const [textError,setTextError] = React.useState("");
  const [initialValues, setInitialValues] = useState(({firstName:'', lastName:'', email:''}));
  const [loadingData, setLoadingData] = React.useState(false);


  function Logout() {
    localStorage.setItem('user_id', "");
    localStorage.setItem('token', "");
    router.push('/');
  }

  function data() {
    const user_id = localStorage.getItem('user_id');
    const scriptURL = "http://localhost:3001/api/v1/users/"+user_id;    //setLoading(true);

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
      if(data.message==="succes") {
        setLoadingData(true);
        setInitialValues(({firstName:""+data.dataUser[0]['firstname'], lastName:data.dataUser[0]['lastname'], email:data.dataUser[0]['email']}));
        setShowAlert(false);
      }
      else if(data.message==="schema") {
        setTextError(data.error);
        setShowAlert(true);
        setTimeout(()=>{
          Logout();
        },3200)
      }
      else {
        setTextError(data.message);
        setShowAlert(true);
        setTimeout(()=>{
          Logout();
        },3200)
      }

      setTimeout(()=>{
        setShowAlert(false);
      },3000)
    })
    .catch(error => {
      console.log(error.message);
      console.error('Error!', error.message);
    });
  }

  loadingData===false?data():null;

  return (
    <main className={styles.main} style={{ opacity: 1 }}>
      <Grid container spacing={2} className={styles.BorderBottom}>
        <Grid item xs={2}>
          <Item className={styles.DeleteBorder}>
            <figure className={styles.Logo}>
              <img src="https://assets.website-files.com/640e73434d6821d825eadf94/640e8406f661a7392010e264_Vectors-Wrapper.svg"alt="" />
            </figure>
          </Item>
        </Grid>
        <Grid item xs={10}>
          <Item className={styles.DeleteBorder} align="left">
            <Grid container spacing={2}>
              <Grid item xs={11} align="left">
                <Navbar activeMain="1" />
              </Grid>
              <Grid item xs={1} align="right">
                <Paper sx={{ width: 320, maxWidth: '100%' }}>
                  <MenuList  className={styles.ListNav}>
                    <MenuItem className={styles.BtnLogIn}>
                      <div
                        role="button"
                        onClick={() => {
                          Logout();
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

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          firstName: Yup.string()
            .min(3, "The first name is short")
            .required("The first name is requiered"),
          lastName: Yup.string()
            .min(3, "The last name is short")
            .required("The last name is requiered"),
          email: Yup.string()
            .email("The email es incorrect")
            .required("The email is requiered"),
        })}
        onSubmit={(values, actions) => {
          const scriptURL = "http://localhost:3001/api/v1/users/";
          const user_id = localStorage.getItem('user_id');
          const firstName = values.firstName;
          const lastName = values.lastName;
          const email = values.email;
          const data = {user_id,firstName, lastName, email};
          setLoading(true);

          fetch(scriptURL, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': "Bearer "+localStorage.getItem('token'),
            },
          })
          .then((resp) => resp.json())
          .then(function(data) {
            setLoading(false);            console.log(data);
            setShowAlert(true);

            if(data.message==="succes") {
              setTextError("Date edited👌");
              setShowAlert(true);
            }
            else if(data.message==="schema") {
              setTextError(data.error);
              setShowAlert(true);
            }
            else {
              setTextError(data.message);
              setShowAlert(true);
              setTimeout(()=>{
                Logout();
              },3200)
            }
            setTimeout(()=>{setShowAlert(false)},3000)
          })
          .catch(error => {
            console.log(error.message);
            console.error('Error!', error.message);
          });
        }}
      >
        {({
          values ,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          return (
            <>
              <Grid item xs={2}>
              </Grid>
              <Grid item xs={10}>
                <div className={styles.center}>
                  {showAlert?(<p className={`${styles.message} slideLeft`}><strong>Message:</strong><br />{textError}</p>):null}

                  <Form
                      name="form"
                      id="form"
                      method="post"
                      onSubmit={handleSubmit}
                      className={styles.form}
                  >
                    <label className={styles.lbl}><strong>First name:</strong></label>
                    <TextField
                      placeholder="First "
                      required
                      id="firstName"
                      name="firstName"
                      value={values.firstName}
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label className={styles.lbl}><strong>Last name:</strong></label>
                    <TextField
                      placeholder="Last Name"
                      required
                      id="lastName"
                      value={values.lastName}
                      name="lastName"
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label className={styles.lbl}><strong>Email:</strong></label>
                    <TextField
                      placeholder="email"
                      required
                      id="email"
                      value={values.email}
                      name="email"
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <div className={styles.errors}>
                        <p><strong>{(errors.firstName || errors.lastName || errors.email)?`Errores:`:null}</strong></p>
                        {errors.firstName? (<p>{errors.firstName}</p>):null}
                        {errors.lastName? (<p>{errors.lastName}</p>):null}
                        {errors.email? (<p>{errors.email}</p>):null}
                    </div>

                    <div>
                      <CircularProgress  className={loading?'Loading show':'Loading'}/>
                    </div>

                    <div className={styles.btns}>
                      <input
                        className={styles.btn}
                        type="submit"
                        value="Edit profile"
                      />
                    </div>
                  </Form>
                </div>
            </Grid>
            </>
          );
        }}
      </Formik>
    </main>
  );
}
