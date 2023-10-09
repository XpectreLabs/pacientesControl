import React from 'react';
import ReactDOM from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Modal.module.css';

export default function Modal({ children, isOpen, onClose, title }) {
  if (isOpen) {

      <div className={styles.backdrop}>
        <div className={styles.main}>
          <CloseIcon onClick={onClose} />
          <h1>{title}</h1>
          {children}
        </div>
      </div>,
      document.querySelector('#modal-root')
    
  }

  return null;
}
