/* Runs lookup */
	$(function() {
	    console.log( "ready!" );
	    $('#basic-search').on('submit',function(event){
	    	event.preventDefault();
	    	$("#zip-error").addClass("hidden");
			$("#zip-search").removeClass("input-error");
			$('#overlay-content-multiple-reps').addClass('hidden');
			$('#overlay-content-1-rep').addClass('hidden');
			var lookup_zip = $("#zip-search").val().trim().substring(0, 5);
	    	var lookup_data = {
			 "zip": lookup_zip,
			 "apikey": "593843c677374434b1d1403432d034ed",
			};

			$.ajax({
				url: 'https://congress.api.sunlightfoundation.com/legislators/locate',
				type: 'GET',
				data: lookup_data,
				dataType: 'jsonp',
				jsonp:'callback',
				success: function(data, textStatus, jqXHR) {
					console.log(data);
					console.log(textStatus);
					console.log(jqXHR);

					if(data.results.length===0){
						$("#zip-error").removeClass("hidden");
						$("#zip-search").addClass("input-error")
					} else {

						$('#zip-search').blur()

						$('.overlay').css('display', 'block');
				        setTimeout(function() {
				        	$('.overlay').css('opacity', 1);
				        }, 50);

						var repList=[];
						$.each(data.results, function(index, value) {
							if (value.chamber === 'house') {
							   repList.push (value);
							}
						});

						if (repList.length===1) {
							var rep = repList [0];
							populateRep(rep);
							console.log(rep);
						} else {
							$('.multiple-reps-li:not(.hidden)').remove();
							$.each(repList, function(index, rep) {
								var repElement=$('.multiple-reps-li.hidden').clone();
								repElement.find('.multiple-reps-name').text(rep.first_name + " " +rep.last_name);
								repElement.removeClass('hidden');
								repElement.on('click', function(event){
									populateRep(rep);
								});
								$('#multiple-reps-list').append(repElement);
							});
							$('#overlay-content-multiple-reps').removeClass('hidden');


						}
							 
					}
				}
			}).done(function( data ) {
			 console.log( "Data Loaded: " + data );
			});
	    });
	});

/* When have just 1 rep */

function populateRep(rep) {
	$.each(rep_table, function(index, value) {
		if (value.bioguide_id === rep.bioguide_id) {
			$.extend(rep,value);
		}
	});
	$('#rep-name').text(rep.first_name + " " +rep.last_name);
	$('#phone-number').text(rep.phone);
	$('#stance').text(rep.disposition);
	$('#overlay-content-1-rep').removeClass('hidden');
	$('#overlay-content-multiple-reps').addClass('hidden');
	$('#ak-form input[type="radio"]').prop('name', 'response-' + rep.whipcount_id);
}


/* Controls Overlay */

	$(function() {
		$(".call-key-rep").on('click', function(event){
			var bioguide_id=$(this).data('id');
			var rep;
			$.each(rep_table, function(index, value) {
				if (value.bioguide_id === bioguide_id) {
					rep=value;
				}
			});
			$('.overlay').css('display', 'block');
			setTimeout(function() {
				$('.overlay').css('opacity', 1);
			}, 50);
			populateRep(rep);
		})


	    $("#the-x").click(function() {
	        $('.overlay').css('display', 'none');
	        setTimeout(function() {
	        $('.overlay').css('opacity', 0);
	        }, 50);

	       	$('.page-1').css('display', 'block');
	        $('.page-1').css('opacity', 1);
	        $('.page-2').css('display', 'none');
	        $('.page-2').css('opacity', 0);
	    });

	    $("#header-take-action").click(function() {
	    	$('#zip-search').focus();
	    });
	});


/* How'd it go button */

	$(function() {
		$("#how-did-it-go").click(function() {
	        $('.page-1').css('display', 'none');
	        setTimeout(function() {
	        $('.page-1').css('opacity', 0);
	        }, 50);
	        $('.page-2').css('display', 'block');
	        setTimeout(function() {
	        $('.page-2').css('opacity', 1);
	        }, 50);
	    });
	});

