$( document ).ready(function() { 
	var storage = localStorage.getItem(TEST_NAME);
	if (storage !== null) {
		storage = JSON.parse(storage);
		if (storage.jsonPath != undefined && storage.jsonPath.indexOf(LANG) != -1) {			
			JSON_PATH = storage.jsonPath; 
		}
	} 

	$.getJSON( JSON_PATH, function( data ) {
		questions = Object.values(data["quests"]);
		test.init();
	});	
});

var questions, test = {
	Answers:null,
	countCorrectAnswer:0,
	CurrentQuest:-1,
	PartSize:0,
	WidthCorrectProgress:0,
	WidthWrongProgress:0,
	seconds: 0,
	minutes:0,
	timerId:0,
	DoughnutTextInsideChart:0,
	init : function(){
		var storage = localStorage.getItem(TEST_NAME);
		if (storage === null) {
			test.start(test.getDefaultConfig());
		}
		else {
			storage = JSON.parse(storage);
			if (storage.countCorrectAnswer + storage.countWrongAnswer == storage.countQuest) storage = test.getDefaultConfig();
			test.start(storage);
		}
		
		
		$("#questAnswers").on("click", "div.answer-block", function(){
			if (test.Answers[test.CurrentQuest] == 0) {
				$("#questAnswers").addClass("disabled");
				$(this).addClass("dot");
				
				test.Answers[test.CurrentQuest] = $(this).data("ind");
				
				if (questions[test.CurrentQuest]["correctAnswer"] == $(this).data("ind"))
				{
					$(this).addClass("correct");				
					$(this).prepend(test.render('riple',-1));
					
					test.WidthCorrectProgress += test.PartSize;
					$("#progressCorrect").css("width", test.WidthCorrectProgress+"%");
					
					test.countCorrectAnswer++;
				}else {
					$(this).addClass("wrong");
					$(this).prepend(test.render('riple',-1));
					
					$('div[data-ind="'+questions[test.CurrentQuest]["correctAnswer"]+'"]').addClass("correct");
					$('div[data-ind="'+questions[test.CurrentQuest]["correctAnswer"]+'"]').prepend(test.render('riple',-1));
					
					test.WidthWrongProgress += test.PartSize;
					$("#progressWrong").css("width", test.WidthWrongProgress+"%");					
				}

				$(".quest-next").removeClass("disabled");
				//$("#questComment").html(questions[test.CurrentQuest]["comment"]).show();
				
				localStorage.setItem(TEST_NAME, JSON.stringify({
					Answers: test.Answers,
					countCorrectAnswer: test.countCorrectAnswer,
					countWrongAnswer: (test.CurrentQuest + 1) - test.countCorrectAnswer,
					CurrentQuest: test.CurrentQuest + 1,
					countQuest: questions.length,
					timerSeconds: test.seconds,
					timerMinutes: test.minutes,
					jsonPath: JSON_PATH
				}));
			}
		});
		
		$("#questPrev").on("click", "div.quest-prev", function(){			
			if (test.CurrentQuest>0) test.showQuest(test.CurrentQuest-1);
		});
		
		$("#questNext").on("click", "div.quest-next", function(){			
			if (test.CurrentQuest+1<questions.length) test.showQuest(test.CurrentQuest+1);
			else test.showEnd();
		});
		
		$("#questTopButton").on("click", "div.quest-start", function(){
			localStorage.removeItem(TEST_NAME);
			test.start(test.getDefaultConfig());
		});
		
		$("#questList").on("click", "div.blockEndQuest", function(){
			var elem = $(this).children().eq(2);
			var elemImage = $(this).children().eq(1);
			var elemDisplay = elem.is(':visible');
			var currentSelectQuest = $( ".blockEndQuest" ).index( this ) ;
			var questAnswered = test.Answers[currentSelectQuest] !=0;
			var selectAnswer = -1;
			
			$(".end-answers").slideUp();
			$(".end-image").slideUp();
			
			if (!elemDisplay) {
				elem.empty();
				
				if(test.checkMainImage(currentSelectQuest)) 
					elemImage.html("<img src='"+IMAGES_PATH+"/"+questions[currentSelectQuest]["img"]+"'>");

				var sizeAnswer = questions[currentSelectQuest]["answer"].length;				
				for(var i=0;i<sizeAnswer;i++){
					elem.append(test.render('answer',{ind:i+1,text:questions[currentSelectQuest]["answer"][i]}));
				}
				
				var correctAnswer = elem.children().eq(questions[currentSelectQuest]["correctAnswer"]-1);
				
				if (questAnswered) {
					selectAnswer = elem.children().eq(test.Answers[currentSelectQuest]-1);
					selectAnswer.addClass("dot");
				}
				
				if (questions[currentSelectQuest]["correctAnswer"] == test.Answers[currentSelectQuest]) {
					if (questAnswered) {
						selectAnswer.addClass("correct");				
						selectAnswer.prepend(test.render('riple',-1));
					}
				} else {
					if (questAnswered) {
						selectAnswer.addClass("wrong");				
						selectAnswer.prepend(test.render('riple',-1));
					}
					
					correctAnswer.addClass("correct");
					correctAnswer.prepend(test.render('riple',-1));
				}
				
				elemImage.slideDown();
				elem.slideDown();				
			}
		});
	},
	start: function(config)
		{		
			$( "#questMainBlock" ).show();
			$("#timerBlock").show();	
			$( "#questEnd" ).hide();	
			
			test.Answers = config.Answers;
			test.countCorrectAnswer = config.countCorrectAnswer;
			test.CurrentQuest = config.CurrentQuest;		
			test.PartSize = 100/questions.length;		
			test.WidthCorrectProgress = test.PartSize * config.countCorrectAnswer;
			test.WidthWrongProgress = test.PartSize * config.countWrongAnswer;
			
			$("#progressWrong").css("width", test.WidthWrongProgress+"%");
			$("#progressCorrect").css("width", test.WidthCorrectProgress+"%");
			
			test.showQuest(test.CurrentQuest);
			test.startTimer(config.timerSeconds, config.timerMinutes);
			
			if (test.DoughnutTextInsideChart != 0) test.DoughnutTextInsideChart.destroy();

		},
	showEnd: function()
	{
		if (test.timerId>0) clearTimeout(test.timerId);
		$("#timerBlock").hide();

		var valueCorrectAnswer = (((test.countCorrectAnswer / questions.length) * 100).toFixed(2))/1;
		console.log(valueCorrectAnswer);			
		var pieData = [
			{
			value: valueCorrectAnswer,
			color:"#54e462"
			},
			{
			value : 100-valueCorrectAnswer,
			color : "#f44"
			}
		];
		$( "#questList" ).empty();
		$( "#questMainBlock" ).fadeOut( "slow", function() {
			$("#questEndMaxMark").html(
				TRANSLATE.getFormat("Вы верно ответили на $0$ с $1$ вопросов</br>Ваше время: $2$", [
					test.countCorrectAnswer, 
					questions.length,
					test.getTimeString()
				])
			);
			
			$("#questEndTextMark").text(test.judgeSkills(valueCorrectAnswer));
			
			for (var i=0;i<questions.length;i++)
				$("#questList").append("<div class='blockEndQuest'><div class='quest-end-header " + 
					(questions[i]["correctAnswer"] == test.Answers[i]? "correct":"wrong") +"'>"+questions[i]["title"]+"</div> <div class='end-image'></div> <div class='end-answers'></div></div>");
			
			$( "#questEnd" ).fadeIn( "slow", function() {
				
				test.DoughnutTextInsideChart = new Chart($('#myChart')[0].getContext('2d')).DoughnutTextInside(pieData, {
					responsive: true,
					percentageInnerCutout:65
				});

			});
		});		
	},
	render : function(template,params){
		var arr = [];
		switch(template){
			case 'answer': 
				arr = ["<div class='answer-block' data-ind='",params.ind,"'> <div class='inner'><i class='answer-circle'></i>	<div class='answer-text'> ",params.text," </div></div></div>"];
			break;
			
			case 'riple':
				arr=["<div class='ripple'><div class='ripple-effect'></div></div>"];
			break;
		}
		return arr.join('');
		
	},
	showQuest : function(ind){	
	
		test.CurrentQuest = ind;
		
		$("#questLabel").text(TRANSLATE.getFormat("Вопрос $0$ c $1$", [ind + 1, questions.length]));		
			
		$("#questTitle").html(questions[ind]["title"]);
		if (test.checkMainImage(ind))
			$("#questImage").html("<img src='"+IMAGES_PATH+"/"+questions[ind]["img"]+"'>");
		else $("#questImage").empty();
		
		$("#questAnswers").empty();
		var sizeAnswer = questions[ind]["answer"].length;
		for(var i=0;i<sizeAnswer;i++){
			$("#questAnswers").append(test.render('answer',{ind:i+1,text:questions[ind]["answer"][i]}));
		}
		
		if (test.Answers[test.CurrentQuest] == 0) {
			$("#questAnswers").removeClass("disabled");
		}else {
			$("#questAnswers").addClass("disabled");
			selectAnswer = $('div[data-ind="'+test.Answers[test.CurrentQuest]+'"]');
			selectAnswer.addClass("dot");
			if (questions[test.CurrentQuest]["correctAnswer"] == test.Answers[test.CurrentQuest])
			{
				selectAnswer.addClass("correct");				
				selectAnswer.prepend(test.render('riple',-1));
			}else {
				selectAnswer.addClass("wrong");
				selectAnswer.prepend(test.render('riple',-1));
					
				$('div[data-ind="'+questions[test.CurrentQuest]["correctAnswer"]+'"]').addClass("correct");
				$('div[data-ind="'+questions[test.CurrentQuest]["correctAnswer"]+'"]').prepend(test.render('riple',-1));
			}
		}
		
		if (test.CurrentQuest == 0) $(".quest-prev").addClass("disabled");
		else $(".quest-prev").removeClass("disabled");
		
		if (test.Answers[test.CurrentQuest] == 0) {
			$(".quest-next").addClass("disabled");
			//$("#questComment").hide();
		} else {
			$(".quest-next").removeClass("disabled");
		//	$("#questComment").show();
		}
		
		if (test.CurrentQuest+1 == questions.length) $(".quest-next").text(TRANSLATE.get("Результат"));
		else $(".quest-next").text(TRANSLATE.get("Далее"));
	},
	addSecond : function () {
		test.seconds++;
		if (test.seconds >= 60) {
			test.seconds = 0;
			test.minutes++;
		}

		var storage = localStorage.getItem(TEST_NAME);
		if (storage !== null) {
			storage = JSON.parse(storage);
			storage.timerSeconds = test.seconds;
			storage.timerMinutes = test.minutes;
			localStorage.setItem(TEST_NAME, JSON.stringify(storage));
		}

		$("#timer").text(test.getTimeString());
		test.timerId = setTimeout(test.addSecond, 1000);
		test.endTimer()
	},
	getTimeString : function () {
		return (test.minutes ? (test.minutes > 9 ? test.minutes : "0" + test.minutes) : "00") + ":" + (test.seconds > 9 ? test.seconds : "0" + test.seconds);
	},
	startTimer :  function (sStart, mStart) {
		test.seconds = sStart;
		test.minutes = mStart;			
		if (test.timerId>0) clearTimeout(test.timerId);
		$("#timer").text(test.getTimeString());
		test.timerId = setTimeout(test.addSecond, 1000);
	},
	endTimer: function() {
		if (test.minutes >= 20 & test.seconds >= 0) {
			test.showEnd()
		}
	},
	checkMainImage: function(questIND) {
		return questions[questIND].hasOwnProperty("img") && questions[questIND]["img"] != "none";
	},
	judgeSkills: function (score) {
		return "";
	},
	getDefaultConfig: function () {
		return {
			Answers: new Array(questions.length + 1).join('0').split('').map(parseFloat),
			countCorrectAnswer: 0,
			countWrongAnswer: 0,
			CurrentQuest: 0,
			timerSeconds: 0,
			timerMinutes: 0,
			jsonPath : "",
		}
	}
}
