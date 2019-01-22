<?php
  error_reporting(E_ALL);
  ini_set('display_errors', 1); 



  $coins =  array('adzcoin', 'auroracoin-qubit', 'bitcoin', 'bitcoin-cash', 'bitcoin-gold', 'bitcoin-private', 'dash', 'digibyte-groestl', 'digibyte-qubit', 'digibyte-skein', 'electroneum', 'ethereum', 'ethereum-classic',    'ethersocial','expanse', 'feathercoin', 'gamecredits', 'globalboosty', 'groestlcoin', 'litecoin', 'maxcoin', 'monacoin', 'monero', 'musicoin', 'myriadcoin-groestl', 'myriadcoin-skein', 'myriadcoin-yescrypt', 'sexcoin', 'siacoin', 'startcoin', 'verge-scrypt', 'vertcoin', 'zcash', 'zclassic', 'zcoin', 'zencash');


if (isset($_GET['data'])) {
	$array = array();
    $array2 = array();
	$api=$_GET['api'];

	$currenttime=strtotime("now");
	$maxtime=$currenttime-64800;
	for ($a = 0; $a < count($coins); $a++) {
		$json_string1 = 'http://'.$coins[$a].'.miningpoolhub.com/index.php?page=api&action=getusertransactions&api_key='.$api;
		$jsondata1 = file_get_contents($json_string1);
		$obj1 = json_decode($jsondata1);
		$mydata = $obj1->getusertransactions;
		$mydata1= $mydata->data;
		$mydata2= $mydata1->transactions;
	    if ($mydata2) {
            $initialts=strtotime($mydata2[0]->timestamp);
            $x=count($mydata2)-1;
            $lastts=strtotime($mydata2[$x]->timestamp);
            $time=$initialts-$lastts;
            $timehr=$time/60/60;
            $realtime=24/$timehr;

            $total=0;
            for ($i = 0; $i < count($mydata2); $i++) {
            	$height=$mydata2[$i]->height;
                $type1=$mydata2[$i]->type;
                if (($type1 == "Credit" || $type1 == "Credit_AE") && $initialts>=$maxtime && $height) {
                    $total=$total+$mydata2[$i]->amount;
                }
            }
            $tot=$total*$realtime;
            $newdata =  array (
                'coin' => $coins[$a],
                'value' => $tot
            );
        	if ($tot > 0) {
            array_push($array2, $newdata);
            }
        }
    }
    echo json_encode($array2);
}





?>