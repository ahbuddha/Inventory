var accountSid = 'AC5ef872f6da5a21de157d80997a64bd33';
var authToken = '[AuthToken]';

var client = require('twilio')(accountSid, authToken);

function sendMsg(msg) {
    client.messages.create({
        to: "+16518675309",
        from: "+14158141829",
        body: msg,
    }, function(err, message) {
        if (err) {
            console.log(err);
        } else {
            console.log(message)
        }
    });
}

exports.itemRemoved = function(label) {
    sendMsg("The following has been removed from inventory: " + label)
};

exports.itemExpired = function(label) {
    sendMsg("The following item has expired: " + label)
};
