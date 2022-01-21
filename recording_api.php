<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
require_once "root.php";
require_once "resources/require.php";
$db_host = '127.0.0.1';
$db_port = '5432';
$db_name = 'fusionpbx';
$db_username = 'fusionpbx';
$db_password = 'RAEdvxiXsmTJ23ksS4IF1pE0x7Y';

//database connection
$conn_string = "host=127.0.0.1 port=5432 dbname=fusionpbx user=fusionpbx password=RAEdvxiXsmTJ23ksS4IF1pE0x7Y"; // change the db credentials here
$conn = pg_connect($conn_string) or die("Could not connect");
echo pg_last_error($conn);

//insert data to database
$recording_uuid = uuid();
//echo $recording_uuid;
$data = file_get_contents("php://input");

//$data="{\"ssml\":\"<speak  xmlns=\\\"http:\/\/www.w3.org\/2001\/10\/synthesis\\\" xmlns:mstts=\\\"http:\/\/www.w3.org\/2001\/mstts\\\" xmlns:emo=\\\"http:\/\/www.w3.org\/2009\/10\/emotionml\\\" version=\\\"1.0\\\" xml:lang=\\\"en-US\\\"><voice  data-content=\\\"JennyMultilingualNeural\\\" name=\\\"en-US-ChristopherNeural\\\" gender=\\\"Male\\\"> i am aboy<\/voice><\/speak>\",\"Voicetext\":\"<div id=\\\"voicessml\\\"><voice class=\\\"voiceclass\\\" data-content=\\\"[JennyMultilingualNeural]\\\" name=\\\"en-US-ChristopherNeural\\\" gender=\\\"Male\\\"><span data-content=\\\"\\\" class=\\\"text-node\\\"><prosody class=\\\"\\\" rate=\\\"\\\"> <break time=\\\"\\\"><\/break>i am aboy<br><\/prosody><\/span><\/voice><\/div>\",\"Wave\":\"blob:http:\/\/localhost:3000\/b02da766-f57b-407b-8f4c-2f05e1e76a08\",\"FileName\":\"datafile\"}";
//$sqll = "Insert into v_tts_test (tts_recording_uuid,recording_data)  values('$recording_uuid','$data')";
//$resultt = pg_query($conn, $sqll);
$arr=json_decode($data);
if(!empty($arr))
{
  $recording_id=$arr->tts_recording_uuid;
  $ssml=$arr->ssml;
  $text=$arr->Voicetext;
  $wave=$arr->Wave;
  $date_created = time();
	$date_updated = $date_created;
  $rate=$arr->Rate;
  $break=$arr->Break;
  $gender=$arr->Gender;
  $LocalName=$arr->LocalName;
  $LocaleName=$arr->LocaleName;
  $DisplayName=$arr->DisplayName;
  $speakingstyle=$arr->speakingstyle;
  if(empty($DisplayName))
  {
    $DisplayName='Jenny Multilingual';
  }
  if(empty($LocalName))
  {
    $LocalName='Jenny Multilingual';
  }

  if(empty($recording_id))
  {
    $fileName=$arr->FileName.'.wav';
    $sqll = "Insert into v_tts_react (tts_recording_uuid,recording_text,recording_ssml,recording_wave,recording_filename,recording_rate,recording_break,display_name,gender,local_name,locale_name,speakingstyle)  values('$recording_uuid','$text','$ssml','$wave','$fileName','$rate','$break','$DisplayName','$gender','$LocalName','$LocaleName','$speakingstyle')";
    $resultt = pg_query($conn, $sqll);
    if(!$resultt){
      echo pg_last_error($conn);
    } else {
      echo "Success";
    }
  }
  else
  {
    $fileName=$arr->FileName;
    $sqll = "UPDATE v_tts_react SET recording_text = '$text', recording_ssml = '$ssml', recording_wave = '$wave', recording_filename = '$fileName', recording_rate = '$rate',recording_break = '$break', display_name = '$DisplayName' , gender = '$gender', local_name = '$LocalName', locale_name = '$LocaleName',speakingstyle = '$speakingstyle' WHERE tts_recording_uuid = '$recording_id'";
    $resultt = pg_query($conn, $sqll);
    if(!$resultt){
      echo pg_last_error($conn);
    } else {
      echo "update";
    }

  }
}

//show list of all recordings
$query = "select * from v_tts_react"; 
$rs = pg_query($conn, $query) or die("Cannot execute query: $query\n");
/*while ($row = pg_fetch_row($rs)) {
  echo "$row[0] $row[1] $row[2]\n";
}*/
$row = pg_fetch_all($rs);
//print_r($row);
$val=json_encode($row);
//$data = json_decode($val, true, JSON_UNESCAPED_SLASHES);
print_r($val);
pg_close($conn); 
?>