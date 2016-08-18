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

import { expect } from 'chai';

import { Hash } from './hash';

describe('hash utility library', () => {
    it('should generate a sha1 hash for a collection of objects', () => {
        let h = Hash.sha1('test', { obj: 'test' }, ['list', 'of', 'things']);

        expect(h).to.be.a('string');
        expect(h).to.not.be.empty;
    });

    it('should generate the same hash for the same input', () => {
        let h1 = Hash.sha1('test', { obj: 'test' }, ['list', 'of', 'things']);
        let h2 = Hash.sha1('test', { obj: 'test' }, ['list', 'of', 'things']);

        expect(h1).to.be.a('string');
        expect(h2).to.be.a('string');
        expect(h1).to.be.equal(h2);
    });

    it('should generate the same hash for different order of input', () => {
        let h1 = Hash.sha1('test', { obj: 'test' }, ['list', 'of', 'things']);
        let h2 = Hash.sha1('test', ['list', 'of', 'things'], { obj: 'test' });

        expect(h1).to.be.a('string');
        expect(h2).to.be.a('string');
        expect(h1).to.be.equal(h2);
    });

    it('should not generate the same hash for distinct input', () => {
        let h1 = Hash.sha1('test', { obj: 'test' }, ['list', 'of', 'things']);
        let h2 = Hash.sha1('test', { obj: 'test', x: true },
            ['list', 'of', 'things']);

        expect(h1).to.be.a('string');
        expect(h2).to.be.a('string');
        expect(h1).to.not.be.equal(h2);
    });

    it('should not generate the same hash for different order in deep lists', () => {
        let h1 = Hash.sha1('test', { obj: 'test' }, ['list', 'of', 'things']);
        let h2 = Hash.sha1('test', { obj: 'test' }, ['of', 'list', 'things']);

        expect(h1).to.be.a('string');
        expect(h2).to.be.a('string');
        expect(h1).to.not.be.equal(h2);
    });
});
