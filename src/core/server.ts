/*
 * Copyright (C) 2015 Centro de Computacao Cientifica e Software Livre
 * Departamento de Informatica - Universidade Federal do Parana
 *
 * This file is part of blend.
 *
 * blend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blend.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

import { Hash } from '../util/hash';

import { Source } from './source';
import { Transformer } from './transformer';
import { Aggregate } from './aggregate';

export class Server {
    sources: Map<string,Source>;
    transformers: Map<string,Transformer>;
    aggregates: Map<string,Aggregate>;

    constructor() {
        this.sources = new Map();
        this.transformers = new Map();
        this.aggregates = new Map();
    }

    source(name: string, options?: any) {
        if (this.sources.has(name)) {
            return this.sources.get(name);
        }
        else {
            const source = new Source(name, options);
            this.sources.set(name, source);
            return source;
        }
    }

    transformer(name: string, options?: any) {
        if (this.transformers.has(name)) {
            return this.transformers.get(name);
        }
        else {
            const transformer = new Transformer(name, options);
            this.transformers.set(name, transformer);
            return transformer;
        }
    }

    aggregate(metrics: string[], dimensions: string[], options?: any) {
        const id = Hash.sha1(metrics.sort(), dimensions.sort());

        if (this.aggregates.has(id)) {
            return this.aggregates.get(id);
        }
        else {
            const aggregate = new Aggregate(metrics, dimensions, options);
            this.aggregates.set(id, aggregate);
            return aggregate;
        }
    }

    process() {
        this.transformers.forEach((transformer: Transformer) => {
            const source = this.source(transformer.source);
            const aggr = this.aggregate(transformer.metrics,
                transformer.dimensions);

            source.forEach((doc: any) => {
                aggr.push({
                    metrics: transformer.extractMetrics(doc),
                    dimensions: transformer.extractDimensions(doc)
                });
            });

            // TODO: stream support
            // source.stream()
            //     .pipe(transformer.stream());
            //     .pipe(aggregate.stream());
        });

        console.log(this.aggregates);
    }
}
