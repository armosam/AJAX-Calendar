<?php if(is_readable(__DIR__.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."cms".DIRECTORY_SEPARATOR."config".DIRECTORY_SEPARATOR."config.php")){
    include_once(__DIR__.DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."cms".DIRECTORY_SEPARATOR."config".DIRECTORY_SEPARATOR."config.php");} ?>
<?php 
$session = new sessions();

$day = filter_input(INPUT_GET, 'day', FILTER_SANITIZE_NUMBER_INT);
$year = filter_input(INPUT_GET, 'year', FILTER_SANITIZE_NUMBER_INT);
$month = filter_input(INPUT_GET, 'month', FILTER_SANITIZE_NUMBER_INT);
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

if(!$day){
  $day=date('d');
}
if(!$month){
  $day=date('m');
}
if(!$year){
  $year=date('y');
}
$date = $year.'-'.$month.'-'.$day;


$sql = "SELECT events.*, spaces.s_name as show_venue, shows.title as title, shows.show_id 
        FROM events LEFT JOIN shows on(events.e_show_id=shows.show_id)
        JOIN spaces ON spaces.s_id=shows.show_venue
        WHERE events.e_status=1 AND events.e_date=STR_TO_DATE('".$date."', '%Y-%m-%d')
        ORDER BY STR_TO_DATE(CONCAT_WS(' ', events.e_date, events.e_time), '%Y-%m-%d %l:%i %p')";

if(!empty($id)){
$sql = "SELECT events.*, spaces.s_name as show_venue, shows.title as title, shows.show_id  
    FROM events LEFT JOIN shows on(events.e_show_id=shows.show_id) 
    JOIN spaces ON spaces.s_id=shows.show_venue
WHERE events.e_status=1 AND events.e_date=STR_TO_DATE('".$date."', '%Y-%m-%d')
AND events.e_show_id='".$id."'
ORDER BY STR_TO_DATE(CONCAT_WS(' ', events.e_date, events.e_time), '%Y-%m-%d %l:%i %p')";

}

if($result=$session->mysqli->query($sql)){
    while($row = $result->fetch_object()){
    $events[]=$row;
    }
}

?>
<div class="show_tooltip">
	<ul>
	<?php 
	if(count($events)>0){

	foreach($events as $event){
	
	?>
            <li>
                <h3><a href="<?php echo routing::short('show.php?id='.$event->show_id); ?>"><?=$event->title?></a></h3>
            <h4 class="date_time"><?=$event->e_time?>, <?=$event->show_venue?></h4>


            <br style="clear:both" />
            <?php if (!empty($event->e_ticket_link)): ?>
            <a href="<?=$event->e_ticket_link?>" ><strong>Get Tickets</strong></a>
            <?php endif; ?>
    <?php
	preg_match('/performance_id=(.*?)$/', $event->e_ticket_link, $ticket_id);

       $sql_check_tickets = "SELECT * FROM `ticketing_system` WHERE `ticket_id`='".$session->mysqli->real_escape_string($ticket_id[1])."' AND `ticket_date`='".date("Y-m-d H:i:00", strtotime($event->e_date." ".$event->e_time))."' ";
       $result_tickets=$session->mysqli->query($sql_check_tickets);
	if($result_tickets && $result_tickets->num_rows>0){
            $ticket_row = $result_tickets->fetch_object();
            $ticket_status = 'Call for tickets.';
            if ($ticket_row->available>=200){
                $ticket_status = 'Exccellent';
                echo "<img src='images/tickets/empty.jpg' style='float:right; margin-top:6px;'/>";
            }elseif($ticket_row->available<200 && $ticket_row->available>=100){
                $ticket_status = 'Good';
                echo "<img src='images/tickets/onethird.jpg' style='float:right; margin-top:6px;'/>";
            }elseif($ticket_row->available<100 && $ticket_row->available>=10){
                $ticket_status = 'Limited availability';
                echo "<img src='images/tickets/twothird.jpg' style='float:right; margin-top:6px;'/>";
            }else{
                echo "<img src='images/tickets/full.jpg' style='float:right; margin-top:6px;' />";
            }
            //echo $ticket_status;
        }
    ?>	
		</li>	
				
		<?php }
                
            }else{ ?>
		<h3>There is no show planed for this date</h3>
		<?php } ?>
	</ul>
</div>

