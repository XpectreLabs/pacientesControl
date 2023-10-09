
const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtV = require('../services/auth.js');
const sch = require('../schemas/patients.js');

router.post('/',jwtV.verifyToken, async (req, res, next) => {
  const { error } = sch.schemaCreate.validate(req.body);
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).json({ message:"schema", error: error.details[0].message });
  }

  let date = new Date().toISOString();
  console.log(date);
  await prisma.patients.create({
    data: {
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      ssn: req.body.ssn,
      user_id: parseInt(req.body.user_id),
      date: date,
      active: 1,
    },
  });
  res.status(200).json({ message:"succes" });
});

router.get('/:userId/patients',jwtV.verifyToken, async (req, res, next) => {
  const { error } = sch.schemaId.validate(req.params);
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).json({ message:"schema",error: error.details[0].message });
  }

  if (req.params.userId !== null) {
    const id = req.params.userId;

    const listPatients = await prisma.patients.findMany({
      where: {
        user_id: parseInt(id),
        active: 1,
      },
      select: {
        patient_id: true,
        firstname: true,
        lastname: true,
        phone: true,
        email: true,
        ssn: true,
        date: true,
      },
    });
    res.status(200).json({ message:"succes", listPatients });
  }
});

router.put('/',jwtV.verifyToken, async (req, res, next) => {
  const { error } = sch.schemaUpdate.validate(req.body);
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  const id = parseInt(req.body.patient_id);

  await prisma.patients.update({
    where: {
      patient_id: parseInt(id),
    },
    data: {
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      ssn: req.body.ssn,
    },
  });
  res.json({ status: 'success' });
});

router.delete('/',jwtV.verifyToken, async (req, res, next) => {
  const { error } = sch.schemaIdPatient.validate(req.body);
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  const id = parseInt(req.body.patient_id);
  console.log("D:" + req.body.patient_id);
  await prisma.patients.update({
    where: {
      patient_id: parseInt(id),
    },
    data: {
      active: 0,
    },
  });
  res.json({ status: 'success' });
});

module.exports = router;