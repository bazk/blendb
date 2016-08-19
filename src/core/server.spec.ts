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

import { expect } from "chai";

import { Server } from "./server";

describe("server class", () => {
    const server = new Server();

    it("should be able to create and retrieve sources", () => {
        // create two sources
        const source1 = server.source("source1");
        const source2 = server.source("source2");

        // retrieve the first one
        const retrieved = server.source("source1");

        // check if sources were actually created/retrieved
        expect(source1).to.be.an("object");
        expect(source2).to.be.an("object");
        expect(retrieved).to.be.an("object");

        // check if the two created sources are different
        expect(source1).to.not.be.equal(source2);

        // check if the retrieved source is the same as the created one
        expect(source1).to.be.equal(retrieved);
    });

    it("should be able to create and retrieve transformers", () => {
        // create two transformers
        const transformer1 = server.transformer("transformer1", {
            source: "source1",
            metrics: ["met:one"],
            dimensions: ["dim:one"],
            extractors: {
                metrics: ((doc: any) => null),
                dimensions: ((doc: any) => null),
            }
        });
        const transformer2 = server.transformer("transformer2", {
            source: "source2",
            metrics: ["met:one"],
            dimensions: ["dim:one"],
            extractors: {
                metrics: ((doc: any) => null),
                dimensions: ((doc: any) => null),
            }
        });

        // retrieve the first one
        const retrieved = server.transformer("transformer1");

        // check if transformers were actually created/retrieved
        expect(transformer1).to.be.an("object");
        expect(transformer2).to.be.an("object");
        expect(retrieved).to.be.an("object");

        // check if the two created transformers are different
        expect(transformer1).to.not.be.equal(transformer2);

        // check if the retrieved transformer is the same as the created one
        expect(transformer1).to.be.equal(retrieved);
    });

    it("should be able to create and retrieve aggregates", () => {
        // create two aggregates
        const aggr1 = server.aggregate(["met:one"], ["dim:one", "dim:two"]);
        const aggr2 = server.aggregate(["met:two"], ["dim:one", "dim:two"]);

        // retrieve the first one
        const retrieved = server.aggregate(["met:one"], ["dim:one", "dim:two"]);

        // check if aggregates were actually created/retrieved
        expect(aggr1).to.be.an("object");
        expect(aggr2).to.be.an("object");
        expect(retrieved).to.be.an("object");

        // check if the two created aggregates are different
        expect(aggr1).to.not.be.equal(aggr2);

        // check if the retrieved aggregate is the same as the created one
        expect(aggr1).to.be.equal(retrieved);
    });
});
