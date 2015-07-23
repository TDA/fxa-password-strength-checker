/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// A ux utility to suggest password strength

define(['jquery',
  'bloomfilter'
],
function ($, bloomfilter) {
  'use strict';

  var NO_OF_HASHING_FUNCTIONS = 8;
  var bloomfilter = null;
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: '../bower_components/fxa-password-strength-checker/src/bloomdata_short_pwd.js',
    error: function (jqxhr, status, err) { console.log(status + ' ERROR ' + err); }
  }).done(function (res){
    bloomfilter = new BloomFilter(res, NO_OF_HASHING_FUNCTIONS); //eslint-disable-line no-undef
  });

  function strengthCheck(password) {
    // Check for passwords that at least contain a number and an alphabet,
    // or if alphabets, then at least 12 characters long
    var regex = new RegExp('((?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+ ]{8,12})|([A-Za-z0-9!@#$%^&*()_+ ]{12,})');
    return regex.test(password);
  }

  return function checkPasswordStrength(view, target, metrics, translator) {
    var element = $(target);
    if (! element.length) {
      return;
    }

    var password = target.val();
    var strong = false;
    var bool = false;
    if (password.length < 8) {
      return;
    }
    strong = strengthCheck(password.toString());
    if (strong) {
      // Only if the password has a chance of being strong do we check with the bloom filter
      // else, simply reject the password. This helps us to not store all-alpha or all-numeric passwords
      // on the bloom filter, reducing space.
      bool = bloomfilter.test(password);
      metrics.logEvent('Password strength check with bloomfilter triggered');
    } else {
      bool = true;
      metrics.logEvent('Password with all alphabets/numbers detected');
    }

    if (bool) {
      // password was found in the bloom filter, or was too weak.
      metrics.logEvent('Password found in bloom filter or was weak');
    }
  };
});