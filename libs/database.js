var monk = require('monk');
var db = monk(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/automatic-webhook-email');
var users = db.get('users');


exports.getUser = function(automatic_id, cb) {
  users.findOne({automatic_id: automatic_id}, cb);
};


exports.saveUser = function(user, cb) {
  users.findAndModify(
    {automatic_id: user.automatic_id},
    {$set: user},
    {upsert: true},
    cb
  );
};


exports.destroyUser = function(automatic_id, cb) {
  users.remove({automatic_id: automatic_id}, cb);
};
