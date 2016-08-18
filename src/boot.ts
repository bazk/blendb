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

// external libraries
import express = require('express');
import path = require('path');

const osprey = require('osprey');
const ramlParser = require('raml-parser');

// create a new express app
const app = module.exports = express();

// load router
import { router } from './api/router-v1';

// parse the RAML spec and load osprey middleware
ramlParser.loadFile('specs/blendb-api-v1.raml')
    .then((raml: any) => {
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
            app.locals.ready = true;
        }
    },
    (err: any) => {
        console.error('RAML Parsing Error: ' + err.message);
        process.exit(1);
    });
