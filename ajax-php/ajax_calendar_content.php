<?php
/* 
 *  You can implement here your database connection and fetch event's list.
 *  @author Armen Bablanyan
 *  @version ver 0.1  Jun 16, 2015 3:03:24 PM
 *  
 */
$month = filter_input(INPUT_POST, 'm', FILTER_SANITIZE_NUMBER_INT);
$year = filter_input(INPUT_POST, 'y', FILTER_SANITIZE_NUMBER_INT);
$id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);

$events = array();
/*
$where_shows = '';
if (!empty($id)) { $where_shows = " AND events.e_show_id = ".$id; }

$sql = "SELECT events.e_id, DAY(events.e_date) as `day`, events.e_date FROM `events` WHERE YEAR(e_date) =".$year." AND MONTH(e_date)=".$month." AND DATE(e_date) >= DATE(NOW()) ".$where_shows;

$result=$session->mysqli->query($sql);
if($result && $result->num_rows>0){
    while($row = $result->fetch_object()){ 
        $events[$row->day] = array('id'=>$id, 'title'=>date("F j, Y", strtotime($row->e_date)));
    }
}

*/

$events = array(23=>array(id=>$id, title=>'Test Event 1'), 25=>array(id=>$id, title=>'Test Event 2'));

echo json_encode($events);
