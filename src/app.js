const express = require('express');
const fs = require('fs');
const util = require('util');
const winston = require('winston');
const Cidades = require('../files/Cidades.json');
const Estados = require('../files/Estados.json');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const { combine, timestamp, label, printf } = winston.format;
const formato = printf(({level, message, label, timestamp})=>{
    return `${timestamp} # [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
    level:'silly',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: 'logs/logs-api.log'})
    ],
    format: combine(
        label({label: 'logger api'}),
        timestamp(),
        formato
    )
});


app.listen(0404, ()=>{
    logger.info('api iniciada');
});





