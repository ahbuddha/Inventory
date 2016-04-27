var express = require('express');
var router = express.Router();
var fs = require('fs');
var inventory = new (require('./_inventory.js'))();
var twilio = require('./_twilio.js');

/* GET */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/inventory', function(req, res, next) {
    res.json(inventory.getData());
});
router.get('/inventory/:label', function(req, res, next) {
    var index = inventory.indexOfStr(req.params.label);
    if (index === -1) {
        res.status(400).json({ error: 'Label does not exist' });
    } {
        res.json(inventory.getData()[index]);
    }
});

/* POST */
router.post('/inventory', function(req, res, next) {
    var str = inventory.addObj(req.body);
    if (typeof str === 'string') {
        res.status(400).send(str);
    } else {
       res.status(201).end();
    }    
});

/* PUT */
router.put('/inventory', function(req, res, next) {
    if (req.body && Array.isArray(req.body)) {        
        var arr = [];
        inventory.clearData();
        for (var i = 0, l = req.body.length; i < l; ++i) {            
            arr.push(inventory.addObj(req.body[i]));
        }
        res.json(arr);
    } else {        
        res.status(400).end();
    }
});
router.put('/inventory/:label', function(req, res, next) {
    if (inventory.isValidObj(req.body)) {
        var index = inventory.indexOfObj(req.body);
        if (index === -1) {
            inventory.addObj(req.body);
            res.status(201).end();
        } else {            
            inventory.getData()[index] = req.body; 
            res.status(200).end();
        }
    }    
    res.status(400).end();
});

/* delete */
router.delete('/inventory', function(req, res, next) {
    inventory.clearData();
    res.status(200).send('success');
});
router.delete('/inventory/:label', function(req, res, next) {
    var index = inventory.indexOfStr(req.params.label);
    if (index === -1) {
        res.status(400).send('Label does not exist');
    } else {
        //twilio.itemRemoved(req.params.label);
        res.json(inventory.removeItemAtIndex(index));
    }
});
/* expired */
router.get('/expired-item', function(req, res, ne) {
    var arr = inventory.getExpiredItems();
    if (arr.length > 0) {
        twilio.itemExpired(arr);
    }
    res.json(arr);
});

module.exports = router;
