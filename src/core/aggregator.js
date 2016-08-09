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

const async = require('async');
const mongo = require('core/mongo');
const serializer = require('util/serializer');
const hash = require('util/hash');

class Aggregator {
    removeAggregate(id, callback) {
        const aggregates = mongo.db.collection('meta.aggregates');
        aggregates.findOneAndDelete({ _id: id }, (err) => {
            if (err) {
                callback(err);
                return;
            }

            let aggr = mongo.db.collection('aggr.' + id);
            aggr.remove({}, callback);
        });
    }

    createAggregate(dimensions, metrics, callback) {
        const aggregates = mongo.db.collection('meta.aggregates');

        let doc = {
            _id: hash.sha1(serializer.dump(dimensions) +
                           serializer.dump(metrics)),
            dimensions: dimensions,
            metrics: metrics
        };

        aggregates.insert(doc, (err) => {
            if (err) {
                callback(err);
                return;
            }

            callback(null, doc);
        });
    }

    rebuildBaseAggregates(callback) {
        this.cleanAggregates((err) => {
            if (err) {
                callback(err);
                return;
            }

            this.buildBaseAggregates(callback);
        });
    }

    buildBaseAggregates(callback) {
        let classes = mongo.db.collection('meta.classes');

        classes.find({}).toArray((err, result) => {
            if (err) {
                callback(err);
                return;
            }

            async.map(result, (cls, cb) => { this.buildBaseAggregateFromClass(cls, cb); }, (err) => {
                if (err) {
                    callback(err);
                    return;
                }

                return callback(null);
            });
        });
    }

    buildBaseAggregateFromClass(cls, callback) {
        this.createAggregate(cls.dimensions, cls.metrics, (err, aggr) => {
            const raw = mongo.db.collection('raw.' + cls.name);
            const aggrData = mongo.db.collection('aggr.' + aggr._id);

            const functions = serializer.load(cls.functions);

            raw.find({}).forEach((doc) => {
                let data = {
                    dimensions: functions.extractDimensions.apply(doc),
                    metrics: functions.extractMetrics.apply(doc)
                };

                // TODO: aggrData.insert(data);
            }, callback);
        });
    }

    cleanAggregates(callback) {
        let aggregates = mongo.db.collection('meta.aggregates');

        aggregates.find({}).toArray((err, result) => {
            if (err) {
                callback(err);
                return;
            }

            async.map(result, (aggr, callback) => {
                let aggrCol = mongo.db.collection('aggr.' + aggr.name);
                aggrCol.remove({}, (err) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    aggregates.remove({ _id: aggr._id }, callback);
                });
            },
            (err) => {
                if (err) {
                    callback(err);
                    return;
                }

                callback(null);
            });
        });
    }

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
        let aggregates = mongo.db.collection('meta.aggregates');

        aggregates.find({
            metrics: {
                $all: metrics
            },
            dimensions: {
                $all: dimensions
            }
        }).toArray((err, result) => {
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
