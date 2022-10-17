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

//set the include path
	$conf = glob("{/usr/local/etc,/etc}/fusionpbx/config.conf", GLOB_BRACE);
	set_include_path(parse_ini_file($conf[0])['document.root']);

//includes files
	require_once "resources/require.php";
	require_once "resources/check_auth.php";
	require_once "resources/paging.php";

//add multi-lingual support
	$language = new text;
	$text = $language->get();

//download the recording
	if ($_GET['a'] == "download" && (permission_exists('tts_recording_play') || permission_exists('tts_recording_download'))) {
		if ($_GET['type'] == "rec") {
			//set the path for the directory
				$path = $_SESSION['switch']['recordings']['dir']."/".$_SESSION['domain_name'];

			//if from TTS recordings, get recording details from db
				$recording_uuid = $_GET['id']; //recordings
				if ($recording_uuid != '') {
					$sql = "select recording_filename ";
					$sql .= "from v_tts_recordings ";
					$sql .= "where domain_uuid = :domain_uuid ";
					$sql .= "and tts_recording_uuid = :recording_uuid ";
					$parameters['domain_uuid'] = $domain_uuid;
					$parameters['recording_uuid'] = $recording_uuid;
					$database = new database;
					$row = $database->select($sql, $parameters, 'row');
					if (is_array($row) && @sizeof($row) != 0) {
						$recording_filename = $row['recording_filename'];
						//build full path
							if (substr($recording_filename,0,1) == '/') {
								$full_recording_path = $path.$recording_filename;
							}
							else {
								$full_recording_path = $path.'/'.$recording_filename;
							}
						//if recordings are stored in base64, retrieve from db and dump into file
							if ($_SESSION['recordings']['storage_type']['text'] == 'base64') {
								$sql2 = "select recording_base64 ";
								$sql2 .= "from v_recordings ";
								$sql2 .= "where domain_uuid = :domain_uuid ";
								$sql2 .= "and recording_uuid = :recording_uuid ";
								$parameters2['domain_uuid'] = $domain_uuid;
								$parameters2['recording_uuid'] = $recording_uuid;
								$database2 = new database;
								$row2 = $database2->select($sql2, $parameters2, 'row');
								if (is_array($row2) && @sizeof($row2) != 0) {
									$recording_decoded = base64_decode($row2['recording_base64']);
									if (isset($recording_decoded) && !empty($recording_decoded)) {
										file_put_contents($full_recording_path, $recording_decoded);
									}
								}
								unset($sql2, $parameters2, $row2, $recording_decoded);
							}
					}
					unset($sql, $parameters, $row, $recording_decoded);
				}

			//send the headers and then the data stream
				if (file_exists($full_recording_path)) {
					//content-range
					if (isset($_SERVER['HTTP_RANGE']) && $_GET['t'] != "bin")  {
						range_download($full_recording_path);
					}

					$fd = fopen($full_recording_path, "rb");
					if ($_GET['t'] == "bin") {
						header("Content-Type: application/force-download");
						header("Content-Type: application/octet-stream");
						header("Content-Type: application/download");
						header("Content-Description: File Transfer");
					}
					else {
						$file_ext = pathinfo($recording_filename, PATHINFO_EXTENSION);
						switch ($file_ext) {
							case "wav" : header("Content-Type: audio/x-wav"); break;
							case "mp3" : header("Content-Type: audio/mpeg"); break;
							case "ogg" : header("Content-Type: audio/ogg"); break;
						}
					}
					header('Content-Disposition: attachment; filename="'.$recording_filename.'"');
					header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
					header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
					if ($_GET['t'] == "bin") {
						header("Content-Length: ".filesize($full_recording_path));
					}
					ob_clean();
					fpassthru($fd);
				}
		}
		exit;
	}

//check the permission
	if (permission_exists('tts_recording_view')) {
		//access granted
	}
	else {
		echo "access denied";
		exit;
	}

//get existing recordings
	$sql = "select recording_uuid, recording_filename, recording_base64 ";
	$sql .= "from v_recordings ";
	$sql .= "where domain_uuid = :domain_uuid ";
	$parameters['domain_uuid'] = $domain_uuid;
	$database = new database;
	$result = $database->select($sql, $parameters, 'all');
	if (is_array($result) && @sizeof($result) != 0) {
		foreach ($result as &$row) {
			$array_recordings[$row['recording_uuid']] = $row['recording_filename'];
			$array_base64_exists[$row['recording_uuid']] = ($row['recording_base64'] != '') ? true : false;
		}
	}
	unset($sql, $parameters, $result, $row);

//get existing TTS recordings
	$sql = "select tts_recording_uuid, recording_name, recording_filename ";
	$sql .= "from v_tts_recordings ";
	$sql .= "where domain_uuid = :domain_uuid ";
	$parameters['domain_uuid'] = $domain_uuid;
	$database = new database;
	$result = $database->select($sql, $parameters, 'all');
	if (is_array($result) && @sizeof($result) != 0) {
		foreach ($result as &$row) {
			$recording_uuid = $row['tts_recording_uuid'];
			$recording_name = $row['recording_name'];
			$recording_filename = $row['recording_filename'];
			$array_tts_recordings[$row['tts_recording_uuid']] = $recording_filename;
			if (!is_array($array_recordings) || !in_array($recording_filename, $array_recordings)) {
				//add missing TTS recording to recordings table in the database
					$array['recordings'][0]['domain_uuid'] = $domain_uuid;
					$array['recordings'][0]['recording_uuid'] = $recording_uuid;
					$array['recordings'][0]['recording_filename'] = $recording_filename;
					$array['recordings'][0]['recording_name'] = $recording_name;
					$array['recordings'][0]['recording_description'] = $recording_name;
					if ($_SESSION['recordings']['storage_type']['text'] == 'base64' && file_exists($_SESSION['switch']['recordings']['dir'].'/'.$_SESSION['domain_name'].'/'.$recording_filename)) {
						$recording_base64 = base64_encode(file_get_contents($_SESSION['switch']['recordings']['dir'].'/'.$_SESSION['domain_name'].'/'.$recording_filename));
						$array['recordings'][0]['recording_base64'] = $recording_base64;
					}
				//set temporary permissions
					$p = new permissions;
					$p->add('recording_add', 'temp');
				//execute insert
					$database = new database;
					$database->app_name = 'recordings';
					$database->app_uuid = '83913217-c7a2-9e90-925d-a866eb40b60e';
					$database->save($array);
					unset($array);
				//remove temporary permissions
					$p->delete('recording_add', 'temp');
			}
			else {
				//file found in db, check if base64 present
					if ($_SESSION['recordings']['storage_type']['text'] == 'base64') {
						$found_recording_uuid = array_search($recording_filename, $array_recordings);
						if (!$array_base64_exists[$found_recording_uuid]) {
							$recording_base64 = base64_encode(file_get_contents($_SESSION['switch']['recordings']['dir'].'/'.$_SESSION['domain_name'].'/'.$recording_filename));
							//build array
								$array['recordings'][0]['domain_uuid'] = $domain_uuid;
								$array['recordings'][0]['recording_uuid'] = $found_recording_uuid;
								$array['recordings'][0]['recording_base64'] = $recording_base64;
							//set temporary permissions
								$p = new permissions;
								$p->add('recording_edit', 'temp');
							//execute update
								$database = new database;
								$database->app_name = 'recordings';
								$database->app_uuid = '83913217-c7a2-9e90-925d-a866eb40b60e';
								$database->save($array);
								unset($array);
							//remove temporary permissions
								$p->delete('recording_edit', 'temp');
						}
					}
			}
		}
	}
	unset($sql, $parameters, $result, $row);

//get posted data
	if (is_array($_POST['recordings'])) {
		$action = $_POST['action'];
		$search = $_POST['search'];
		$recordings = $_POST['recordings'];
	}

//process the http post data by action
	if ($action != '' && is_array($recordings) && @sizeof($recordings) != 0) {
		switch ($action) {
			case 'delete':
				if (permission_exists('tts_recording_delete') && permission_exists('recording_delete')) {
					$obj = new tts_recordings;
					$obj->delete($recordings);
				}
				break;
		}

		header('Location: recordings.php'.($search != '' ? '?search='.urlencode($search) : null));
		exit;
	}

//get order and order by
	$order_by = $_GET["order_by"];
	$order = $_GET["order"];

//add the search term
	$search = strtolower($_GET["search"]);
	if (strlen($search) > 0) {
		$sql_search = "and (";
		$sql_search .= "lower(recording_name) like :search ";
		$sql_search .= "or lower(recording_filename) like :search ";
		$sql_search .= "or lower(recording_text) like :search ";
		$sql_search .= ") ";
		$parameters['search'] = '%'.$search.'%';
	}

//get total recordings from the database
	$sql = "select count(*) from v_tts_recordings ";
	$sql .= "where domain_uuid = :domain_uuid ";
	$sql .= $sql_search;
	$parameters['domain_uuid'] = $_SESSION['domain_uuid'];
	$database = new database;
	$num_rows = $database->select($sql, $parameters, 'column');

//prepare to page the results
	$rows_per_page = ($_SESSION['domain']['paging']['numeric'] != '') ? $_SESSION['domain']['paging']['numeric'] : 50;
	$param = "&search=".$search;
	$param .= "&order_by=".$order_by."&order=".$order;
	$page = is_numeric($_GET['page']) ? $_GET['page'] : 0;
	list($paging_controls, $rows_per_page) = paging($num_rows, $param, $rows_per_page);
	list($paging_controls_mini, $rows_per_page) = paging($num_rows, $param, $rows_per_page, true);
	$offset = $rows_per_page * $page;

//get the TTS recordings from the database
	$sql = str_replace('count(*)', 'tts_recording_uuid, domain_uuid, recording_filename, recording_name, recording_voice, is_text_ssml, recording_text, date_created, date_updated', $sql);
	$sql .= order_by($order_by, $order, 'recording_name', 'asc');
	$sql .= limit_offset($rows_per_page, $offset);
	$database = new database;
	$recordings = $database->select($sql, $parameters, 'all');
	unset($sql, $parameters);

//create token
	$object = new token;
	$token = $object->create($_SERVER['PHP_SELF']);

//include the header
	$document['title'] = $text['title-tts-recordings'];
	require_once "resources/header.php";

//file type check script
	echo "<script language='JavaScript' type='text/javascript'>\n";
	echo "	function check_file_type(file_input) {\n";
	echo "		file_ext = file_input.value.substr((~-file_input.value.lastIndexOf('.') >>> 0) + 2);\n";
	echo "		if (file_ext != 'mp3' && file_ext != 'wav' && file_ext != 'ogg' && file_ext != '') {\n";
	echo "			display_message(\"".$text['message-unsupported_file_type']."\", 'negative', '2750');\n";
	echo "		}\n";
	echo "	}\n";
	echo "</script>";

//show the content
	echo "<div class='action_bar' id='action_bar'>\n";
	echo "	<div class='heading'><b>".$text['title-tts-recordings']." (".$num_rows.")</b></div>\n";
	echo "	<div class='actions'>\n";
	if (permission_exists('tts_recording_add')) {
		echo button::create(['type'=>'button','label'=>$text['button-add'],'icon'=>$_SESSION['theme']['button_icon_add'],'id'=>'btn_add','link'=>'recording_edit.php']);
	}
	if (permission_exists('tts_recording_delete') && $recordings) {
		echo button::create(['type'=>'button','label'=>$text['button-delete'],'icon'=>$_SESSION['theme']['button_icon_delete'],'name'=>'btn_delete','onclick'=>"modal_open('modal-delete','btn_delete');"]);
	}
	echo 		"<form id='form_search' class='inline' method='get'>\n";
	echo 		"<input type='text' class='txt list-search' name='search' id='search' value=\"".escape($search)."\" placeholder=\"".$text['label-search']."\" onkeydown='list_search_reset();'>";
	echo button::create(['label'=>$text['button-search'],'icon'=>$_SESSION['theme']['button_icon_search'],'type'=>'submit','id'=>'btn_search','style'=>($search != '' ? 'display: none;' : null)]);
	echo button::create(['label'=>$text['button-reset'],'icon'=>$_SESSION['theme']['button_icon_reset'],'type'=>'button','id'=>'btn_reset','link'=>'recordings.php','style'=>($search == '' ? 'display: none;' : null)]);
	if ($paging_controls_mini != '') {
		echo 	"<span style='margin-left: 15px;'>".$paging_controls_mini."</span>";
	}
	echo "		</form>\n";
	echo "	</div>\n";
	echo "	<div style='clear: both;'></div>\n";
	echo "</div>\n";

	if (permission_exists('tts_recording_delete') && $recordings) {
		echo modal::create(['id'=>'modal-delete','type'=>'delete','actions'=>button::create(['type'=>'button','label'=>$text['button-continue'],'icon'=>'check','id'=>'btn_delete','style'=>'float: right; margin-left: 15px;','collapse'=>'never','onclick'=>"modal_close(); list_action_set('delete'); list_form_submit('form_list');"])]);
	}

	echo $text['description-tts-recordings']."\n";
	echo "<br /><br />\n";

	echo "<form id='form_list' method='post'>\n";
	echo "<input type='hidden' id='action' name='action' value=''>\n";
	echo "<input type='hidden' name='search' value=\"".escape($search)."\">\n";

	echo "<table class='list'>\n";
	echo "<tr class='list-header'>\n";
	$col_count = 0;
	if (permission_exists('tts_recording_delete')) {
		echo "	<th class='checkbox'>\n";
		echo "		<input type='checkbox' id='checkbox_all' name='checkbox_all' onclick='list_all_toggle();' ".($recordings ?: "style='visibility: hidden;'").">\n";
		echo "	</th>\n";
		$col_count++;
	}
	echo th_order_by('recording_name', $text['label-recording_name'], $order_by, $order);
	$col_count++;
	if ($_SESSION['recordings']['storage_type']['text'] != 'base64') {
		echo th_order_by('recording_filename', $text['label-file_name'], $order_by, $order, null, "class='hide-md-dn'");
		$col_count++;
	}
	if (permission_exists('tts_recording_play') || permission_exists('tts_recording_download')) {
		echo "<th class='center shrink'>".$text['label-tools']."</th>\n";
		$col_count++;
	}
	echo th_order_by('recording_voice', $text['label-recording_voice'], $order_by, $order);
	$col_count++;
	echo th_order_by('recording_text', $text['label-recording_text'], $order_by, $order, null, "class='hide-sm-dn pct-25'");
	$col_count++;
	echo th_order_by('date_created', $text['label-date_created'], $order_by, $order);
	$col_count++;
	echo th_order_by('date_updated', $text['label-date_updated'], $order_by, $order);
	$col_count++;
	if (permission_exists('tts_recording_edit') && $_SESSION['theme']['list_row_edit_button']['boolean'] == 'true') {
		echo "	<td class='action-button'>&nbsp;</td>\n";
		$col_count++;
	}
	echo "</tr>\n";

	if (is_array($recordings) && @sizeof($recordings) != 0) {
		$x = 0;
		foreach ($recordings as $row) {
			//playback progress bar
				if (permission_exists('tts_recording_play')) {
					echo "<tr class='list-row' id='recording_progress_bar_".escape($row['tts_recording_uuid'])."' style='display: none;'><td class='playback_progress_bar_background' style='padding: 0; border: none;' colspan='".$col_count."'><span class='playback_progress_bar' id='recording_progress_".escape($row['tts_recording_uuid'])."'></span></td></tr>\n";
					echo "<tr class='list-row' style='display: none;'><td></td></tr>\n"; // dummy row to maintain alternating background color
				}
			if (permission_exists('tts_recording_edit')) {
				$list_row_url = "recording_edit.php?id=".urlencode($row['tts_recording_uuid']);
			}
			echo "<tr class='list-row' href='".$list_row_url."'>\n";
			if (permission_exists('tts_recording_delete')) {
				echo "	<td class='checkbox'>\n";
				echo "		<input type='checkbox' name='recordings[$x][checked]' id='checkbox_".$x."' value='true' onclick=\"if (!this.checked) { document.getElementById('checkbox_all').checked = false; }\">\n";
				echo "		<input type='hidden' name='recordings[$x][uuid]' value='".escape($row['tts_recording_uuid'])."' />\n";
				echo "	</td>\n";
			}
			echo "	<td>";
			if (permission_exists('tts_recording_edit')) {
				echo "<a href='".$list_row_url."' title=\"".$text['button-edit']."\">".escape($row['recording_name'])."</a>";
			}
			else {
				echo escape($row['recording_name']);
			}
			echo "	</td>\n";
			if ($_SESSION['recordings']['storage_type']['text'] != 'base64') {
				echo "	<td class='hide-md-dn'>".str_replace('_', '_&#8203;', escape($row['recording_filename']))."</td>\n";
			}
			if (permission_exists('tts_recording_play') || permission_exists('tts_recording_download')) {
				echo "	<td class='middle button center no-link no-wrap'>";
				if (permission_exists('tts_recording_play')) {
					$recording_file_path = $row['recording_filename'];
					$recording_file_name = strtolower(pathinfo($recording_file_path, PATHINFO_BASENAME));
					$recording_file_ext = pathinfo($recording_file_name, PATHINFO_EXTENSION);
					switch ($recording_file_ext) {
						case "wav" : $recording_type = "audio/wav"; break;
						case "mp3" : $recording_type = "audio/mpeg"; break;
						case "ogg" : $recording_type = "audio/ogg"; break;
					}
					echo "<audio id='recording_audio_".escape($row['tts_recording_uuid'])."' style='display: none;' preload='none' ontimeupdate=\"update_progress('".escape($row['tts_recording_uuid'])."')\" onended=\"recording_reset('".escape($row['tts_recording_uuid'])."');\" src=\"".PROJECT_PATH."/app/tts_recordings/recordings.php?a=download&type=rec&id=".urlencode($row['tts_recording_uuid'])."&rand=".time()."\" type='".$recording_type."'></audio>";
					echo button::create(['type'=>'button','title'=>$text['label-play'].' / '.$text['label-pause'],'icon'=>$_SESSION['theme']['button_icon_play'],'id'=>'recording_button_'.escape($row['tts_recording_uuid']),'onclick'=>"recording_play('".escape($row['tts_recording_uuid'])."')"]);
				}
				if (permission_exists('tts_recording_download')) {
					echo button::create(['type'=>'button','title'=>$text['label-download'],'icon'=>$_SESSION['theme']['button_icon_download'],'link'=>"recordings.php?a=download&type=rec&t=bin&id=".urlencode($row['tts_recording_uuid'])]);
				}
				echo "	</td>\n";
			}
			echo "	<td class='hide-md-dn'>".escape($row['recording_voice'])."</td>\n";
			echo "	<td class='description overflow hide-sm-dn'>".escape($row['recording_text'])."&nbsp;</td>\n";
			echo "	<td class='no-wrap'>".date('M d, Y', $row['date_created'])." <span class='hide-sm-dn'>".date(($_SESSION['domain']['time_format']['text'] == '12h' ? 'h:i:s a' : 'H:i:s'), $row['date_created'])."</span></td>\n";
			echo "	<td class='no-wrap'>".date('M d, Y', $row['date_updated'])." <span class='hide-sm-dn'>".date(($_SESSION['domain']['time_format']['text'] == '12h' ? 'h:i:s a' : 'H:i:s'), $row['date_updated'])."</span></td>\n";
			if (permission_exists('tts_recording_edit') && $_SESSION['theme']['list_row_edit_button']['boolean'] == 'true') {
				echo "	<td class='action-button'>";
				echo button::create(['type'=>'button','title'=>$text['button-edit'],'icon'=>$_SESSION['theme']['button_icon_edit'],'link'=>$list_row_url]);
				echo "	</td>\n";
			}
			echo "</tr>\n";
			$x++;
		}
		unset($recordings);
	}

	echo "</table>\n";
	echo "<br />\n";
	echo "<div align='center'>".$paging_controls."</div>\n";

	echo "<input type='hidden' name='".$token['name']."' value='".$token['hash']."'>\n";

	echo "</form>\n";

//include the footer
	require_once "resources/footer.php";

//define the download function (helps safari play audio sources)
	function range_download($file) {
		$fp = @fopen($file, 'rb');

		$size   = filesize($file); // File size
		$length = $size;           // Content length
		$start  = 0;               // Start byte
		$end    = $size - 1;       // End byte
		// Now that we've gotten so far without errors we send the accept range header
		/* At the moment we only support single ranges.
		* Multiple ranges requires some more work to ensure it works correctly
		* and comply with the spesifications: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2
		*
		* Multirange support annouces itself with:
		* header('Accept-Ranges: bytes');
		*
		* Multirange content must be sent with multipart/byteranges mediatype,
		* (mediatype = mimetype)
		* as well as a boundry header to indicate the various chunks of data.
		*/
		header("Accept-Ranges: 0-$length");
		// header('Accept-Ranges: bytes');
		// multipart/byteranges
		// http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2
		if (isset($_SERVER['HTTP_RANGE'])) {

			$c_start = $start;
			$c_end   = $end;
			// Extract the range string
			list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
			// Make sure the client hasn't sent us a multibyte range
			if (strpos($range, ',') !== false) {
				// (?) Shoud this be issued here, or should the first
				// range be used? Or should the header be ignored and
				// we output the whole content?
				header('HTTP/1.1 416 Requested Range Not Satisfiable');
				header("Content-Range: bytes $start-$end/$size");
				// (?) Echo some info to the client?
				exit;
			}
			// If the range starts with an '-' we start from the beginning
			// If not, we forward the file pointer
			// And make sure to get the end byte if spesified
			if ($range0 == '-') {
				// The n-number of the last bytes is requested
				$c_start = $size - substr($range, 1);
			}
			else {
				$range  = explode('-', $range);
				$c_start = $range[0];
				$c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
			}
			/* Check the range and make sure it's treated according to the specs.
			* http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
			*/
			// End bytes can not be larger than $end.
			$c_end = ($c_end > $end) ? $end : $c_end;
			// Validate the requested range and return an error if it's not correct.
			if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {

				header('HTTP/1.1 416 Requested Range Not Satisfiable');
				header("Content-Range: bytes $start-$end/$size");
				// (?) Echo some info to the client?
				exit;
			}
			$start  = $c_start;
			$end    = $c_end;
			$length = $end - $start + 1; // Calculate new content length
			fseek($fp, $start);
			header('HTTP/1.1 206 Partial Content');
		}
		// Notify the client the byte range we'll be outputting
		header("Content-Range: bytes $start-$end/$size");
		header("Content-Length: $length");

		// Start buffered download
		$buffer = 1024 * 8;
		while(!feof($fp) && ($p = ftell($fp)) <= $end) {
			if ($p + $buffer > $end) {
				// In case we're only outputtin a chunk, make sure we don't
				// read past the length
				$buffer = $end - $p + 1;
			}
			set_time_limit(0); // Reset time limit for big files
			echo fread($fp, $buffer);
			flush(); // Free up memory. Otherwise large files will trigger PHP's memory limit.
		}

		fclose($fp);
	}

?>
