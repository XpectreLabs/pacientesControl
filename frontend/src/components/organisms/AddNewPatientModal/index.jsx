import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styles from './AddNewPatientModal.module.css';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Modal from '@/components/atoms/Modal';

export default function AddNewPatientModal({ isOpen, onClose }) {
  // const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      ssn: '',
      user_id: localStorage.getItem('user_id'),
    },
    onSubmit: (values) => {
      toast
        .promise(createPatient(values,localStorage.getItem('token')), {
          pending: 'Loading',
          success: `Patient: ${values.firstName} created👌`,
          error: 'Error creating patient 🤯',
        })
        .then(() => {
          resetForm(); // Esto reiniciará los valores del formulario
          onClose();
        });
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.Modal} title="Add a Patient">
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <TextField
          placeholder="SSN"
          required
          id="outlined-required"
          label="SSN"
          name="ssn"
          value={formik.values.ssn}
          onChange={formik.handleChange}
          size="small"
        />
        <TextField
          placeholder="First Name"
          required
          id="outlined-required"
          label="First Name"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          size="small"
        />
        <TextField
          placeholder="Last Name"
          required
          id="outlined-required"
          label="Last Name"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          size="small"
        />
        <TextField
          placeholder="Phone"
          required
          id="outlined-required"
          label="Phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          size="small"
        />
        <TextField
          placeholder="Email"
          required
          id="outlined-required"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          size="small"
        />

        <div className={styles.btns}>
            <Button className={styles.btn} variant="outlined" type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
