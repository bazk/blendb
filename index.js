#!/usr/bin/env node
/*
 * Copyright (C) 2015 Centro de Computacao Cientifica e Software Livre
 * Departamento de Informatica - Universidade Federal do Parana
 *
 * This file is part of blendb.
 *
 * blendb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blendb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blendb.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

// Add the ./src directory to require's search path to facilitate import
// modules later on (avoiding the require('../../../../module') problem).
require('app-module-path').addPath(__dirname + '/src');

// external libraries
const osprey = require('osprey');
const express = require('express');
const path = require('path');
const ramlParser = require('raml-parser');

// connect to mongodb
const mongo = require('core/mongo');
mongo.connect('mongodb://pyke/blend');

// create a new express app
const app = module.exports = express();

// load router
const router = require('api/router-v1.js');

// parse the RAML spec and load osprey middleware
ramlParser.loadFile(path.join(__dirname, 'specs/blendb-api-v1.raml'))
    .then(raml => {
        app.use('/v1',
            osprey.security(raml),
            osprey.server(raml),
            router);

        if (!module.parent) {
            let port = process.env.PORT || 3000;
            app.listen(port);

            if (app.get('env') === 'development') {
                console.log('Server listening on port ' + port + '.');
            }
        }
        else {
            // signalize to the test suite that the server is ready to be tested
            app.ready = true;
        }
    },
    err => {
        console.error('RAML Parsing Error: ' + err.message);
        process.exit(1);
    });
