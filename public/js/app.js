// ~function(){
  'use strict';

  const socket = io.connect();

  const $tweetForm = $('#tweetForm');
  const $tweetTextArea = $('#tweet-textarea');
  const $tweetLengthDisplay = $('#tweet-char');
  const $tweetStyle = $('.app--tweet--char');
  const maxTweetLength = 280;
  let tweetLength;

  // Handler to manage Tweet length and styles
  $tweetForm.on('keyup', function(){

    // tweetLength initializes on page load as 1 in Firefox, but as 0 in Chrome
    tweetLength = $tweetTextArea.val().length;
    $tweetLengthDisplay.text(maxTweetLength - tweetLength);

    if ( tweetLength > maxTweetLength && !($tweetStyle.hasClass('invalidLength')) ){
      $tweetStyle.addClass('invalidLength');
    }

    if ( tweetLength <= maxTweetLength && $tweetStyle.hasClass('invalidLength') ){
      $tweetStyle.removeClass('invalidLength');
    }

  });


  $tweetForm.on('submit', function(e) {


    if (tweetLength > maxTweetLength){ // Invalid tweet

      alert("Error: Tweet is too long!");

    } else { // Valid tweet

      // emit tweet text to index.js
      socket.emit('tweet', $tweetTextArea.val());

      // Resets for after valid submission
      $tweetTextArea.val('');
      $tweetLengthDisplay.text(maxTweetLength);
    }
    e.preventDefault();
  });


// }();
