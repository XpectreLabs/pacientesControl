'use client';
import React from "react";
import TextField from '@mui/material/TextField';
import styles from './login.module.css'
import { useRouter } from 'next/navigation';
import { Formik, Form } from "formik";
import CircularProgress from '@mui/material/CircularProgress';
import * as Yup from "yup";

export const Login = ({setPage}:{setPage:Function}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showAlert,setShowAlert] = React.useState(false);
  const [textError,setTextError] = React.useState("");

  return (
    <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string()
            .min(3, "The username is short")
            .required("The username is requiered"),

          password: Yup.string()
            .min(3, "The password is short")
            .required("The password is requiered"),
        })}
        onSubmit={(values, actions) => {
          const scriptURL = "http://localhost:3001/api/v1/auth/login";
          const username = values.username;
          const password = values.password;
          const data = {username, password};
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

            if(data.message==="succes") {
              setShowAlert(false);
              localStorage.setItem('user_id', JSON.stringify(data.user_id));
              localStorage.setItem('token',  data.token);
              router.push("/patients")
            }
            else if(data.message==="Incorrect access data") {
              setTextError(data.message);
              setShowAlert(true);
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
              <div  className='fadeIn'>
                <div>
                  <figure className={styles.Logo}>
                    <img src="https://assets.website-files.com/640e73434d6821d825eadf94/640e8406f661a7392010e264_Vectors-Wrapper.svg" alt="" />
                  </figure>
                </div>

                {showAlert?(<p className={`${styles.message} slideLeft`}><strong>Error:</strong><br />{textError}</p>):null}

                  <Form
                      name="form"
                      id="form"
                      method="post"
                      onSubmit={handleSubmit}
                    >
                    <TextField
                      placeholder="Username"
                      required
                      id="username"
                      label="Username"
                      name="username"
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <TextField
                      placeholder="Password"
                      type="password"
                      required
                      id="password"
                      label="Password"
                      name="password"
                      size="small"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div>
                        <p><strong>{(errors.username || errors.password)?`Errores:`:null}</strong></p>
                        {errors.username? (<p>{errors.username}</p>):null}
                        {errors.password? (<p>{errors.password}</p>):null}
                    </div>

                    <div>
                      <CircularProgress  className={loading?'Loading show':'Loading'}/>
                    </div>

                    <input
                      className={styles.Btn}
                      type="submit"
                      value="Login"
                    />
                  </Form>

                  {/* <a onClick={ ()=> {setPage("2"); }} className={styles.Link}>Recovery password</a> */}
                  <a onClick={ ()=> {setPage("3"); }} className={styles.Link}>Not have account? Sign Up</a>
                </div>
              </>
            );
        }}
    </Formik>
  );
};
