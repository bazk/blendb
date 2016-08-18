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

export class Aggregate {
    public metrics: string[];
    public dimensions: string[];
    private data: any[];

    constructor(metrics: string[], dimensions: string[], options?: any) {
        this.metrics = metrics;
        this.dimensions = dimensions;

        this.data = [];
    }

    public push(data: any) {
        this.data.push(data);
    }

    public truncate() {
        this.data = [];
    }
}
