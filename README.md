# AJAX-Calendar
AJAX-Calendar is JavaScript monthly calendar with events that getting by AJAX call.

Usage:

Just Add fallowing code to your page.

```
<link rel="stylesheet" href="add-on/jquery.cluetip.css" type="text/css" />
<link rel="stylesheet" href="style.css" type="text/css" />

<div class="container">
<div class="event-detailed-Calendar" id="calendar-container"></div>
</div>
```
```
 <script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
 <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
 <script type="text/javascript" src="source/calendar.js"></script>
 <script type="text/javascript" src="add-on/jquery.cluetip.min.js"></script>
 
 <script>
   
  $(function(){
    
    Date.prototype.monthDays= function(){
        var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
        return d.getDate();
    };
    var calendar_month = 6; //July [0-11]
    var calendar_year = 2015;

    var My = new Calendar(new Date(calendar_year, calendar_month));
    var tmpl = _.template($.trim($("#calendar-template").html()));
    $("#calendar-template").remove();
    My.set
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
  <li class="active"><a href="_components/more_info_calendar_tooltip.php" rel="_components/more_info_calendar_tooltip.php?year=<%= date.getFullYear() %>&month=<%= (date.getMonth()+1) %>&day=<%= day %>&s=1&hash=<%= date.getTime()%>" title="<%= events[day].title %>"><%= day %></a></li>
  <% }else{ %>
  <li> <%= day %> </li>
  <% } %>
  
  <% } %>
  
  <% }) %>
  </ul>
  <div class="border-bottom"></div>
  </div>
</script>
```
