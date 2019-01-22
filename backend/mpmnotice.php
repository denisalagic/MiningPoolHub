<?php
require("dbconnect.php"); 
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
  

if (isset($_GET['notice'])) {
$url = 'https://miningpoolhub.com/';
$content = file_get_contents($url);
$first_step = explode( '<h4 class="notice">' , $content );
$second_step = explode("</h4>" , $first_step[1] );
$third_step = explode("<br>",  $second_step[0] );

$data = str_replace("&nbsp;", "", $third_step);
$data1 = str_replace("';;'", "", $data);
echo json_encode($data);  
}

if (isset($_GET['get_currency'])) {
$result = $mysqli->query("SELECT * from currency");
$outp = array();
$outp = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode($outp);
}

if (isset($_GET['set_currency'])) {

$string = file_get_contents("http://openexchangerates.org/api/latest.json?app_id=9e69e776b7e34bd089eb2893e605032a");
$json_a = json_decode($string, true);

foreach ($json_a[rates] as $key => $val) {
		$stmt=$mysqli->prepare("UPDATE currency SET c_usdtocurr = ? WHERE c_name_short = ?");
		$stmt->bind_param('ss', $val,$key);
		$stmt->execute();
		$stmt->close();
}
}



?>