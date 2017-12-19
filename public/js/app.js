// ~function(){
  'use strict';

  //variables
  const $tweetTextArea = $('#tweet-textarea');
  const $tweetLengthDisplay = $('#tweet-char');
  const $tweetStyle = $('.app--tweet--char');
  let tweetLength;

  const $tweetButton = $('.button-primary');

  //Handler to manage Tweet length and styles
  $tweetTextArea.keyup(function(){

    tweetLength = $tweetTextArea.val().length;
    $tweetLengthDisplay.text(280 - tweetLength);

    if ( tweetLength > 280 && !($tweetStyle.hasClass('invalidLength')) ){
      $tweetStyle.addClass('invalidLength');
    }

    if ( tweetLength <= 280 && $tweetStyle.hasClass('invalidLength') ){
      $tweetStyle.removeClass('invalidLength');
    }

  });


  $tweetButton.click(function(e){
    e.preventDefault();

    //Log tweet text
    console.log( $tweetTextArea.val() );

    //Prevent tweet from sending if tweet length is too long
    if (tweetLength > 280){

      //Change to error style
      console.log("Error: Tweet is too long!")

    } else {

      //Submit validated data as POST request
        //Text of Tweet
        //Time of Tweet

      //Resets for after valid submission
      $tweetTextArea.val('');
      $tweetLengthDisplay.text(280);
    }
  });


// }();
