function Invenotry() {
    
    var data = require('./inventory.json');

    function isValidObj(obj) {
        if (!obj || Object.keys(obj).length !== 3) {
            return false;
        }
        if (obj.hasOwnProperty('Label') && 
            obj.hasOwnProperty('Type') && 
            obj.hasOwnProperty('Expiration') ) {
            return true;
        }
        return false;
    }

    function indexOfStr(str) {
        for (var i = 0, l = data.length; i < l; ++i) {
            if (str === data[i].Label) {
                return i;
            }
        }
        return -1;   
    }

    function indexOfObj(obj) {
         return indexOfStr(obj.Label);
    }

    function addObj(obj) {
        if (isValidObj(obj) === false) {
            return 'Invalid Object';
        }
        if (indexOfObj(obj) !== -1) {
            return 'Object already exists';
        }    
        return data.push(obj);
    }

    function getExpiredItems() {
        var arr = [], d;
        var now = new Date();
        for (var i = 0, l = data.length; i < l; ++i) {
            d = new Date(data[i].Expiration);
            if (d <= now) {
                arr.push(data[i].Label);
            }
        }
        return arr;
    }
    
    this.isValidObj = isValidObj;
    this.indexOfStr = indexOfStr;
    this.indexOfObj = indexOfObj;
    this.addObj = addObj;
    this.getExpiredItems = getExpiredItems;
    
    this.getData = function() {
        return data;
    };
    this.clearData = function() {
        data = [];
    };
    this.removeItemAtIndex = function(index) {
        data.splice(index, 1);
    };
}

module.exports = Invenotry;