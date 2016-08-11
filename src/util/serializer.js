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

class Serializer {
    dump(obj) {
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'function') {
                return value.toString()
                    .replace(/[\n\r\t]/g, '')
                    .replace(/ +/g, ' ');
            }

            return value;
        });
    }

    load(str) {
        return JSON.parse(str, (key, value) => {
            if (key === '') {
                return value;
            }

            if (typeof value === 'string') {
                let rfunc = /function[^\(]*\(([^\)]*)\)[^\{]*\{(.*)\}[^\}]*$/;
                let match = value.replace(/\n/g, '').match(rfunc);

                if (match) {
                    let args = match[1].split(',')
                        .map((arg) => arg.replace(/\s+/, ''));
                    return new Function(args, match[2]);
                }
            }

            return value;
        });
    }
}

module.exports = new Serializer();
