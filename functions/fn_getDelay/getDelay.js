const functions = require('firebase-functions');
const validate = require('express-validation')
const express = require('express');

const validation = require('./validation');
const isNullOrUndefined = require('../common/utils').isNullOrUndefined;

const app = express();
