// ~function(){
  'use strict';

  var socket = io.connect();

  const $tweetForm = $('#tweetForm');
  const $tweetTextArea = $('#tweet-textarea');
  const $tweetLengthDisplay = $('#tweet-char');
  const $tweetStyle = $('.app--tweet--char');
  const maxTweetLength = 280;
  let tweetLength;

  //Handler to manage Tweet length and styles
  $tweetForm.on('keyup', function(){

    //tweetLength initializes on page load as 1 in Firefox, but as 0 in Chrome
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

    //Prevent tweet from sending if tweet length is too long
    if (tweetLength > maxTweetLength){

      //Change to error style or modal pop up
      console.log("Error: Tweet is too long!")

    } else {

      //Log tweet text
      console.log( $tweetTextArea.val() );

      // //emit tweet text to index.js
      // socket.emit('tweet', $tweetTextArea.val());

      //Resets for after valid submission
      $tweetTextArea.val('');
      $tweetLengthDisplay.text(maxTweetLength);
    }
    e.preventDefault();
  });


// }();
