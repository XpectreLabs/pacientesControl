'use client';

import React from "react";
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import styles from './changePassword.module.css';
import { useRouter } from 'next/navigation';
import { Formik, Form } from "formik";
import CircularProgress from '@mui/material/CircularProgress';
import * as Yup from "yup";

export const ChangePassword = ({setPage}:{setPage:Function}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showAlert,setShowAlert] = React.useState(false);
  const [textError,setTextError] = React.useState("");

  return (
    <Formik
        initialValues={{
          recoveryCode: "",
          password: "",
          confirmPassword:"",
        }}
        validationSchema={Yup.object().shape({
          recoveryCode: Yup.string()
            .min(8, "The recovery code have a minimum of 8 characters")
            .required("*The recovery code is requiered"),
          password: Yup.string()
            .min(3, "The password must have a minimum of 3 characters.")
            .required("*The password is requiered"),
          confirmPassword:  Yup.string()
            .oneOf([Yup.ref('password')],"Passwords and password repeat must be the same.")
            .min(3, 'The confirm password must have a minimum of 3 characters.')
            .required("* The confirm password is requiered."),
        })}
        onSubmit={(values, actions) => {
          const scriptURL = "http://localhost:3001/api/v1/users/";
          const recoveryCode = values.recoveryCode;
          const password = values.password;
          const data = { recoveryCode, password};
          setLoading(true);

          fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-Type': 'application/json'
            }
          })
          .then((resp) => resp.json())
          .then(function(data) {
            setLoading(false);

            if(data.message==="success") {
              setShowAlert(false);
              localStorage.setItem('user_id', JSON.stringify(data.user_id));
              localStorage.setItem('token',  data.token);
              router.push("/patients")
            }
            else {
              setTextError(data.error);
              setShowAlert(true);
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
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          return (
            <>
              <div className='fadeIn'>
                <a onClick={ ()=> { setPage("1");} } className={styles.Link}>Back</a>

                <div>
                  <figure className={styles.Logo}>
                    <img src="https://assets.website-files.com/640e73434d6821d825eadf94/640e8406f661a7392010e264_Vectors-Wrapper.svg" alt="" />
                  </figure>
                </div>

                {showAlert?(<p className={`${styles.message} slideLeft`}><strong>Error:</strong><br />{textError}</p>):null}

                <Form
                  className={styles.form}
                  name="form"
                  id="form"
                  method="post"
                  onSubmit={handleSubmit}
                >
                    <TextField
                      placeholder="Recovery code"
                      required
                      id="recoveryCode"
                      label="Recovery code"
                      name="recoveryCode"
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <TextField
                      placeholder="New password"
                      type="Password"
                      required
                      id="password"
                      label="New password"
                      name="password"
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <TextField
                      placeholder="Repeat password"
                      type="Password"
                      required
                      id="confirmPassword"
                      label="Confirm password"
                      name="confirmPassword"
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <div>
                        <p><strong>{(errors.recoveryCode || errors.firstName || errors.lastName || errors.email || errors.password || errors.confirmPassword)?`Errores:`:null}</strong></p>
                        {errors.recoveryCode? (<p>{errors.recoveryCode}</p>):null}
                        {errors.password? (<p>{errors.password}</p>):null}
                        {errors.confirmPassword? (<p>{errors.confirmPassword}</p>):null}
                    </div>

                    <div>
                      <CircularProgress  className={loading?'Loading show':'Loading'}/>
                    </div>

                    <input
                      className={styles.Btn}
                      type="submit"
                      value="Change"
                    />
                  </Form>
                </div>
              </>
              );
          }}
      </Formik>
  );
};
