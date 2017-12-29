// ~function(){
  'use strict';

  const socket = io.connect();

  const $tweetForm = $('#tweetForm');
  const $timeline = $('.app--tweet--list'); // The ul of timeline list-items
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

    e.preventDefault();

    if (tweetLength > maxTweetLength){ // Invalid tweet

      alert("Error: Tweet is too long!");

    } else { // Valid tweet

      // emit tweet text to index.js
      socket.emit('tweet', $tweetTextArea.val());

      // Resets for after valid submission
      $tweetTextArea.val('');
      $tweetLengthDisplay.text(maxTweetLength);
    }

  });

  socket.on('new tweet', function(data){

    // Prepend what was actually tweeted with the T.post request
    // Data comes from socket w data param
    $timeline.prepend('<div>' + data.tweet + '</div>');

  });
// }();
