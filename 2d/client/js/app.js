(function() {
  'use strict';

  // create a new websocket
  var socket = io.connect(),

    $btn = $('button'),

    $anim = $('.img-src'),

    $bpm = $('.bpm'),

    sound = new Howl({

        urls: ['heartbeat-05.mp3']
    }),

    $timeout=null,

    lightStatus = 'off',

    toggleLightStatus = function() {

      lightStatus = lightStatus === 'off' ? 'on' : 'off';

      socket.emit('lightStatus', lightStatus);

    },
    onSocketNotification = function(data) {


        sound.play();

        $bpm.html(data);

        TweenMax.set($bpm,{css:{y:-140,alpha:0}});
        TweenMax.from('.img-src', 0.8, {css:{scale:0.98},overwrite:true, ease:Elastic.easeOut});
        TweenMax.to($bpm, 0.8, {css:{y:-160,alpha:1,scale:0.9}, ease:Elastic.easeOut});

        $anim.attr({src:'giphy.gif'});

        clearTimeout($timeout);

        $timeout = setTimeout(function(){
            $anim.attr({src:'giphy_static.png'});
        },500);

    };

  // Set listeners
  socket.on('notification', onSocketNotification);
  $btn.on('click', toggleLightStatus);

  // turn off the light by default on any new connection
  socket.emit('lightStatus', lightStatus);

}());