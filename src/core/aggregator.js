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

class Aggregator {
    query(metrics, dimensions, callback) {
        this.findClosestAggregate(metrics, dimensions, (err, aggr) => {
            if (err) {
                callback(err);
                return;
            }

            callback(null, null);
        });
    }

    findClosestAggregate(metrics, dimensions, callback) {
        var aggregates = mongo.db.collection('meta.aggregates');

        aggregates.find({
            metrics: {
                $all: metrics
            },
            dimensions: {
                $all: dimensions
            }
        }).toArray(function(err, result) {
            if (err) {
                callback(err);
                return;
            }

            if ((!result) || (result.length <= 0)) {
                callback('Query could not be aswered, no aggregate available.');
                return;
            }

            // fetch the closest aggregation available
            let closestAggr;
            for (const aggr of result) {
                if ((!closestAggr) ||
                    (aggr.dimensions.length < closestAggr.dimensions.length)) {
                    closestAggr = aggr;
                }
            }

            callback(null, closestAggr);
        });
    }
}

module.exports = new Aggregator();
