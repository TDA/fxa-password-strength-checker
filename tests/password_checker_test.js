/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(['chai', 'passwordcheck'], function (chai, PasswordCheck) {
  (function() {
    var assert = chai.assert;
    var passwordcheck = new PasswordCheck();
    'use strict';
    describe('Password validation with regex', function () {
      it('returns MISSING_PASSWORD when no password is passed', function () {
        passwordcheck('', function (res) {
          assert.equal('MISSING_PASSWORD', res);
        });
      });

      it('returns PASSWORD_TOO_SHORT when password is lower than minLength', function () {
        passwordcheck('124as', function (res) {
          assert.equal('PASSWORD_TOO_SHORT', res);
        });
      });

      it('returns ALL_LETTERS_NUMBERS when password is all numbers', function () {
        passwordcheck('12456789', function (res) {
          assert.equal('ALL_NUMBERS_LETTERS', res);
        });
      });

      it('returns ALL_LETTERS_NUMBERS when password is all letters', function () {
        passwordcheck('dragondrag', function (res) {
          assert.equal('ALL_NUMBERS_LETTERS', res);
        });
      });
    });
  })();

});
