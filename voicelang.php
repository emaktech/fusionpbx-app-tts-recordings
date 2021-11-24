<?php

$region="canadacentral";
$getTokenUrl="https://".$region.".api.cognitive.microsoft.com/sts/v1.0/issueToken";
$getVoicesApiUrl="https://".$region.".tts.speech.microsoft.com/cognitiveservices/voices/list";

   //use key 'http' even if you send the request to https://...
    $options = array(
        'http' => array(
            'header'  => "Ocp-Apim-Subscription-Key: 3751687d3f494502a2b7af3f62f675dc\r\n" .
            "content-length: 0\r\n",
            'method'  => 'POST',
        ),
    );
    $context  = stream_context_create($options);

//get the Access Token
    $access_token = file_get_contents($getTokenUrl, false, $context);

   // echo $access_token;

//use key 'http' even if you send the request to https://...
    $options = array(
        'http' => array(
            'header'  => "Authorization: "."Bearer ".$access_token."\r\n" .
                        "content-length: 0\r\n",
            'method'  => 'GET',
        ),
    );
    $context  = stream_context_create($options);

//get the Voices list
    $voices_list = file_get_contents($getVoicesApiUrl, false, $context);
    echo '<pre>';
    //print_r($voices_list);
   $voice_list=(json_decode($voices_list,true));
   $data=array();
foreach($voice_list as $key => $list)
{
    $data[]= $list['LocaleName'];
}

print_r(array_unique($data));


