const monk = require('monk');
const db = monk(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/automatic-webhook-email');
const users = db.get('users');


exports.getUser = (automaticId, cb) => {
  users.findOne({automatic_id: automaticId}, cb);
};


exports.saveUser = (user, cb) => {
  users.findAndModify(
    {automatic_id: user.automatic_id},
    {$set: user},
    {upsert: true},
    cb
  );
};


exports.destroyUser = (automaticId, cb) => {
  users.remove({automatic_id: automaticId}, cb);
};
