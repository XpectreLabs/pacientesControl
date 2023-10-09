import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useRouter } from 'next/navigation';
import GroupsIcon from '@mui/icons-material/Groups';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Person2Icon from '@mui/icons-material/Person2';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

export default function Navbar({activeMain}) {
  const router = useRouter();
  const [active, setActive] = useState(parseInt(activeMain));
  return (
        <>
          <Paper sx={{ width: 90, maxWidth: '100%', display:"inline-block", marginRight:'5px' }}>
            <MenuList  className={styles.ListNav}>
              <Link href="/patients" onClick={()=>{setActive(0)}}>
                <MenuItem className={active===0?"activo":null}>
                  Patients
                </MenuItem>
              </Link>
            </MenuList>
          </Paper>

          <Paper sx={{ width: 80, maxWidth: '100%', display:"inline-block" }}>
            <MenuList  className={styles.ListNav}>
              <Link href="/profile" onClick={()=>{setActive(1)}}>
                <MenuItem className={active===1?"activo":null}>
                  Profile
                </MenuItem>
              </Link>
            </MenuList>
          </Paper>
        </>
  );
}
