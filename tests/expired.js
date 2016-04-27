var supertest = require("supertest");
var assert = require("assert");
var inventory  = require('../routes/_inventory.js');
var app = require('../app.js');

var yearFromNow = new Date();
yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);

var expired1 = {
    Label: 'No Bake',
    Type: 'Cookie',
    Expiration: '2016/01/05'
};
var expired2 = {
    Label: 'Chocolate Chip',
    Type: 'Cookie',
    Expiration: '2016/02/15'
};
var notExpired = {
    Label: 'Peanut Butter',
    Type: 'Cookie',
    Expiration: yearFromNow.toJSON()
};

describe("Expired Items",function(){
    it("should delete all objects",function(done){
        supertest(app)
        .delete("/inventory")
        .expect(200)
        .end(function(err, res) {                
            assert.ifError(err);
            assert.deepStrictEqual(res.text, 'success');
            done();
        });
    });
    it("should return empty json object",function(done){
        supertest(app)
        .get("/inventory")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err, res) {
            assert.ifError(err);
            assert.deepStrictEqual(res.body.length, 0);  
            done();
         });
    });
    describe("Inserting expired object: " + expired1.Expiration,function(){
        it("should return 201",function(done){
            supertest(app)
            .post("/inventory")
            .send(expired1)
            .expect(201, done);
        });
    });
    describe("Getting expired item",function(){
        it("Should return " + expired1.Label, function(done) {
             supertest(app)
            .get("/expired-item")
            .expect("Content-type",/json/)
            .expect(200, [expired1.Label], done);
       });
    });    
    describe("Inserting non-expired object: " + notExpired.Expiration,function(){
        it("should return 201",function(done){
            supertest(app)
            .post("/inventory")
            .send(notExpired)
            .expect(201, done);
        });
    });
    describe("Contains two items, one of which is expired",function(){
        it("Should return one item: " + expired1.Label, function(done) {
             supertest(app)
            .get("/expired-item")
            .expect("Content-type",/json/)
            .expect(200, [expired1.Label], done);
       });
    });    
    describe("Inserting expired item: " + expired2.Expiration,function(){
        it("should return 201",function(done){
            supertest(app)
            .post("/inventory")
            .send(expired2)
            .expect(201, done);
        });
    });
    describe("Contains three items, two of which are expired",function(){
        it("Should return two items", function(done) {
             supertest(app)
            .get("/expired-item")
            .expect("Content-type",/json/)
            .expect(200, [expired1.Label, expired2.Label], done);
       });
    });
});