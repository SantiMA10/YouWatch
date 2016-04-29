/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
var Accel = require('ui/accel');
var win = new UI.Window();
var vec = require('vector2');

Accel.init();

// Construct URL
var channel = Settings.option('channel') || 'TrutOficial';
var init = Settings.option('init') || false;
var subs_count = 0;

if(init === undefined){
  var card = new UI.Card({
    title: 'Config me!',
    body: 'Open the setting and enter your channel name'
  });
  card.show();
}

var info = new UI.Text({ 
  position: new vec(0, 0), 
  size: new vec(140, 168),
  font: 'gothic-18',
  textAlign: 'center',
});
win.add(info);

var hour = new UI.TimeText({ 
  position: new vec(0, 60), 
  size: new vec(140, 168),
  text:'%I:%M %p',
  font: 'bitham-30-black',
  textAlign: 'center',
});
win.add(hour);

var date = new UI.TimeText({ 
  position: new vec(0, 125), 
  size: new vec(140, 168),
  text:'%d/%m/%y',
  font: 'gothic-24-bold',
  textAlign: 'center',
});
win.add(date);
win.show();

var load = function(){
  channel = Settings.option('channel') || 'TrutOficial';
  info.text('Reloading');
  ajax(
    {
      url: 'https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=' + channel + '&key={KEY}',
      type: 'json'
    },
    function(data, status, request) {
      subs_count = data.items[0].statistics.subscriberCount;
      info.text(subs_count.toLocaleString('en-IN') + ' subs');
    },
    function(error, status, request) {
      console.log('The ajax request failed: ' + error);
      card = new UI.Card({
        title: 'Error loading data',
        body: ':('
      });
      card.show();
    }
  );
};
load();


// Set a configurable with the open callback
Settings.config(
  { url: 'https://santima.xyz/YouWatchConfig/' },
  function(e) {
    Settings.option('init', true);
    Settings.option('channel', e.options.channel);
    load();
    // Reset color to red before opening the webview
  },
  function(e) {
    Settings.option('channel', e.options.channel);
    load();
  }
);

win.on('accelTap', function(e) {
  console.log('realod');
  load();
});
