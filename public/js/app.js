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
  $tweetTextArea.on('keyup', function(e) {

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

      // *** Emit tweet text to index.js
      socket.emit('tweet', $tweetTextArea.val());

      // *** Resets for after valid submission
      $tweetTextArea.val('');
      $tweetLengthDisplay.text(maxTweetLength);
    }

  });

  socket.on('new tweet', function( {newTweetData} ){

    $timeline.prepend(
      `<li>
        <strong class="app--tweet--timestamp">${newTweetData.timeSinceTweet}</strong>
        <a class="app--tweet--author">
          <div class="app--avatar" style="background-image: url(${newTweetData.userAvatarImage})"><img src="background-image: url(${newTweetData.userAvatarImage})"/></div>
          <h4>${newTweetData.name}</h4> @${newTweetData.screen_name}
        </a>
        <p>${newTweetData.text}</p>
        <ul class="app--tweet--actions circle--list--inline">
          <li>
            <a class="app--reply">
              <span class="tooltip">Reply</span>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="0 0 38 28" xml:space="preserve">
                <path d="M24.9,10.5h-8.2V2.8c0-1.1-0.7-2.2-1.7-2.6c-1-0.4-2.2-0.2-3,0.6L0.8,12c-1.1,1.1-1.1,2.9,0,4L12,27.2                c0.5,0.5,1.2,0.8,2,0.8c0.4,0,0.7-0.1,1.1-0.2c1-0.4,1.7-1.5,1.7-2.6v-7.7h8.2c3.3,0,6,2.5,6,5.6v1.3c0,2,1.6,3.5,3.5,3.5                s3.5-1.6,3.5-3.5v-1.3C38,16.2,32.1,10.5,24.9,10.5z"></path>
              </svg>
            </a>
          </li>
          <li>
            <a class="app--retweet">
              <span class="tooltip">Retweet</span>
              <svg id="Layer_1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="0 0 50 28" xml:space="preserve">
                <path d="M25.2,22.4H13.1v-9.3h4.7c1.1,0,2.2-0.7,2.6-1.7c0.4-1,0.2-2.3-0.6-3.1l-7.5-7.5c-1.1-1.1-2.9-1.1-4,0L0.8,8.3                c-0.8,0.8-1,2-0.6,3.1c0.4,1,1.5,1.7,2.6,1.7h4.7v12.1c0,1.5,1.3,2.8,2.8,2.8h14.9c1.5,0,2.8-1.3,2.8-2.8                C28,23.7,26.7,22.4,25.2,22.4z"></path>
                <path d="M49.8,16.7c-0.4-1-1.5-1.7-2.6-1.7h-4.7V2.8c0-1.5-1.3-2.8-2.8-2.8H24.8C23.3,0,22,1.3,22,2.8s1.3,2.8,2.8,2.8h12.1v9.3                h-4.7c-1.1,0-2.2,0.7-2.6,1.7c-0.4,1-0.2,2.3,0.6,3.1l7.5,7.5c0.5,0.5,1.3,0.8,2,0.8c0.7,0,1.4-0.3,2-0.8l7.5-7.5                C50,18.9,50.2,17.7,49.8,16.7z"></path>
              </svg>
              <strong>${newTweetData.retweetCountOfTweet}</strong>
            </a>
          </li>
          <li>
            <a class="app--like">
              <span class="tooltip">Like</span>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="0 0 35 28" xml:space="preserve">
                <path class="st0" d="M25.8,0c-3.6,0-6.8,2.1-8.3,5.1C16,2.1,12.9,0,9.2,0C4.1,0,0,4.1,0,9.2C0,21.4,17.3,28,17.3,28S35,21.3,35,9.2                C35,4.1,30.9,0,25.8,0L25.8,0z"></path>
              </svg>
              <strong>${newTweetData.likeCountOfTweet}</strong>
            </a>
          </li>
        </ul>
      </li>`
    );
  }); //End socket connection
// }();
