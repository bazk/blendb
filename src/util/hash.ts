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

import crypto = require("crypto");

export class Hash {
    public static sha1(...objects: any[]): string {
        let hash = crypto.createHash("sha1");

        objects
            .map((obj) => {
                switch (typeof obj) {
                    case "string":
                        return obj;
                    case "object":
                        return JSON.stringify(obj);
                    default:
                        throw new TypeError(typeof obj +
                            " cannot be hashed");
                }
            })
            .sort()
            .map((objStr) => {
                hash.update(objStr);
            });

        return hash.digest("hex");
    }
}
