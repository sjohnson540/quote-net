Template.quoteUsers.users = function() {
	return Meteor.users.find({}).fetch();
}

Template.quoteUsers.events = {
	'click button.btn-warning' : function(event){
		//make user quote master
		var user_id = $(event.target).closest("tr").attr('id');
		Meteor.call("make_quotemaster", user_id, function(err, id){
			if(err){
				console.log(err);
			}
		});
	},

	'click button.delete' : function(event){
		var user_id = $(event.target).closest("tr").attr('id');
		Meteor.call("delete_user", user_id, function(err, id){
			if(err){
				console.log(err);
			}
		});
	},

	'click button.down-one' : function(event){
		var user_id = $(event.target).closest("tr").attr('id');
		Meteor.call("sub_point", user_id, function(err, id){
			if(err){
				console.log(err);
			}
		});
	},
	'click button.up-one' : function(event){
		var user_id = $(event.target).closest("tr").attr('id');
		Meteor.call("add_point", user_id, function(err, id){
			if(err){
				console.log(err);
			}
		});
	}
}