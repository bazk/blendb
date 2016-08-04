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

const mongo = require('core/mongo');

class Collect {
    write(req, res, next) {
        let collection = mongo.db.collection('raw.' + req.params.class);

        if ('_id' in req.body) {
            res.status(400)
                .json({ message: 'Property named \'_id\' is protected.' });
            return;
        }

        collection.insertOne(req.body, function (err, r) {
            if (err) {
                res.status(500)
                    .json({ message: 'Error while writing to the database.' });
                return;
            }

            res.status(200).json({ _id: r.insertedId });
        });
    }
}

module.exports = new Collect();
