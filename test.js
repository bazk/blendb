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

// connect to mongodb
// const mongo = require('core/mongo');
// mongo.connect('mongodb://pyke/blend');

const blendb = require('blendb');

const db = new blendb.BlenDB();

const netSource = db.source('networkData');

for (let i = 0; i < 100; i++) {
    netSource.push({
        a: i
    });
}

db.transformer('networkTraffic', {
    source: 'networkData',
    metrics: ['met:downBytes', 'met:upBytes'],
    dimensions: ['dim:date', 'dim:city', 'dim:state', 'dim:point'],
    extractors: {
        metrics: function extractMetrics(doc) {
            return {
                'met:downBytes': 5464,
                'met:upBytes': 342
            };
        },
        dimensions: function extractDimensions(doc) {
            return {
                'dim:date': '2016/06/12',
                'dim:city': 41442,
                'dim:state': 41,
                'dim:point': 5344
            };
        }
    }
});

db.process();
