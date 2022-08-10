/********************************************
@Creator		: DarkZeus2002
@Date			: 2022.08.08
@Last Modified		: 2022.08.08
********************************************/

/*Importing required libs*/
const { EmbedBuilder, WebhookClient } = require('discord.js');
const axios = require('axios');

/*URLs / HEROKU VARIABLES*/
url = process.env.fandom_url; //URL of the fandom site - HEROKU VARIABLE
webhook_url = process.env.webhook_url; // TEST Channel //Discord Webhook URL
avatar_img_url = 'https://cdn.discordapp.com/icons/602832237146406914/fbb833356958bbfeafbc8d77f385772a.webp?size=96'; //Discord BOT avatar 

/*Customizables*/
var bot_name=''; //Name of the Discord BOT
var emb_color = ''; // Embed strip color

/*required constants do not change*/
var time=[];
var arr_needed=[];
var contect='';
var emb_desc='';
var title = '';
const webhookClient= new WebhookClient({url: webhook_url});
const edit_types = {"new":{"type":"Created","color":"#00FF00"},"edit":{"type":"Edited","color":"#0000FF"},"blank":{"type":"Blanked","color":"#FF0000"},"log":{"type":"Deleted","color":"#FFFF00"}};
// results = 4; // For Testing purposes

function httpGet(){
utc_time=new Date();
utc_time.setHours(utc_time.getHours() - 1);
//time_end=calc_time(utc_time)[1]; // For Testing purposes
time_start=utc_time.toISOString();//calc_time(utc_time)[0] //Calling the function for building ISO 8601 with UTC time & 1h offset
//console.log(time_start); //Debugging line
full_url = url+"api.php?action=query&format=json&list=recentchanges&rcprop=user|comment|title|timestamp|sizes&rcdir=newer&rcstart="+time_start; //Building the API call
 console.log(full_url); //Debugging line

/*API call*/
axios
  .get(full_url)
  .then(res => {
    //console.log(`statusCode: ${res.status}`);
	console.log(res.data.query);
	for (i=0;i<res.data.query.recentchanges.length;i++){ //Going through each result for forwarding it to discord
		msg = res.data.query.recentchanges[i];
		if(msg.newlen==0 && msg.type!= 'log'){
			msg.type='blank';
		}
		s_msg=msg.user + ' has ' + edit_types[msg.type].type + ' ' + msg.title + ' Page at ' + msg.timestamp + ' (UTC)\n' + 'View Changes : ' + url + 'wiki/' + msg.title ;
		const embed = new EmbedBuilder()
		.setTitle('Page '+ edit_types[msg.type].type)
		.setColor(edit_types[msg.type].color)
		.setDescription(s_msg);
		
		webhookClient.send({
		content: 'Wiki Updated',
		username: 'King Eric',
		avatarURL: avatar_img_url,
		embeds: [embed],
		});
	}
  })
  .catch(error => {
    console.error(error); //Logging errors if there were any
  });
}

setInterval(httpGet,3600000); //Test mode set to 3.6 secounds //calling the fetch function every 1h



