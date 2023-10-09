'use client';

import React from "react";
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import styles from './recovery.module.css'

export const Recovery = ({setPage}:{setPage:Function}) => {
  return (
      <>
        <div  className='fadeIn'>
          <a onClick={ ()=> { setPage("1");} } className={styles.Link}>Back</a>
          <div>
            <figure className={styles.Logo}>
              <img src="https://assets.website-files.com/640e73434d6821d825eadf94/640e8406f661a7392010e264_Vectors-Wrapper.svg" alt="" />
            </figure>
          </div>
            <form >
              <TextField
                placeholder="Email"
                required
                id="outlined-required"
                label="Email"
                name="email"
                size="small"
              />

              <Button
                variant="outlined"
                type="submit"
                className={styles.Btn}
              >
                Recovery
              </Button>
            </form>
          </div>
        </>
  );
};
