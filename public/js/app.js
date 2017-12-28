// ~function(){
  'use strict';

  // var socket = io();

  // $('form').submit(function(){
  //   socket.emit('chat message', $('#m').val());
  //   $('#m').val('');
  //   return false;
  // });

  const $tweetTextArea = $('#tweet-textarea');
  const $tweetLengthDisplay = $('#tweet-char');
  const $tweetStyle = $('.app--tweet--char');
  const maxTweetLength = 280;
  let tweetLength;

  const $tweetButton = $('.button-primary');

  //Handler to manage Tweet length and styles
  $tweetTextArea.keyup(function(){

    tweetLength = $tweetTextArea.val().length;
    $tweetLengthDisplay.text(maxTweetLength - tweetLength);

    if ( tweetLength > maxTweetLength && !($tweetStyle.hasClass('invalidLength')) ){
      $tweetStyle.addClass('invalidLength');
    }

    if ( tweetLength <= maxTweetLength && $tweetStyle.hasClass('invalidLength') ){
      $tweetStyle.removeClass('invalidLength');
    }

  });


  $tweetButton.click(function(e){
    e.preventDefault();

    //Log tweet text
    console.log( $tweetTextArea.val() );

    //Prevent tweet from sending if tweet length is too long
    if (tweetLength > maxTweetLength){

      //Change to error style
      console.log("Error: Tweet is too long!")

    } else {

      //Submit validated data as POST request
        //Text of Tweet
        //Time of Tweet

      //Resets for after valid submission
      $tweetTextArea.val('');
      $tweetLengthDisplay.text(maxTweetLength);
    }
  });


// }();
