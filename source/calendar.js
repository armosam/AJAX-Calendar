/* 
 *  
 *  @author Armen Bablanyan
 *  @version ver 0.3  Jul 30, 2015 4:00:54 PM - Aug 18 2015 1:20:00 PM
 *  
 * Special Class for Creating Calendar object and managing it.
 * It will call AJAX to get events and display on the calendar.
 * @param {Date} currentDate Current date of calendar in format new Date(Year[4], Month[1-2])
 * @param {int} id Integer ID of group ID or show ID to show events of only that group
 * @returns {Calendar} Object of Calendar
 *  
 *  Usage:
 *  
 *<link rel="stylesheet" href="css/jquery.cluetip.css" type="text/css" />
 *<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
 *<script type="text/javascript" src="admin/js/calendar.js"></script>
 *<script type="text/javascript" src="js/jquery.cluetip.min.js"></script>
 *  
  $(function(){
    
    Date.prototype.monthDays= function(){
        var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
        return d.getDate();
    };
    var calendar_month = 6; //July [0-11]
    var calendar_year = 2015;
    var id = "1"; //event group ID or show_id

    var My = new Calendar(new Date(calendar_year, calendar_month), id);
    var tmpl = _.template($.trim($("#calendar-template").html()));
    $("#calendar-template").remove();
    My.fetchData(function(data){
        My.setEvents(data);
	$("#calendar-container").html(tmpl({"events": My.getEvents(), "headers" : My.getHeader(), "month_year_string": My.getMonthYearStr(), "date": My.getCalendarDate()}));
        $('ul.grid_calendar li.active a').cluetip({ 
		height:'auto',
		sticky:true,
		dropShadow:true,
		positionBy:'mouse', 
		mouseOutClose:true,
		arrows:false,
		closePosition:'top',
		closeText:'<img src="images/btn_close_tooltip.png" />',
		fx: {             
			open:'fadeIn',
			openSpeed:'500' 
		}
	});
    });
	
    // Click on newxt
    $(document).on('click', '.next', function(e){
            e.preventDefault();
            var m =  My.getCalendarDate().getMonth();
            var y =  My.getCalendarDate().getFullYear();
                   m++;
            if ( m > 11 ){ m = 0; y++; }
            //console.log(m);console.log(y);	
            My.setCalendarDate(new Date(y, m));
                   $("#calendar-template").remove();
                   My.fetchData(function(data){
                       My.setEvents(data);
                       $("#calendar-container").html(tmpl({"events": My.getEvents(), "headers" : My.getHeader(), "month_year_string": My.getMonthYearStr(), "date": My.getCalendarDate()}));
                       $('ul.grid_calendar li.active a').cluetip({ 
                            height:'auto',
                            sticky:true,
                            dropShadow:true,
                            positionBy:'mouse', 
                            mouseOutClose:true,
                            arrows:false,
                            closePosition:'top',
                            closeText:'<img src="images/btn_close_tooltip.png" />',
                            fx: {             
                                    open:'fadeIn',
                                    openSpeed:'500' 
                            }
                        });
                   });
    });

    // Click on newxt
    $(document).on('click', '.previous', function(e){
            e.preventDefault();
            var m =  My.getCalendarDate().getMonth();
            var y =  My.getCalendarDate().getFullYear();
                   m--;
            if ( m < 0 ){ m = 11; y--; }
            //console.log(m);console.log(y);	
            My.setCalendarDate(new Date(y, m));
                   $("#calendar-template").remove();
                   My.fetchData(function(data){
                       My.setEvents(data);
                       $("#calendar-container").html(tmpl({"events": My.getEvents(), "headers" : My.getHeader(), "month_year_string": My.getMonthYearStr(), "date": My.getCalendarDate()}));
                       $('ul.grid_calendar li.active a').cluetip({ 
                            height:'auto',
                            sticky:true,
                            dropShadow:true,
                            positionBy:'mouse', 
                            mouseOutClose:true,
                            arrows:false,
                            closePosition:'top',
                            closeText:'<img src="images/btn_close_tooltip.png" />',
                            fx: {             
                                    open:'fadeIn',
                                    openSpeed:'500' 
                            }
                        });
                   });
    });
});

</script>

<script type="text/html" id="calendar-template">
  <div class="calendar-date-top">
       <ul>
           <li><a class="previous" title="Arrow" href="javascript:void(0);"><img src="images/date-left-arrow.jpg" alt="Images"></a></li>
           <li><span class="grid_calendar month"><%= month_year_string %></span></li>
           <li><a class="next" title="Arrow" href="javascript:void(0);"><img src="images/date-right-arrow.jpg" alt="Images"></a></li>
       </ul>
  </div>
  <div class="calendar-box">

  <ul class="grid_calendar">
  
  <% _.each(headers, function(header,i) { %>
  <li class="heder"><%= header %></li>
  <% }) %>
  
  <% _.each(_.range((1-date.getDay()), date.monthDays() + 1 ), function(day){ 
  
    if(day <= 0){
  %>
  <li> &nbsp; </li>
  <% }else{ %>
  
  <% if (_.has(events, day)){ %>
  <li class="active"><a href="_components/more_info_calendar_tooltip.php" rel="_components/more_info_calendar_tooltip.php?year=<%= date.getFullYear() %>&month=<%= (date.getMonth()+1) %>&day=<%= day %>&id=<%= events[day].id %>&hash=<%= date.getTime()%>" title="<%= events[day].title %>"><%= day %></a></li>
  <% }else{ %>
  <li> <%= day %> </li>
  <% } %>
  
  <% } %>
  
  <% }) %>
  </ul>
  <div class="border-bottom"></div>
  </div>
</script>

<div class="event-detailed-Calendar" id="calendar-container"></div>
 *  
 *  
 * 
 */
function Calendar(currentDate, id){

var _headers = ['S','M','T','W','T','F','S'];
var _monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
];

this.currentDate = currentDate;
this.year = currentDate.getFullYear();
this.month = currentDate.getMonth();
this.id = (id==='')?null:parseInt(id);
this.events = {};

/**
 * Public method to set calendar date
 * @param {Date} currentDate Date object  in format new Date([2015..], [0..30])
 * @returns {no return}
 */
this.setCalendarDate = function(currentDate){
    this.currentDate = currentDate;
};
/**
 * Public method to get calendar date
 * @returns {Date} Current Date of Calendar 
 */
this.getCalendarDate = function(){
    return this.currentDate;
};
/**
 * Public method to get date in string format
 * @returns {String} Current Calendar Date Title 
 */
this.getMonthYearStr = function(){
    return _monthNames[this.currentDate.getMonth()] +' '+ this.currentDate.getFullYear();
};
/**
 * Private method calls ajax and get events object from source
 * @param {Object} callback Callback function sending data from AJAX call
 */
this.fetchData = function(callback){

    $.ajax({
        method: 'POST',
        url: '_components/ajax_calendar_content.php',
        data: {m: this.currentDate.getMonth()+1, y: this.currentDate.getFullYear(), id: this.id, hash: Date.now()},
        dataType: 'json',
        success: callback,
        error: function(error){
            console.log(error);
            callback(false);
        }
    });
}; 
/**
 * Privilaged method to get events object
 * @param {Object} events List of calendar events
 */
this.setEvents = function(events){
    this.events = events;
}; 
/**
 * Privilaged method to get events object
 * @returns {Object} list of events
 */
this.getEvents = function(){
    return this.events;
}; 
/**
 * Privilaged method to set custom week day names
 * @param {Object} headers Object of custom list of week days.
 * @returns {undefined}
 */
this.setHeaders = function(headers){
    _headers = headers;
};
/**
 * Privilaged method to return calendar week names
 * Default is ['S','M','T','W','T','F','S']
 * @returns {Array} Array of week names
 */
this.getHeader = function(){
    return _headers;
};
/**
 * Privilaged method to set custom month names 
 * Default is [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
        ]
 * @param {type} monthNames Object of custom list of month names
 * @returns {undefined}
 */
this.setMonthNames = function(monthNames){
    _monthNames = monthNames;
};
    
};
