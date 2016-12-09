'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
  account: { type: String, lowercase: true },
  hashedPassword: String,
  provider: String,
  salt: String,
  _creator:{
    type: String,
    ref: 'User'
  },
  _info:{
    type: String,
    ref: 'Info'
  },
  tel:String,//subAdmin有
  name:String,//subAdmin有
  role:String,//admin,subAdmin,只有管理员和子管理员有
  belong:{
    type:String,
    ref:'User'
  },//属于哪个subAdmin
  isDelete:Boolean,
  createDate:Date
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });



/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('account')
  .validate(function(account) {
    return account.length;
  }, '账号不能为空');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, '密码不能为空');

// Validate email is not taken
UserSchema
  .path('account')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({account: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, '账号已被使用');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('无效密码'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
