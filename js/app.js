var exportApp = new function() {	
	"use strict";
	//private variable
	var that = this;
	this.utilities;


	this.urlCrossDomain = 'http://' + location.hostname + '/php/exportApp/app.php';
	/*this.urlCrossDomain = 'http://uat.experiencity.co/php/exportApp/app.php';
	this.urlCrossDomain = '../../../php/exportApp/app.php';*/
	/*this.urlToCreateSessionWander = 'http://experiencity.co/wanderingdev/site/wander/php/crtse.php';*/
	this.urlToCreateSessionWander = 'http://uat.thewandering.net/site/wander/php/crtse.php';
	
	this.IniApp = function() {
		that.utilities = new utilitys();	
	};
	
	this.PopulateData = function () {
		//console.log(dataSerialized);
		if(dataSerialized.areaAditionalText != '' && dataSerialized.textTitle != '') {
			var title = $('#titleDocument');
			var textArea = $('#additionalText');
			title.html(dataSerialized.textTitle);		
			title.css('color',dataSerialized.textTitleColor);		
			textArea.html(dataSerialized.areaAditionalText);		
			textArea.css('text-align',dataSerialized.aditionalTextStyle);
			textArea.css('color',dataSerialized.colorAdditionalText);
		}
		
		if(dataSerialized.urlBackground != '') {	
			$("#pageMenuContent").css("background-image", "url(" + dataSerialized.urlBackground + ")");
		} 
		$("#containerCroppedImage > img").attr('src',dataSerialized.urlJcrop);
		
		if(dataSerialized.expType == '10') {
			$('#enterLikeGuest').show();
		}
	};

	
	this.AuthenticateUser = function(data) {
		$.mobile.showPageLoadingMsg();
		that.utilities.MakeRequestCrossDomain(that.urlCrossDomain + '?callback=exportApp.IsLoginValid&action=login&' + 
		'credential=' + data.email + ',' + data.password + ',' + data.idExp);
	};
	
	this.IsLoginValid =  function(respond) {
		if(respond.status == 'true') {	

			that.utilities.MakeRequestCrossDomain(that.urlToCreateSessionWander + '?callback=exportApp.RedirectToApp&type=' + 
				respond.data.Type + '&' + 'session=' + respond.data.sessionId);

			$.cookie('appExportedSession',respond.data.user + ',' + respond.data.sessionId );
			this.RedirectToApp(respond.data.Type);
		} else 	{
			$('.msgStatus').html('User and password do not match');
			$('.msgStatus').addClass('ui-body-f');
		}

		$.mobile.hidePageLoadingMsg();
	};

	this.RedirectToApp = function (typeExp) {
		
		switch(typeExp)
		{
			case 2:
				//poster
			case 3:
				//Route
			case 5:
				//Interactive Image
			case 6:
				//Street View
			case 8:
				//Interactive Board Game
			case 9:
				//Choice Games
			case 11:
				//Score Orienteering
			case 13:
				//visitor media
				window.location = "embed.html?id=" + dataSerialized.idExp + '&app';
			break;
			case 7:
				//Place Race
				window.location = "http://thewandering.net/activities/placerace/game.html?activity=" + dataSerialized.idExp;
			break;
			case 10:
				//Puzzle
				window.location = "puzzleGame.html?id=" + dataSerialized.idExp + '&app';
			break;
			case 12:
				//Puzzle
				window.location = "IndoorPuzzleGame.html?id=" + dataSerialized.idExp + '&app';
			break;
		}
	};
	
	$(document).ready(function() {
		that.IniApp();
		that.PopulateData();		
		$('#loginForm').submit(function(){
			var credential = that.utilities.ArrayObjToObjSimple($(this).serializeArray());
			credential.idExp = dataSerialized.idExp;
			that.AuthenticateUser(credential);
			return false;
		});
		
		$('#enterLikeGuest').on('click',function(){
			window.location = "puzzleGame.html?id=" + dataSerialized.idExp + '&app&guest';
		});
	});
};