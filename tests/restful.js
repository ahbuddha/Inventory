var supertest = require("supertest");
var assert = require("assert");
var inventory  = new (require('../routes/_inventory.js'))();
var app = require('../app.js');

describe("RESTful API", function() {
    before(function() {
        describe("DELETE",function(){
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
                .expect(200, {}, done);            
            });
        });
    });
    describe("POST",function(){
        var params = {
            Label: 'No Bake Cookie',
            Type: 'Cookie',
            Expiration: '2016/10/05'
        };
        describe("Inserting new object",function(){
            it("should return 201",function(done){
                supertest(app)
                .post("/inventory")
                .send(params)
                .expect(201, done);
            });
        });
        describe("Newly created object was returned",function(){
            it("Should contain new object", function(done) {
                 supertest(app)
                .get("/inventory/" + params.Label)
                .expect("Content-type",/json/)
                .expect(200, params, done)
           });
        });
        describe("Duplicate insertion",function(){
            it("should return 400",function(done){
                supertest(app)
                .post("/inventory")
                .send(params)
                .expect(400, done);
            });
        });
        describe("Delete newly created object", function() {
             it("should return 200",function(done){                 
                supertest(app)
                .delete("/inventory/" + params.Label)
                .send(params)
                .expect(200, done);
            });
        });
        describe("Fetching deleted item",function(){
            it("Should not be found", function(done) {
                 supertest(app)
                .get("/inventory/" + params.Label)
                .expect("Content-type",/json/)
                .expect(400, done);
           });
        });
    });
    describe("PUT",function(){
        var params = {
            Label: 'O\'Henry Bars',
            Type: 'Cookie',
            Expiration: '2016/10/22'
        };
        describe("Creating object for it doesnt exist yet",function(){
            it("should return 201",function(done){
                supertest(app)
                .put("/inventory/" + params.Label)
                .send(params)
                .expect(201, done);
            });
        });
        describe("Newly created object was returned",function(){
            it("Should contain new object", function(done) {
                 supertest(app)
                .get("/inventory/" + params.Label)
                .expect("Content-type",/json/)
                .expect(200, params, done);
           });
        });
        describe("Editing newly created object",function(){
            it("should return 200",function(done){
                params.Expiration = '2018/01/01';
                supertest(app)
                .put("/inventory/" + params.Label)
                .send(params)
                .expect(200, done);
            });
        });
        describe("Edited object was returned",function(){
            it("Should contain edited object", function(done) {
                 supertest(app)
                .get("/inventory/" + params.Label)
                .expect("Content-type",/json/)
                .expect(200, params, done);
           });
        });
    });
    after(function() {
        describe("PUT & DELETE", function() {
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
            it("should put array of objects",function(done){
                supertest(app)
                .put("/inventory")
                .send(inventory.getData())
                .expect(200, done);
            });
            it("Should contain same array of objects", function(done) {
                 supertest(app)
                .get("/inventory")
                .expect("Content-type",/json/)
                .expect(200, inventory.getData(), done);
           });
        });
    });
});