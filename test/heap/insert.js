'use strict';
var heap = require('../../lib/heap');
var expect = require('chai').expect;
describe('data-store/heap/insert', function() {
    if (!heap.isSupported()) {
        return;
    }

    it('lets you insert valid values in the database', function() {
        var datastore = null;
        return heap.init('db1-insert', [
            {
                indexes: [{name: 'attr1'}],
                name: 'table1'
            }
        ]).then(function(db) {
            datastore = db;
        }).then(function() {
            return datastore.insert({name: 'table1'}, [
                {
                    attr1: 'A',
                    attr2: 'B'
                }
            ]);
        }).then(function() {
            return datastore.select({
                index: 'attr1',
                name: 'table1'
            }, {});
        }).then(function(data) {
            expect(data[0].attr1).to.eql('A');
            expect(data[0].attr2).to.eql('B');
            return heap.destroy('db1-insert');
        });
    });
    it('doesn\'t allow inserting in a non-existing table', function(done) {
        var datastore = null;
        return heap.init('db2-insert', [
            {
                indexes: [{name: 'attr1'}],
                name: 'table1'
            }
        ]).then(function(db) {
            datastore = db;
        }).then(function() {
            return datastore.insert({name: 'table_doesnt_exist'}, [
                {
                    attr1: 'A',
                    attr2: 'B'
                }
            ]);
        }).fail(function() {
            return heap.destroy('db2-insert').then(function() {
                done();
            });
        });
    });

    it('doesn\'t let you insert values with missing values for indexes', function() {
        var datastore = null;
        return heap.init('db3-insert', [
            {
                indexes: [
                    {
                        name: 'attr1'
                    }
                ],
                name: 'table1'
            }
        ]).then(function(db) {
            datastore = db;
        }).then(function() {
            return datastore.insert({name: 'table1'}, [{attr1: null}]);
        }).then(function() {
            return datastore.select({
                index: 'attr1',
                name: 'table1'
            }, {});
        }).then(function(data) {
            expect(data.length).to.eql(0);
            return heap.destroy('db3-insert')
        });
    });
});
