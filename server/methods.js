/*
* Server Methods
*/
Meteor.methods({

	//start game with question
	ask_question: function(question){
		var question_id = Questions.insert({
			text: question, 
			active: true,
      		owner: Meteor.user().username, 
			time: Date.now()
		});

	    var game_id = Games.insert({
	      question: question_id,
	      hints: [],
	      answers: [],
	      active: true,
	      master: Meteor.user().username,
	      time: Date.now()
	    });
	    Meteor.users.update({}, {$set: {numGuesses: 1}}, {multi: true});
		return game_id;
	},

	//user adds an answer to current question
	add_answer: function(answer){
		var ans_id = Answers.insert({
			text: answer, 
			owner: Meteor.user().username,
			game: curr_game_id(),
			time: Date.now(),
			active: true
		});

		Games.update({active: true}, {$push: {answers: ans_id}});
		Meteor.users.update({_id: this.userId}, {$inc: {numGuesses: -1}});
		
		return ans_id;
	},

	//make question inactive
	inactive: function(q_id){
		Questions.update({_id: q_id}, {$set: {active: false}});
	},

	//mark answer wrong and inactive
	wrong_answer: function(ans_id){
		Answers.update({_id: ans_id}, {$set: {wrong: true, active:false}});
		var ans = Answers.findOne({_id: ans_id});
		Activity.insert({
			user: ans.owner,
			action: " incorrectly guessed ",
			body: ans.text,
			game: curr_game_id(),
			time: Date.now() 
		});
	},

	//mark question correct and end game, giving player a point
	correct_answer: function(ans_id){
		Answers.update({_id: ans_id}, {$set: {wrong: false, active:false}});
		var ans = Answers.findOne({_id: ans_id});
		Meteor.users.update({username: ans.owner}, {$inc: {points: 1}});

		Activity.insert({
			user: ans.owner,
			action: " correctly guessed ",
			body: ans.text,
			game: curr_game_id(),
			time: Date.now() 
		});
	},

	end_game : function(){
		Games.update({}, {$set: {lastGame: false}}, {multi: true});
		Games.update({_id: curr_game_id()}, {$set: {lastGame: true}});
		Games.update({}, {$set: {active: false}}, {multi: true});
		Questions.update({}, {$set: {active: false}}, {multi: true});
		Answers.update({}, {$set: {active: false}}, {multi: true});

	},

	give_hint : function(hint){
		Games.update({_id: curr_game_id()}, {$push: {hints: {text: hint}}});
		Meteor.users.update({}, {$inc: {numGuesses: 1}}, {multi: true});
	},

	send_message : function(message){
		Messages.insert({
			user: Meteor.users.findOne({_id: this.userId}).username,
			message: message,
			time: Date.now()
		});
	},

	//!!!!-----ADMIN FUNCTIONS--------!!!!!!

	//make a user quote master
	make_quotemaster : function(user_id){
		change_quote_master(user_id);
		Meteor.users.update({}, {$set: {points: 0}}, {multi:true});
	},
	//delete a user
	delete_user : function(user_id){
		Meteor.users.remove({_id: user_id});
	},
	//delete a user
	sub_point : function(user_id){
		Meteor.users.update({_id: user_id}, {$inc: {points: -1}});
	},
	//delete a user
	add_point : function(user_id){
		Meteor.users.update({_id: user_id}, {$inc: {points: 1}});
	},
	
});
