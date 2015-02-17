/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var ajax = require('ajax');
var wind = new UI.Window();
var channel = Settings.data('channel');

var info = new UI.Text({ 
  position: new Vector2(0, 0), 
  size: new Vector2(140, 168),
  font: 'gothic-18',
  textAlign: 'left',
});

var getData = function (id){
  ajax(
    {
      url: 'http://gdata.youtube.com/feeds/api/users/'+id,
      type: 'xml'
    },
    function(data) {
      console.log('Successfully fetched YouTube data!');
      Settings.data('channel', {name : data.match(/<name>(.*?)<\/name>/)[1], 
                                sus: data.match(/subscriberCount='(.*?)'/)[1],
                                id: id});
      channel = Settings.data('channel');
      console.log(channel.name + " " + channel.sus);
      info.text("Channel: " +channel.name + "\nSuscribers: " + channel.sus);
    },
    function(error) {
      console.log('Failed fetching YouTube data: ' + error);
    }
  );
};

Settings.config(
  { url: 'http://trut.es/pebble/config.html' },
  function(e) {
    console.log('closed configurable');

    // Show the parsed response
    getData(e.options.channel);
    
    wind.show();

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);

var card = new UI.Card({
  title: 'Hello!',
  body: 'Open the config in your phone and enter your channel name.',
});

setInterval(function() { getData(channel.id); }, 900000);

wind.add(info);

var hora = new UI.TimeText({ 
  position: new Vector2(0, 65), 
  size: new Vector2(140, 168),
  text:'%I:%M %p',
  font: 'bitham-30-black',
  textAlign: 'center',
});
wind.add(hora);

var fecha = new UI.TimeText({ 
  position: new Vector2(0, 125), 
  size: new Vector2(140, 168),
  text:'%d/%m/%y',
  font: 'gothic-24-bold',
  textAlign: 'center',
});
wind.add(fecha);

wind.show();

if(!channel){
  console.log("not found" + channel);
  card.show();
  getData('TrutOficial');
  channel = Settings.data('channel');
}
else{
  info.text("Channel: " +channel.name + "\nSuscribers: " + channel.sus);
}
