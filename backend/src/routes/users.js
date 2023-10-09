
const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtV = require('../services/auth.js');
const sch = require('../schemas/users.js');
const fn = require('../services/users.js');

function generateAccessToken(user) {
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: 60 * 60 * 24 });
}

router.post('/', async (req, res, next) => {
  const { error } = sch.schemaCreate.validate(req.body);
  if (error) {
    return res.status(400).json({ message:"schema", error: error.details[0].message });
  }

  let date = new Date().toISOString();
  const password = fn.getPasswordEncrypted(req.body.password);
  const newUser = await prisma.users.create({
    data: {
      username: req.body.username,
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      password: password,
      email: req.body.email,
      date: date,
    },
  });
  const token = generateAccessToken(jwt, newUser.user_id);
  res.status(200).json({ message:"succes", user_id: newUser.user_id, token: token });
});

router.get('/:userId',jwtV.verifyToken, async (req, res, next) => {
  const { error } = sch.schemaId.validate(req.params);
  if (error) {
    console.log(error.details[0].message)
    return res.status(400).json({ message:"schema", error: error.details[0].message });
  }

  if (req.params.userId !== null) {
    const id = req.params.userId;

    if(await validateUser(parseInt(id))) {
      const dataUser = await prisma.users.findMany({
        where: {
          user_id: parseInt(id),
        },
        select: {
          user_id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      });
      res.status(200).json({ message:"succes", dataUser });
    }
    else
      res.status(400).json({ message:"Invalid id", error: "Invalid request, id does not exist" });
  }
});

router.put('/',jwtV.verifyToken, async (req, res, next) => {
  console.log(req.body);
  const { error } = sch.schemaUpdate.validate(req.body);
  if (error) {
    console.log(error.details[0].message)
    return res.status(400).json({ message:"schema", error: error.details[0].message });
  }

  const id = parseInt(req.body.user_id);
  await prisma.users.update({
    where: {
      user_id: parseInt(id),
    },
    data: {
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      email: req.body.email,
    },
  });
  res.status(200).json({ message:"succes" });
});


async function validateUser(user_id) {
  const users = await prisma.users.findFirst({
    where: {
      user_id
    },
    select: {
      user_id: true,
    },
  });

  if (users == null) return false;

  return true;
}

module.exports = router;