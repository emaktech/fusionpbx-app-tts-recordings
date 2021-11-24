<?php
/*
	FusionPBX
	Version: MPL 1.1

	The contents of this file are subject to the Mozilla Public License Version
	1.1 (the "License"); you may not use this file except in compliance with
	the License. You may obtain a copy of the License at
	http://www.mozilla.org/MPL/

	Software distributed under the License is distributed on an "AS IS" basis,
	WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
	for the specific language governing rights and limitations under the
	License.

	The Original Code is FusionPBX

	The Initial Developer of the Original Code is
	Mark J Crane <markjcrane@fusionpbx.com>
	Portions created by the Initial Developer are Copyright (C) 2008-2020
	the Initial Developer. All Rights Reserved.

	Contributor(s):
	Amer Tahir <amertahir@gmail.com>
*/

//includes
	require_once "root.php";
	require_once "resources/require.php";
	require_once "resources/check_auth.php";

//check permissions
	if (permission_exists('tts_recording_add') || permission_exists('tts_recording_edit') || permission_exists('tts_recording_delete')) {
		//access granted
	}
	else {
		echo "access denied";
		exit;
	}

//add multi-lingual support
	$language = new text;
	$text = $language->get();

//get speech service
	$speech_service = new azure_speech_service;
	$speech_service_token = $speech_service->getToken();

//action add or update
	$domain_uuid = $_SESSION['domain_uuid'];
	if (is_uuid($_REQUEST["id"])) {
		$recording_uuid = $_REQUEST["id"];
		$action = "update";
		if (!permission_exists('tts_recording_edit') || !permission_exists('recording_edit')) {
			//redirect
				header('Location: recordings.php');
				exit;
		}
	}
	else {
		$action = "add";
		if (!permission_exists('tts_recording_add') || !permission_exists('recording_add')) {
			//redirect
				header('Location: recordings.php');
				exit;
		}
	}

//get the form value and set to php variables
	if (count($_POST) > 0) {
		$recording_name = $_POST["recording_name"];
		$recording_voice = $_POST["recording_voice"];
		$is_text_ssml = $_POST["is_text_ssml"];
		$recording_text = $_POST["recording_text"];
		$pitch = $_POST["pitch"];
		$speaking_rate = $_POST["speaking_rate"];
		$generated_ssml = $_POST["generated_ssml"];
		
		//sanitize recording name
		$recording_name = str_replace("'", '', $recording_name);
	}

if (count($_POST) > 0 && strlen($_POST["persistformvar"]) == 0) {
	//get the recording uuid
		if ($action == "add") {
			$recording_uuid = uuid();
		}
		else {
			$recording_uuid = $_POST["recording_uuid"];
		}

	//delete the recording
		if (permission_exists('tts_recording_delete') && permission_exists('recording_delete')) {
			if ($_POST['action'] == 'delete' && is_uuid($recording_uuid)) {
				//prepare
					$array[0]['checked'] = 'true';
					$array[0]['uuid'] = $recording_uuid;
				//delete
					$obj = new tts_recordings;
					$obj->delete($array);
				//redirect
					header('Location: recordings.php');
					exit;
			}
		}

	//validate the token
		$token = new token;
		if (!$token->validate($_SERVER['PHP_SELF'])) {
			message::add($text['message-invalid_token'],'negative');
			header('Location: recordings.php');
			exit;
		}

	//check for all required data
		$msg = '';
		if (strlen($recording_name) == 0) { $msg .= $text['label-edit-recording_name']."<br>\n"; }
		if (strlen($recording_voice) == 0) { $msg .= $text['label-edit-recording_voice']."<br>\n"; }
		if (strlen($is_text_ssml) == 0) { $msg .= $text['label-edit-is_text_ssml']."<br>\n"; }
		if (strlen($recording_text) == 0) {
			$msg .= $text['label-edit-recording_text']."<br>\n";
		}
		if (strlen($pitch) == 0) {
			$pitch = "1.00";
		}
		if (strlen($speaking_rate) == 0) {
			$speaking_rate = "1.00";
		}
		if (strlen($msg) > 0 && strlen($_POST["persistformvar"]) == 0) {
			require_once "resources/header.php";
			require_once "resources/persist_form_var.php";
			echo "<div align='center'>\n";
			echo "<table><tr><td>\n";
			echo $msg."<br />";
			echo "</td></tr></table>\n";
			persistformvar($_POST);
			echo "</div>\n";
			require_once "resources/footer.php";
			return;
		}

	//add or update the database
		if ($_POST["persistformvar"] != "true") {
			//generate SSML from text if format is plain text
				if ($is_text_ssml != "true") {
					$recording_ssml = '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">'. $recording_text . '</speak>';
					
				}
				else {
					$recording_ssml = $recording_text;
				}

				
			//(re)generate tts audio
				if ($action == "add") {
					$date_created = time();
					$date_updated = $date_created;
					$recording_filename = "tts_".$date_created.".wav";
				}
				else {
					$sql = "select * from v_tts_recordings ";
					$sql .= "where domain_uuid = :domain_uuid ";
					$sql .= "and tts_recording_uuid = :recording_uuid ";
					$parameters['domain_uuid'] = $domain_uuid;
					$parameters['recording_uuid'] = $recording_uuid;
					$database = new database;
					$row = $database->select($sql, $parameters, 'row');
					if (is_array($row) && @sizeof($row) != 0) {
						$recording_filename = $row["recording_filename"];
						$date_created = $row["date_created"];
						$date_updated = time();
					}
					unset($sql, $parameters, $row);
				}
				if (!isset($recording_filename) || empty($recording_filename)) {
					//redirect
						message::add($text['message-invalid_recording_filename'],'negative');
						header('Location: recordings.php');
						exit;
				}
				$audio_content = $speech_service->synthesizeSsml($recording_ssml, $speech_service_token);
				if (!isset($audio_content) || empty($audio_content)) {
					//redirect
						message::add($text['message-unable_to_generate_audio'],'negative');
						header("Location: recording_edit.php?id=$recording_uuid");
						exit;
				}
				file_put_contents($_SESSION['switch']['recordings']['dir'].'/'.$_SESSION['domain_name'].'/'.$recording_filename, $audio_content);
				if ($_SESSION['recordings']['storage_type']['text'] == 'base64') {
					$recording_base64 = base64_encode($audio_content);
				}

			//build array
				$array['tts_recordings'][0]['domain_uuid'] = $domain_uuid;
				$array['tts_recordings'][0]['tts_recording_uuid'] = $recording_uuid;
				$array['tts_recordings'][0]['recording_name'] = $recording_name;
				$array['tts_recordings'][0]['recording_voice'] = $recording_voice;
				$array['tts_recordings'][0]['is_text_ssml'] = $is_text_ssml;
				$array['tts_recordings'][0]['recording_text'] = $recording_text;
				$array['tts_recordings'][0]['pitch'] = $pitch;
				$array['tts_recordings'][0]['speaking_rate'] = $speaking_rate;
				$array['tts_recordings'][0]['recording_filename'] = $recording_filename;
				$array['tts_recordings'][0]['date_created'] = $date_created;
				$array['tts_recordings'][0]['date_updated'] = $date_updated;
				$array['tts_recordings'][0]['recording_ssml'] = $recording_ssml;

			//assign temp permission
				$p = new permissions;
				$p->add('tts_recording_add', 'temp');
				$p->add('tts_recording_edit', 'temp');

			//execute update
				$database = new database;
				$database->app_name = 'tts_recordings';
				$database->app_uuid = '7f872095-2c0c-4115-acdd-9992b9edf7de';
				$database->save($array);
				unset($array);


			//update temp permission
				$p->delete('tts_recording_add', 'temp');
				$p->delete('tts_recording_edit', 'temp');
				$p->add('recordings_add', 'temp');
				$p->add('recordings_edit', 'temp');

			//update recordings
				$array['recordings'][0]['domain_uuid'] = $domain_uuid;
				$array['recordings'][0]['recording_uuid'] = $recording_uuid;
				$array['recordings'][0]['recording_filename'] = $recording_filename;
				$array['recordings'][0]['recording_name'] = $recording_name;
				$array['recordings'][0]['recording_description'] = $recording_name;
				if ($_SESSION['recordings']['storage_type']['text'] == 'base64') {
					$array['recordings'][0]['recording_base64'] = $recording_base64;
				}

			//execute update
				$database = new database;
				$database->app_name = 'recordings';
				$database->app_uuid = '83913217-c7a2-9e90-925d-a866eb40b60e';
				$database->save($array);
				unset($array);

			//revoke temp permission
				$p->delete('recordings_add', 'temp');
				$p->delete('recordings_edit', 'temp');

			//set message
				if ($action == "add") {
					message::add($text['message-add']);
				}
				else {
					message::add($text['message-update']);
				}

			//redirect
				header("Location: recordings.php");
				exit;
		}
}

//pre-populate the form
	if (count($_GET)>0 && $_POST["persistformvar"] != "true") {
		$recording_uuid = $_GET["id"];
		$sql = "select * from v_tts_recordings ";
		$sql .= "where domain_uuid = :domain_uuid ";
		$sql .= "and tts_recording_uuid = :recording_uuid ";
		$parameters['domain_uuid'] = $domain_uuid;
		$parameters['recording_uuid'] = $recording_uuid;
		$database = new database;
		$row = $database->select($sql, $parameters, 'row');
		if (is_array($row) && @sizeof($row) != 0) {
			$recording_name = $row["recording_name"];
			$recording_voice = $row["recording_voice"];
			$is_text_ssml = $row["is_text_ssml"];
			$recording_text = $row["recording_text"];
			$pitch = $row["pitch"];
			$speaking_rate = $row["speaking_rate"];
		}
		unset($sql, $parameters, $row);
	}

//create token
	$object = new token;
	$token = $object->create($_SERVER['PHP_SELF']);

//show the header
	$document['title'] = $text['title-tts-recording'];
	require_once "resources/header.php";
?>
<link href="resources/css/studio.css" rel="stylesheet">
<?php

//show the content
	echo "<form name='frm' id='frm' method='post'>\n";

	echo "<div class='action_bar' id='action_bar'>\n";
	echo "	<div class='heading'><b>".$text['title-tts-recording']."</b></div>\n";
	echo "	<div class='actions'>\n";
	echo button::create(['type'=>'button','label'=>$text['button-back'],'icon'=>$_SESSION['theme']['button_icon_back'],'id'=>'btn_back','style'=>'margin-right: 15px;','link'=>'recordings.php']);
	if ($action != "add" && permission_exists('tts_recording_delete')) {
		echo button::create(['type'=>'button','label'=>$text['button-delete'],'icon'=>$_SESSION['theme']['button_icon_delete'],'name'=>'btn_delete','style'=>'margin-right: 15px;','onclick'=>"modal_open('modal-delete','btn_delete');"]);
	}
	echo button::create(['type'=>'submit','label'=>$text['button-save'],'icon'=>$_SESSION['theme']['button_icon_save'],'id'=>'btn_save']);
	echo "	</div>\n";
	echo "	<div style='clear: both;'></div>\n";
	echo "</div>\n";

	if ($action != "add" && permission_exists('tts_recording_delete')) {
		echo modal::create(['id'=>'modal-delete','type'=>'delete','actions'=>button::create(['type'=>'submit','label'=>$text['button-continue'],'icon'=>'check','id'=>'btn_delete','style'=>'float: right; margin-left: 15px;','collapse'=>'never','name'=>'action','value'=>'delete','onclick'=>"modal_close();"])]);
	}

?>

<div class="container">
	<div class="files-container">
	These are the files
	</div>
	<div class="editor-container">
	This is the editor container
	</div>
	<div class="settings-container">
	These are the settings-container
	</div>
</div>





<?php




	echo "<table width='100%' border='0' cellpadding='0' cellspacing='0'>\n";

	echo "<tr>\n";
	echo "<td width='10%' class='vncellreq' valign='top' align='left' nowrap>\n";
	echo "    ".$text['label-recording_name']."\n";
	echo "</td>\n";
	echo "<td width='90%' class='vtable' align='left'>\n";
	echo "    <input class='formfld' type='text' name='recording_name' maxlength='255' value=\"".escape($recording_name)."\">\n";
	echo "<br />\n";
	echo $text['description-recording_name']."\n";
	echo "</td>\n";
	echo "</tr>\n";

	echo "<tr>\n";
	echo "<td class='vncellreq' valign='top' align='left' nowrap='nowrap'>\n";
	echo "	".$text['label-recording_voice']."\n";
	echo "</td>\n";
	echo "<td class='vtable' align='left'>\n";
	echo "	<select class='formfld' name='recording_voice' id='recording_voice'>\n";
	$voices = $speech_service->getVoicesList($speech_service_token);
	if (is_array($voices) && sizeof($voices) != 0) {
		$default_voice = $_SESSION['tts_recordings']['default_voice']['text'];
		if (!isset($recording_voice) || empty($recording_voice)) {
			$recording_voice = $default_voice;
		}
		print_r($voices);
		foreach ($voices as $voice) {
			$selected = $recording_voice == $voice['ShortName'] ? "selected='selected'" : null;
			if ($voice["VoiceType"] == "Neural" && in_array($voice["Locale"], ['en-US','en-CA', 'fr-CA', 'fr-FR'] ) ) {
				
				echo "		<option value='".urlencode($voice["ShortName"])."' ".$selected.">".escape($voice['Locale'])." ".escape($voice['DisplayName'])." (".escape($voice['Gender']).")"."</option>\n";
			}
		}
	}
	echo "	</select>\n";
	echo "<br />\n";
	echo $text['description-recording_voice']."\n";
	echo "\n";
	echo "</td>\n";
	echo "</tr>\n";

	if (permission_exists('tts_recording_ssml')) {
	echo "<tr>\n";
	}
	else {
	echo "<tr style='display: none;'>";
	}
	echo "<td class='vncellreq' valign='top' align='left' nowrap='nowrap'>\n";
	echo "	".$text['label-is_text_ssml']."\n";
	echo "</td>\n";
	echo "<td class='vtable' align='left'>\n";
	echo "	<select class='formfld' name='is_text_ssml' id='is_text_ssml'>\n";
	echo "		<option value='true' ".(isset($is_text_ssml) && $is_text_ssml == "true" ? "selected='selected'" : null).">Yes</option>\n";
	echo "		<option value='false' ".(!isset($is_text_ssml) || $is_text_ssml != "true" ? "selected='selected'" : null).">No</option>\n";
	echo "	</select>\n";
	echo "<br />\n";
	echo $text['description-is_text_ssml']."\n";
	echo "\n";
	echo "</td>\n";
	echo "</tr>\n";

	echo "<tr>\n";
	echo "<td class='vncellreq' valign='top' align='left' nowrap>\n";
	echo "	".$text['label-recording_text']."\n";
	echo "</td>\n";
	echo "<td class='vtable' align='left'>\n";
	echo "	<textarea type='text' id='recording_text' name='recording_text' class='formfld' onmouseup='getSelectedText();'>".$recording_text."</textarea>\n";
	echo "<br />\n";
	echo "	".$text['description-recording_text']."\n";
	echo "</td>\n";
	echo "</tr>\n";


	echo "<tr>\n";
	echo "<td class='vncellreq' valign='top' align='left' nowrap='nowrap'>\n";
	echo "	".$text['label-recording_pronunciation']."\n";
	echo "</td>\n";
	echo "<td class='vtable' align='left'>\n";
	echo "	<select class='formfld' name='recording_pronunciation' id='recording_pronunciation'>\n";
	echo "		<option value='' >Default</option>\n";
	echo "		<option value='address' >Address</option>\n";
	echo "		<option value='cardinal' >Cardinal, Number</option>\n";
	echo "		<option value='characters' >Characters, Spell-out</option>\n";
	echo "		<option value='date' >Date</option>\n";
		
	echo "	</select>\n";
	echo "<br />\n";
	echo $text['description-recording_voice']."\n";
	echo "\n";
	echo "</td>\n";
	echo "</tr>\n";

	echo "<tr>\n";
	echo "<td class='vncell' valign='top' align='left' nowrap>\n";
	echo "    ".$text['label-pitch']."\n";
	echo "</td>\n";
	echo "<td class='vtable' align='left'>\n";
	$pitch_disp_val = isset($pitch) && !empty($pitch) && is_numeric($pitch) ? $pitch : "1.00";
	echo "	<input class='slider' type='range' min='0.00' max='2.00' step='0.10' value='".escape($pitch_disp_val)."' id='pitch' name='pitch'>\n";
	echo "	<br /><div id='pitch_desc' >".$text['description-pitch']." (current: ".escape($pitch_disp_val).")</div>\n";
	echo "</td>\n";
	echo "</tr>\n";

	echo "<tr>\n";
	echo "<td class='vncell' valign='top' align='left' nowrap>\n";
	echo "	".$text['label-speaking_rate']."\n";
	echo "</td>\n";
	echo "<td class='vtable' align='left'>\n";
	$speaking_rate_disp_val = isset($speaking_rate) && !empty($speaking_rate) && is_numeric($speaking_rate) ? $speaking_rate : "1.00";
	echo "	<input class='slider' type='range' min='0.00' max='3.00' step='0.10' value='".escape($speaking_rate_disp_val)."' id='speaking_rate' name='speaking_rate'>\n";
	echo "	<br /><div id='speaking_rate_desc' >".$text['description-speaking_rate']." (current: ".escape($speaking_rate_disp_val).")</div>\n";
	echo "</td>\n";
	echo "</tr>\n";

	echo "<tr>\n";
	echo "<td class='vncell' valign='top' align='left' nowrap></td>\n";
	echo "<td class='vtable' align='left'>\n";
	echo button::create(['type'=>'button','title'=>$text['label-play'].' / '.$text['label-pause'],'icon'=>$_SESSION['theme']['button_icon_play'],'id'=>'button_tts_play_pause','onclick'=>"tts_play_pause()"]);
	echo button::create(['type'=>'button','title'=>$text['label-stop'],'icon'=>$_SESSION['theme']['button_icon_stop'],'id'=>'button_tts_stop','onclick'=>"tts_stop()"]);
	echo "</td>\n";
	echo "</tr>\n";

	echo "<tr id='block-generated-ssml' style='display: none'>\n";
	echo "<td class='vncell' valign='top' align='left' nowrap>\n";
	echo "	".$text['label-generated_ssml']."\n";
	echo "</td>\n";
	echo "<td class='vtable' align='left'>\n";
	echo "	<textarea type='text' id='generated_ssml' name='generated_ssml' class='formfld' style='width: 65%; height: 175px;'></textarea>\n";
	echo "<br />\n";
	echo "	".$text['description-generated_ssml']."\n";
	echo "</td>\n";
	echo "</tr>\n";

	echo "<tr id=\"block-highlight\" style=\"display: none\">\n";
	echo "<td class='vncell' valign='top' align='left' nowrap>\n";
	echo "	".$text['label-highlight']."\n";
	echo "</td>\n";
	echo "<td class='vtable' align='left'>\n";
	echo "	<div id=\"highlightDiv\" style=\"display: inline-block;width: 65%;\">\n";
	echo "</td>\n";
	echo "</tr>\n";

	echo "</table>";
	echo "<br /><br />";

	echo "<input type='hidden' name='recording_uuid' value='".escape($recording_uuid)."'>\n";
	echo "<input type='hidden' name='".$token['name']."' value='".$token['hash']."'>\n";

	echo "</form>\n";
?>
<!-- Speech SDK reference sdk. -->
<script src="js/microsoft.cognitiveservices.speech.sdk.bundle-min.js"></script>

<!-- Speech SDK Authorization token -->
<script>
var authorizationEndpoint = "token.php";

function RequestAuthorizationToken() {
	if (authorizationEndpoint) {
		var a = new XMLHttpRequest();
		a.open("GET", authorizationEndpoint);
		a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		a.send("");
		a.onload = function() {
			var token = JSON.parse(atob(this.responseText.split(".")[1]));
			region = token.region;
			authorizationToken = this.responseText;
			console.log("Got an authorization token: " + token);
		}
	}
}
</script>

<!-- Speech SDK USAGE -->
<script>
// On document load resolve the Speech SDK dependency
function Initialize(onComplete) {
	if (!!window.SpeechSDK) {
		onComplete(window.SpeechSDK);
	}
}
</script>

<!-- Browser Hooks -->
<script>
// status fields and start button in UI
var highlightDiv;
var playButton, stopButton;
var blockGeneratedSsml, blockHighlight, generatedSsml;

// subscription key and region for speech services.
var authorizationToken;
var isSsml;
var pitch;
var pitch_val;
var speakingRate;
var speaking_rate_val;
var SpeechSDK;
var recordingText;
var synthesisSsml;
var synthesizer;
var player;
var playerState = 'stopped';
var region;
var voiceOptions;
var wordBoundaryList = [];

document.addEventListener("DOMContentLoaded", function () {
	playButton = document.getElementById("button_tts_play_pause");
	stopButton = document.getElementById("button_tts_stop");
	stopButton.disabled = true;
	stopButton.style.display = 'none';
	voiceOptions = document.getElementById("recording_voice");
	isSsml = document.getElementById("is_text_ssml");
	blockGeneratedSsml = document.getElementById("block-generated-ssml");
	generatedSsml = document.getElementById("generated_ssml");
	blockHighlight = document.getElementById("block-highlight");
	highlightDiv = document.getElementById("highlightDiv");
	recordingText = document.getElementById("recording_text");
	synthesisSsml = '';
	pitch = document.getElementById("pitch");
	pitchDesc = document.getElementById("pitch_desc");
	speakingRate = document.getElementById("speaking_rate");
	speakingRateDesc = document.getElementById("speaking_rate_desc");

	pitch.oninput = function() {
<?php
echo "		pitchDesc.innerHTML = '".$text['description-pitch']." (current: ' + this.value + ')';\n";
?>
	}

	speakingRate.oninput = function() {
<?php
echo "		speakingRateDesc.innerHTML = '".$text['description-speaking_rate']." (current: ' + this.value + ')';\n";
?>
	}

	setInterval(function () {
		if (player !== undefined) {
			const currentTime = player.currentTime;
			var wordBoundary;
			for (const e of wordBoundaryList) {
				if (currentTime * 1000 > e.audioOffset / 10000) {
					wordBoundary = e;
				} else {
					break;
				}
			}
			if (wordBoundary !== undefined) {
<?php
echo "				highlightDiv.innerHTML = synthesisSsml.substr(0, wordBoundary.textOffset) +";
echo "						\"<span style='background-color: ".$_SESSION['theme']['message_alert_background_color']['text']."; color: ".$_SESSION['theme']['message_alert_color']['text'].";'>\" + wordBoundary.text + \"</span>\" +";
echo "						synthesisSsml.substr(wordBoundary.textOffset + wordBoundary.wordLength);";
?>
			} else {
				highlightDiv.innerHTML = synthesisSsml;
			}
		}
	}, 50);

	Initialize(function (speechSdk) {
		SpeechSDK = speechSdk;
		playButton.disabled = false;
		stopButton.disabled = true;
		stopButton.style.display = 'none';

		// in case we have a function for getting an authorization token, call it.
		if (typeof RequestAuthorizationToken === "function") {
			RequestAuthorizationToken();
		}
	});
});

function update_play_button_icon() {
	play_button_icons = [];
<?php
echo "	play_button_icons['playing'] = '".$_SESSION['theme']['button_icon_pause']['text']."';\n";
echo "	play_button_icons['paused'] = '".$_SESSION['theme']['button_icon_play']['text']."';\n";
echo "	play_button_icons['stopped'] = '".$_SESSION['theme']['button_icon_play']['text']."';\n";
echo "	play_button_icons['synthesizing'] = '".$_SESSION['theme']['button_icon_pause']['text']."';\n";
?>
	playButton.innerHTML = "<span class='" + play_button_icons[playerState] + " fa-fw'></span>";
}

function tts_play_pause() {
	if (playerState == 'playing' || playerState == 'paused') {
		stopButton.disabled = false;
		stopButton.style.display = '';
		if (playerState == 'playing') {
			// pause
			player.pause();
			playerState = 'paused';
			// set play button icon to play
			update_play_button_icon();
		} else {
			// play
			player.resume();
			playerState = 'playing';
			// set play button icon to pause
			update_play_button_icon();
		}
	} else {
		synthesisSsml = recordingText.value;
		generatedSsml.value = synthesisSsml;
		if (isSsml.value == 'true') {
			blockGeneratedSsml.style.display = 'none';
		} else {
			synthesisSsml = "<speak xmlns=\"http://www.w3.org/2001/10/synthesis\" xmlns:mstts=\"http://www.w3.org/2001/mstts\" xmlns:emo=\"http://www.w3.org/2009/10/emotionml\" version=\"1.0\" xml:lang=\"en-US\">\n"+ recordingText.value + "</speak>";
			generatedSsml.value = synthesisSsml;
			blockGeneratedSsml.style.display = "";
		}
		highlightDiv.innerHTML = "";
		blockHighlight.style.display = '';
		wordBoundaryList = [];

		// if we got an authorization token, use the token
		var speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, region);
		speechConfig.speechSynthesisVoiceName = voiceOptions.value;

		player = new SpeechSDK.SpeakerAudioDestination();
		player.onAudioEnd = function (_) {
			window.console.log("playback finished");
			playButton.disabled = false;
			playerState = 'stopped';
			// set play button icon to play
			update_play_button_icon();
			stopButton.disabled = true;
			stopButton.style.display = 'none';
			wordBoundaryList = [];
		};

		var audioConfig  = SpeechSDK.AudioConfig.fromSpeakerOutput(player);

		synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

		// The synthesis started event signals that the synthesis is started.
		synthesizer.synthesisStarted = function (s, e) {
			window.console.log(e);
			playerState = 'synthesizing';
			playButton.disabled = true;
			stopButton.disabled = true;
			stopButton.style.display = '';
		};

		// The event synthesis completed signals that the synthesis is completed.
		synthesizer.synthesisCompleted = function (s, e) {
			console.log(e);
			playerState = 'playing';
			playButton.disabled = false;
			stopButton.disabled = false;
			stopButton.style.display = '';
			// set play button icon to pause
			update_play_button_icon();
		};

		// The event signals that the service has stopped processing speech.
		// This can happen when an error is encountered.
		synthesizer.SynthesisCanceled = function (s, e) {
			const cancellationDetails = SpeechSDK.CancellationDetails.fromResult(e.result);
			let str = "(cancel) Reason: " + SpeechSDK.CancellationReason[cancellationDetails.reason];
			if (cancellationDetails.reason === SpeechSDK.CancellationReason.Error) {
				str += ": " + e.result.errorDetails;
			}
			window.console.log(e);
			playButton.disabled = false;
			playerState = 'stopped';
			// set play button icon to play
			update_play_button_icon();
			stopButton.disabled = true;
			stopButton.style.display = 'none';
		};

		// This event signals that word boundary is received. This indicates the audio boundary of each word.
		// The unit of e.audioOffset is tick (1 tick = 100 nanoseconds), divide by 10,000 to convert to milliseconds.
		synthesizer.wordBoundary = function (s, e) {
			window.console.log(e);
			wordBoundaryList.push(e);
		};

		const complete_cb = function (result) {
			window.console.log(result);
			synthesizer.close();
			synthesizer = undefined;
		};
		const err_cb = function (err) {
			playButton.disabled = false;
			playerState = 'stopped';
			// set play button icon to play
			update_play_button_icon();
			stopButton.disabled = true;
			stopButton.style.display = 'none';
			window.console.log(err);
			synthesizer.close();
			synthesizer = undefined;
		};
		synthesizer.speakSsmlAsync(synthesisSsml, complete_cb, err_cb);
	}
}

function tts_stop() {
	if (playerState == 'playing' || playerState == 'paused') {
		if (player !== undefined) {
			player.pause();
			player.close();
			player = undefined;
		}
	}
	if (synthesizer !== undefined) {
		synthesizer.close();
		synthesizer = undefined;
	}
	playerState = 'stopped';
	// set play button icon to play
	update_play_button_icon();
	playButton.disabled = false;
	stopButton.disabled = true;
	stopButton.style.display = 'none';
	highlightDiv.innerHTML = "";
	blockHighlight.style.display = "none";
}

function getSelectedText() {
    if (window.getSelection) {
        txt = window.getSelection();
		//alert(txt);
    } else if (window.document.getSelection) {
        txt =window.document.getSelection();
    } else if (window.document.selection) {
        txt = window.document.selection.createRange().text;
    }
    return txt;  
}

document.getElementById('recording_voice').onchange = function() {
	var voice_val = document.getElementById("recording_voice").value;
	
  // calls the addTagSel() function for "my_textarea", displaying the selected text and tag into an alert window
  var tag_seltxt = addTagSel('voice name="'+voice_val+'"','voice', 'recording_text');
 // alert(tag_seltxt);
};

document.getElementById('speaking_rate').onchange = function() {
	
	var rate_val = document.getElementById("speaking_rate").value;
	
	speaking_rate_val = parseFloat(rate_val);
			if (isNaN(speaking_rate_val)) {
				speaking_rate_val = 1.00;
			}
			if (speaking_rate_val < 0) {
				speaking_rate_val = 1.0;
			} else if (speaking_rate_val > 3.0) {
				speaking_rate_val = 3.0;
			}

			var rate_value=Math.round((speaking_rate_val - 1.0) * 100.0) + "%";
	var tag_seltxt1 = addTagSel('prosody rate="'+rate_value+'"','prosody', 'recording_text');
 alert(tag_seltxt1);
};

/*document.getElementById('pitch').onchange = function() {
	
	var pitch_val = document.getElementById("pitch").value;
	
	speaking_pitch_val = parseFloat(pitch_val);
			if (isNaN(speaking_pitch_val)) {
				speaking_pitch_val = 1.00;
			}
			if (speaking_pitch_val < 0) {
				speaking_pitch_val = 1.0;
			} else if (speaking_pitch_val > 3.0) {
				speaking_pitch_val = 3.0;
			}

	var rate_val = document.getElementById("speaking_rate").value;
	
	speaking_rate_val = parseFloat(rate_val);
			if (isNaN(speaking_rate_val)) {
				speaking_rate_val = 1.00;
			}
			if (speaking_rate_val < 0) {
				speaking_rate_val = 1.0;
			} else if (speaking_rate_val > 3.0) {
				speaking_rate_val = 3.0;
			}

			var rate_value=Math.round((speaking_rate_val - 1.0) * 100.0) + "%";
			var pitch_value=Math.round((speaking_pitch_val - 1.0) * 50.0) + "%";
	var tag_seltxt1 = addTagSel('prosody rate="'+rate_value+'" pitch="'+pitch_value+'"','prosody', 'recording_text');
 alert(tag_seltxt2);
};*/

function addTagSel(tag_before,tag_after, idelm) {
	debugger;
 if(idelm != '')
 {
  var tag_type = new Array('<', '>');        // for BBCode tag, replace with:  new Array('[', ']');
  var txta = document.getElementById(idelm);
  
  var start = tag_type[0] + tag_before + tag_type[1];
  var end = tag_type[0] +'/'+ tag_after +  tag_type[1];
  var IE = /*@cc_on!@*/false;    // this variable is false in all browsers, except IE

  if (IE) {
    var r = document.selection.createRange();
    var tr = txta.createTextRange();
    var tr2 = tr.duplicate();
    tr2.moveToBookmark(r.getBookmark());
    tr.setEndPoint('EndToStart',tr2);
    var tag_seltxt = start + r.text + end;
    var the_start = txta.value.replace(/[\r\n]/g,'.').indexOf(r.text.replace(/[\r\n]/g,'.'),tr.text.length);
    txta.value = txta.value.substring(0, the_start) + tag_seltxt + txta.value.substring(the_start + tag_seltxt.length, txta.value.length);

    var pos = txta.value.length - end.length;    // Sets location for cursor position
    tr.collapse(true);
    tr.moveEnd('character', pos);        // start position
    tr.moveStart('character', pos);        // end position
    tr.select();                 // selects the zone
  }
  else if (txta.selectionStart || txta.selectionStart == "0") {
    var startPos = txta.selectionStart;
    var endPos = txta.selectionEnd;
    var tag_seltxt = start + txta.value.substring(startPos, endPos) + end;
    txta.value = txta.value.substring(0, startPos) + tag_seltxt + txta.value.substring(endPos, txta.value.length);

    // Place the cursor between formats in #txta
    txta.setSelectionRange((endPos+start.length),(endPos+start.length));
    txta.focus();
  }
  var txt_data = document.getElementById(idelm).value;
  let val_exist = txt_data.search("voice");
  if(val_exist>0)
  {
	return "</voice>"+tag_seltxt+"<voice>";
  }
  else
  {
	return tag_seltxt;
  }
  
 }
}
</script>
<?php
//include the footer
	require_once "resources/footer.php";

?>
