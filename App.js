import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import "bootstrap/dist/css/bootstrap.css";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { useState, useEffect } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Checkbox from "@mui/material/Checkbox";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "./App.css";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
export default function App() {
  const [checked, setChecked] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [User, SetUser] = useState([]);
  const [Userstype, SetUserstype] = useState([]);
  const [ssml12, setssml12] = useState();
  const [ssml2, setssml2] = useState([]);
  const [Gender1, setGender1] = useState('');
  const [LocalName1, setLocalName1] = useState('');
  const [DisplayName1, setDisplayName1] = useState('');
  const [LocaleName1, setLocaleName1] = useState('');
  const [ssml3, setssml3] = useState([]);
  const [input, setinput] = useState('');
  const [withoutbrak, setwithoutbrak] = useState();
  const [DisplayName, setDisplayName] = useState("");
  const [Gender, setGender] = useState("");
  const [demo, SetDemo] = useState([]);
  const [Displaystyle, setDisplaystyle] = useState([])
  const [LocaleName, setLocaleName] = useState("");
  const [LocalName, setLocalName] = useState("");
  const [Wave, setWave] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [value, setValue] = React.useState(30);
  const [value1, setValue1] = React.useState(20);
  const handleSliderChange = (event, newValue) => { setValue(newValue) };
  const [isLoaded, setIsLoaded] = useState(false);
  const [Speaking, setSpeaking] = useState('');
  const Input = MuiInput;

  const [divEditer, setdivEditer] = useState("opan");
  const [ssmlEditer, setssmlEditer] = useState("hidden");
  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };
  const handleInputChange1 = (event) => {
    setValue1(event.target.value === "" ? "" : Number(event.target.value));
  };
  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };
  const handleBlur1 = () => {
    if (value1 < 0) {
      setValue1(0);

    } else if (value1 > 200) {
      setValue1(200);
    }
  };
  var _onPaste_StripFormatting_IEPaste = false;
  const handleContentEditableChangeBlur = (e) => {
    if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
      e.preventDefault();
      var text = e.originalEvent.clipboardData.getData('text/plain');
      window.document.execCommand('insertText', false, text);
  }
  else if (e.clipboardData && e.clipboardData.getData) {
      e.preventDefault();
      var text = e.clipboardData.getData('text/plain');
      window.document.execCommand('insertText', false, text);
  }
  else if (window.clipboardData && window.clipboardData.getData) {
      // Stop stack overflow
      if (!_onPaste_StripFormatting_IEPaste) {
          _onPaste_StripFormatting_IEPaste = true;
          e.preventDefault();
          window.document.execCommand('ms-pasteTextOnly', false);
      }
      _onPaste_StripFormatting_IEPaste = false;
  }
  }
  // enter event handler
  const handleContentEditableChange = (e) => {
 
    if (e.keyCode == "8") {
      if (document.getElementById("textid").querySelectorAll('div').length < 2) {
        if (document.getElementById("textid").querySelectorAll('span')[0].innerHTML == "<br>") {
          e.preventDefault();
          return false;
        }
        else if (document.getElementById("textid").querySelectorAll('span')[0].innerHTML.length < 2) {
          document.getElementById("textid").querySelectorAll('span')[0].innerHTML = "<br>";
          e.preventDefault();
          return false;
        }
       }

       if(document.getElementById("textid").querySelectorAll('div').length == 2){

        if(document.getElementById("textid").querySelectorAll('div')[1].innerHTML == "<br>" || document.getElementById("textid").querySelectorAll('div')[1].children[0].children[0].innerHTML == "<br>"){
         document.getElementById("textid").querySelectorAll('div')[1].remove();
         e.preventDefault();
         return false;
        }

      }
    }
  }
  const handleContentEditable = (e) => {
    if (e.key === 'Enter') { // 8 is backspace
      var docFragment = document.createDocumentFragment();

      var newEle = document.createElement('div');
      newEle.innerHTML = "<voice class='voiceclass' data-content='' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><br/></span></voice>";
      docFragment.appendChild(newEle);
      var range = window.getSelection().getRangeAt(0);

      range.deleteContents();
      document.getElementById("textid").appendChild(docFragment);
      range = document.createRange(); range.setStartAfter(newEle); range.collapse(true);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);

      e.preventDefault();
      return false;
    }
    let div_length = document.getElementById("textid").querySelectorAll('div').length;
    if (div_length > 1) {
      let length1 = div_length - 1;
      let length2 = div_length - 2;
      if(document.getElementById("textid").querySelectorAll('div')[length2].firstChild.attributes[1].nodeValue){
        let val1 = document.getElementById("textid").querySelectorAll('div')[length2].firstChild.attributes[1].nodeValue;
         
        if (val1 == ""){
        document.getElementById("textid").querySelectorAll('div')[length1].innerHTML = "<voice class='voiceclass' data-content='[JennyMultilingualNeural]' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><br/></span></voice>";
      }
      else{

         try{

          if(typeof document.getElementById("textid").querySelectorAll('div')[length1].childNodes[0].attributes[1] == 'undefined'){
            document.getElementById("textid").querySelectorAll('div')[length1].innerHTML = "<voice class='voiceclass' data-content='[JennyMultilingualNeural]' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><br/></span></voice>";
          }
          else{
         if(document.getElementById("textid").querySelectorAll('div')[length1].childNodes[0].attributes[1].nodeValue == ""){
            document.getElementById("textid").querySelectorAll('div')[length1].childNodes[0].attributes[1].nodeValue = val1;
         }
         if(document.getElementById("textid").querySelectorAll('div')[length1].innerHTML == "<br>"){

          document.getElementById("textid").querySelectorAll('div')[length1].innerHTML = "<voice class='voiceclass' data-content='[JennyMultilingualNeural]' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><br/></span></voice>";
         }
        }

        }

        catch(e) {  }  
      }
        
      }
      
      if(document.getElementById("textid").querySelectorAll('div')[length2].firstChild.attributes[1].nodeValue =="" && (document.getElementById("textid").querySelectorAll('div')[length1].children[0].children[0].innerHTML.length < 1 || document.getElementById("textid").querySelectorAll('div')[length1].children[0].children[0].innerHTML =="<br>")){
        document.getElementById("textid").querySelectorAll('div')[length1].innerHTML = "<voice class='voiceclass' data-content='[JennyMultilingualNeural]' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><br/></span></voice>";
      }

     // for check empty node
     try{
     if(window.getSelection().anchorNode.parentElement.parentNode.attributes[1].value == ""){
      window.getSelection().anchorNode.parentElement.parentNode.attributes[1].value = "[JennyMultilingualNeural]";
     }
     }
     catch(error) { 
             console.log(error);
      }

    }
  }

  // ################################## Ssml to Voice  ########################## 
  const playsound = (event) => {
    if (name == '' || name == 'undefined' && name == 'null') {
      var name = document.getElementById('stylespeaking').value;
    }
    var innertext21 = document.getElementById('textid').innerHTML;
    var str = innertext21;
    str = str.replaceAll('<span class="text-node">', '');
    str = str.replaceAll('</span>', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('</div>', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('<br>', '');
    str = str.replaceAll('class="voiceclass"', '');
    str = str.replaceAll('[', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll('<span class="Pauseclass">', '');
    str = str.replace('<s>', '<s/>');
    str = str.replace('<s></s></s>', '<s/>');
    str = str.replaceAll('&nbsp;', ' ');
    str = str.replaceAll(`<span data-content="${name}" last-data="</>" class="text-node">`, ``);
    str = str.replaceAll(`<span data-content="" last-data="" class="text-node">`, ``);
    console.log(str);
    setwithoutbrak(str)
    let date = textdata
    console.log("date",date)
    setIsLoaded(true);
    if(date == 'undefined'){
      alert("hii i am boy")
    }
    fetch("https://canadacentral.tts.speech.microsoft.com/cognitiveservices/v1", {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': '3751687d3f494502a2b7af3f62f675dc',
        'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
        'Content-Type': 'application/ssml+xml',
      }, body: date
    })
      .then((response) => response.blob())
      .then((blob) => {
        setWave(blob)
        setIsLoaded(false);
        var blob = new Blob([blob]);
        var url = window.URL.createObjectURL(blob);
        console.log('MP3 URl: ', url);
        setWave(url)
      })
      .catch(() => {
      })
  };
  const handleChange = (event) => {
    if (name == '' || name == 'undefined' && name == 'null') {
      var name = document.getElementById('stylespeaking').value;
    }
    var innertext21 = document.getElementById('textid').innerHTML;
    var str = innertext21;
    str = str.replaceAll('<span class="text-node">', '');
    str = str.replaceAll('</span>', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('</div>', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('<br>', '');
    str = str.replaceAll('class="voiceclass"', '');
    str = str.replaceAll('[', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll('<span class="Pauseclass">', '');
    str = str.replace('<s>', '<s/>');
    str = str.replace('<s></s></s>', '<s/>');
    str = str.replaceAll('&nbsp;', ' ');
    str = str.replaceAll(`<span data-content="${name}" last-data="</>" class="text-node">`, ``);
    str = str.replaceAll(`<span data-content="" last-data="" class="text-node">`, ``);
    // str= str.replace(/<[^>]*>?/gm,"");
    console.log(str);
    setwithoutbrak(str)
    if (event.target.checked) {
      setdivEditer("hidden");
      setssmlEditer("opan")
    }
    else {
      setdivEditer("opan");
      setssmlEditer("hidden")
    }
    setChecked(event.target.checked)
  };
  const handleClick3 = () => {
    setOpen3(!open3);
  };
  const handleClick4 = () => {
    setOpen4(!open4);
  };
  const handleClickOpen = () => {
    setOpen5(true);
  };
  const handleClose = () => {
    setOpen5(false);
  };
  // ##################################   Voice  ########################## 
  const Voice = (event) => {
    var name = document.getElementById('stylespeaking').value;
    console.log("namedata",name)
    var name = event.currentTarget.children[1].dataset.name;
    var gender = event.currentTarget.children[1].dataset.gender;
    var lang = event.currentTarget.children[1].dataset.lang;
    var short = event.currentTarget.children[1].dataset.short;  
 
    var sel = window.getSelection();
    console.log("sel", sel)
   
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("voice")[0].setAttribute("data-content", "[" + name + "]");
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("voice")[0].setAttribute("name", "" + short + "");
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("voice")[0].setAttribute("Gender", "" + gender + "");

  };

  // ##################################   Rate  ########################## 
  const Rate = (event) => {
    var name = event.currentTarget.innerText;
    var tag_seltxt = addRate('prosody', 'textid', value);
  };
  function addRate(tag, rate, value) {
    var innertext2 = document.getElementById(rate).innerHTML;
    var firstpart;
    var secondpart;
    var secondpart2;
    var thirdpart;
    var finaltag;
    var selectpart = window.getSelection().toString();
    if (selectpart.length < 1) {
      return false;
    }
    var explode = innertext2.split(selectpart);
    firstpart = explode[0];
    if (typeof explode[1] != "undefined")
      thirdpart = explode[1];
    else
      thirdpart = "";
    secondpart = '<prosody class="rate" data-name="' + value + '">' + selectpart + '</prosody>';
    secondpart2 = '<prosody class="rate" data-name="' + value + '">' + selectpart + '</prosody>';
    setssml2(secondpart2)
    console.log("secondpart2", secondpart2)
    localStorage.setItem("secondpart2", secondpart2);
    finaltag = firstpart + secondpart + thirdpart;
    var x = document.getElementById(rate);
    x.innerHTML = finaltag;
    return innertext2;
  }
  // ##################################  Pause  ########################## 
  const Pause = (event) => {
    var name = event.currentTarget.innerText;
    var tag_seltxt = addPause('break ', 'textid', value1);
    console.log("tag_seltxt123", tag_seltxt)
  };
  function addPause(tag, pause, value1) {
    var innertext3 = document.getElementById(pause).innerHTML;
    var firstpart;
    var secondpart;
    var secondpart1;
    var thirdpart;
    var finaltag;
    var selectpart = window.getSelection().toString();
    if (selectpart.length < 1) {
      return false;
    }
    var explode = innertext3.split(selectpart);
    firstpart = explode[0];
    if (typeof explode[1] != "undefined")
      thirdpart = explode[1];
    else
      thirdpart = "";
    secondpart = '<break class="Pause" data-name="' + value1 + '"><span class="Pauseclass">[' + value1 + 's' + ']</span>' + selectpart + '</break>';
    secondpart1 = '<break class="Pause" data-name="' + value1 + '">' + selectpart + '</break>';
    setssml3(secondpart1)
    console.log("secondpart", secondpart1)
    localStorage.setItem("secondpart1", secondpart1);
    finaltag = firstpart + secondpart + thirdpart;
    var x = document.getElementById(pause);
    x.innerHTML = finaltag;
    return innertext3;
  }
  // ##################################  ssml Convert  ########################## 
  var closetagBefore = '<speak version="1.0" xml:lang="en-US">';
  var startAftertag = '</speak>';
  var startAftertagfe = withoutbrak;
  if (withoutbrak !== undefined)
    var textdata = closetagBefore + startAftertagfe + startAftertag;
  else if(ssml2 !== undefined){
    var textdata = closetagBefore + startAftertagfe
  }

  const handleClick1 = () => {
    setOpen1(!open1);
  };
  // ################################## Voice List  ########################## 
  useEffect(() => {
    fetch(
      "https://canadacentral.tts.speech.microsoft.com/cognitiveservices/voices/list",
      {
        method: "GET",
        headers: {
          "ocp-apim-subscription-key": "3751687d3f494502a2b7af3f62f675dc",
          "cache-control": "no-cache",
        }
      })

      .then((response) => response.json())
      .then((data) => {
        SetUser(data);
        console.log("mydata", data);
      })
      .catch((err) => {
        console.log("myerr", err);
      })
  }, [])
  // ################################## Get Tokan  ########################## 
  useEffect(() => {
    fetch(
      "https://canadacentral.api.cognitive.microsoft.com/sts/v1.0/issueToken",
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": "3751687d3f494502a2b7af3f62f675dc",
          "cache-control": "no-cache",
        }
      })
      .then((response) => response.text())
      .then((data) => {
        console.log("mydata", data);
        localStorage.setItem("myData", data);
      })
      .catch((err) => {
        console.log("myerr", err);
      })
  }, []);
  const saveUser = (items) => {
    console.log("itemssasadd", items);
    if (items) {
      setDisplayName(items.DisplayName);
      setGender(items.Gender)
      setLocalName(items.LocalName)
      setLocaleName(items.LocaleName)
    }
  };
  const saveDatalist = (data) => {
    console.log("demo.StyleName", data.StyleList)
    setDisplaystyle(data ? data.StyleList : 0);
    setDisplayName1(data.DisplayName);
    setGender1(data.Gender)
    setLocalName1(data.LocalName)
    setLocaleName1(data.LocaleName)
    if (data) {
      SetDemo({ data })
      console.log("demo", data)
    }
  }
  const array = User
  const result = [];
  const map = new Map();
  for (const item of array) {
    if (!map.has(item.Locale)) {
      map.set(item.Locale, true);
      result.push({
        LocaleName: item.LocaleName,
        StyleName: item.StyleList,
        Locale: item.Locale,
        VoiceType: item.VoiceType
      })
    }
  }
 
  const Speakingstyle = (e) => {
    var name = document.getElementById('stylespeaking').value;
    console.log("name", name)

    var tag_seltxtstyle = addstyle('mstts', 'textid', name);
    console.log("tag_seltxt123", tag_seltxtstyle)
    var sel = window.getSelection();
    console.log("sel", sel)
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("span")[0].setAttribute("data-content", "[" + name + "]");
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("span")[0].setAttribute("last-data", "</>");
   }
  function addstyle(tag, rate, name) {
    var closetagBeforespeaklast = '</>';
    var innertext2 = document.getElementById(rate).innerHTML;
    var firstpart;
    var secondpart;
    var secondpart2;
    var thirdpart;
    var finaltag;
    var selectpart = window.getSelection().toString();
    console.log("selectpart", selectpart)
    if (selectpart.length < 1) {
      return false;
    }
    debugger
    var explode = innertext2.split(selectpart);
    firstpart = explode[0];
    if (typeof explode[1] != "undefined")
      thirdpart = explode[1];
    else
      thirdpart = "";
      secondpart = '<s/><mstts:express-as style="' + name + '"><span class="Pauseclass">[' + name + ']</span>' + selectpart + '</mstts:express-as><s/>';
      setssml2(secondpart)
    console.log("secondpart2", secondpart)
    finaltag = firstpart + secondpart + thirdpart;

  }

  return (
    <Container fluid>
      <br />
      <Dialog
        open={open5}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to leave without saving?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            All changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Save</Button>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Row>
        <Col xs={12} md={2} className="border-round">
          <Dropdown className="form-control ">
            <Dropdown.Toggle id="dropdown-basic" className="save">
              <i className="fa fa-file-o"></i> All Recording
            </Dropdown.Toggle>
            <Dropdown.Menu className="form-control Recording">
              <Dropdown.Item href="#">
                <i class="fa fa-file-text-o" ></i> tts_1636608015.wav
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={12} md={7} >
          <div className="App">
            <Row>
              <Col xs={12} md={3}>
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic" className="save">
                    <i className="fa fa-file-o"></i> New Recording
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1" onClick={handleClickOpen}><i class="fa fa-file-text-o"></i> New text file</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">
                      <i class="fa fa-file-excel-o" ></i> New lexicon file
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs={12} md={2}>
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic" className="save">
                    <i className="fa fa-floppy-o"></i> Save
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1"><i class="fa fa-file-audio-o" ></i> Save as</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs={12} md={2}>
                <p className="line2 save">
                  <a href="" className="line2 save">
                    <i className="fa fa-download"></i> Download
                  </a>
                </p>
              </Col>
              <Col xs={12} md={1}></Col>
              <Col xs={12} md={4}>
                <i className="fa fa-undo line3"></i>{" "}
                <i className="fa fa-repeat line3"></i>
                <i className="fa fa-eraser line3"></i>{" "}
                <i className="fa fa-bookmark-o line3"></i>
                <Switch
                  className="line3"
                  checked={checked}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </div>
          {
            isLoaded ?
              (
                <div class="spinner-border spinner-audio text-light" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              ) : <button className="btn btnplay" onClick={playsound}></button>
          }
          <AudioPlayer
            src={Wave} controls />
          <br></br>
          <div contenteditable="true" className={divEditer} id="textid" placeholder="Enter text" onKeyPress={handleContentEditable} onKeyDown={handleContentEditableChange} onPaste={handleContentEditableChangeBlur}>
            <div id="voicessml">
              <voice class='voiceclass' data-content='[JennyMultilingualNeural]' name='en-US-ChristopherNeural' Gender='Male'>
                <span data-content=''last-data='' class="text-node"><br /></span>
              </voice>
            </div>
          </div>
          {
            Userstype == "" || Userstype == "undefined" ? (
              <TextareaAutosize
                aria-label="empty textarea"
                className={ssmlEditer}
                placeholder="Empty"
                onChange={(e) => setinput(e.target.value)} value={textdata}
                style={{ width: '100%', height: 500 }}
              />
            ) :
              <TextareaAutosize
                aria-label="empty textarea"
                className={ssmlEditer}
                placeholder="Empty"
                onChange={(e) => setinput(e.target.value)} value={textdata}
                style={{ width: '100%', height: 500 }}
              />
          }
        </Col>
        <Col xs={12} md={3} className="border-round">
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
              ></ListSubheader>
            }
          >
            {/* <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
              <ListItemText primary="Recent" />
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Starred" />
                </ListItemButton>
              </List>
            </Collapse> */}
            <ListItemButton onClick={handleClick1}>
              <ListItemIcon>
                {open1 ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
              <ListItemText primary="Voice " />
              <i className="fa fa-eraser" aria-hidden="true"></i>
            </ListItemButton>
            <Collapse in={open1} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className="language">
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon className="language">
                    <div className=" list">
                      {
                        result.map((items) => {
                          if (items.Locale == 'en-US' || items.Locale == 'en-CA' || items.Locale == 'fr-FR' || items.Locale == 'fr-CA' && items.VoiceType == 'Neural') {
                            return <a
                              onClick={() => saveUser(items)}
                              class="dropdown-item"
                              href="#"
                              key={items.id}
                            >
                              <span className="product_list">
                                {" "}
                                {items.LocaleName}{" "}
                              </span>{" "}
                            </a>
                          }
                        }
                        )
                      }
                    </div>
                  </ListItemIcon>
                  <ListItemText />
                </ListItemButton>
                <Col className="ln_stack" >
                  <div className="listing" id="answers" >
                    {
                      LocaleName == "" || LocaleName == "undefined" && LocaleName == "null" ?
                        (
                          null
                        ) : <div class="overdata">{User.map((data) => (
                          data.LocaleName == LocaleName ? (
                            <span class="blocks" onClick={Voice} >
                              <Checkbox onClick={() => saveDatalist(data)}
                                {...label}
                                icon={
                                  data.Gender == "Male" ? (
                                    <i class="fa fa-male"></i>
                                  ) :
                                    <i class="fa fa-female" aria-hidden="true"></i>
                                }
                                checkedIcon={
                                  data.Gender == "Male" ? (
                                    <i class="fa fa-male" aria-hidden="true"></i>
                                  ) :
                                    <i class="fa fa-female" aria-hidden="true"></i>
                                }
                              />
                              <span className="text" data-short={data.ShortName} data-name={data.DisplayName} data-gender={data.Gender} data-lang={data.DisplayName}>{data.DisplayName}</span>
                            </span>
                          ) : null
                        ))
                        }
                        </div>
                    }
                    <hr />{
                      DisplayName1 == "" || DisplayName1 == "undefined" && DisplayName1 == "null" ? (
                        null
                      ) : <span><div class="blocks1">
                        <span className="List1 "><i class="fa fa-user-circle-o"></i></span>
                        <span className="namedisplay ">{DisplayName1}</span>
                        <span className=" List1 user"> <button className="btn col-ply"><i class="fa fa-play" ></i></button></span>
                        {/* <i class="fa fa-pause" aria-hidden="true"></i> */}
                      </div>
                        <div class="blocks1">
                          <span className="LocaleName1 List">{LocaleName1}</span>
                          <span className="Gender1 List" >{Gender1}</span>
                          <span className="LocalName1 List">Public Voice</span>
                        </div>
                      </span>
                    }
                    {Displaystyle ? (
                      <span>
                        <select class="form-select languagechoose" id="stylespeaking" aria-label="Default select example" onChange={Speakingstyle}>
                          <option selected >Speaking Style | Default</option>
                          {
                            Displaystyle.map((data) => (
                              <option value={data}>{data}</option>
                            )
                            )
                          }
                        </select>
                      </span>
                    ) : null
                    }
                  </div>
                </Col>
              </List>
            </Collapse>
            <ListItemButton onClick={handleClick3}>
              <ListItemIcon>
                {open3 ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
              <ListItemText primary="Rate" />
              <i className="fa fa-eraser" aria-hidden="true"></i>
            </ListItemButton>
            <Collapse in={open3} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Box>
                  <FormControl fullWidth>
                    <Row>
                      <Col xs={6} md={6}>
                        <Slider
                          value={typeof value === "number" ? value : 0}
                          onChange={handleSliderChange}
                          aria-labelledby="input-slider"
                        />
                      </Col>
                      <Col xs={3} md={3}>
                        <Input
                          value={value}
                          size="small"
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          inputProps={{
                            step: 10,
                            min: 0,
                            max: 100,
                            type: "float",
                            "aria-labelledby": "input-slider",
                          }}
                        />
                      </Col>
                      <Col xs={3} md={3}>
                        {" "}
                        <Button variant="outlined" onClick={Rate} >
                          <i class="fa fa-check" aria-hidden="true"></i>
                        </Button>
                      </Col>
                    </Row>
                  </FormControl>
                </Box>
              </List>
            </Collapse>
            <ListItemButton onClick={handleClick4}>
              <ListItemIcon>
                {open4 ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
              <ListItemText primary="Pause" />
              <i className="fa fa-eraser" aria-hidden="true"></i>
            </ListItemButton>
            <Collapse in={open4} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Box>
                  <FormControl fullWidth>
                    <Row>
                      <Col xs={9} md={9}>
                        <Input
                          value={value1}
                          onChange={handleInputChange1}
                          size="small"
                          onBlur={handleBlur1}
                          inputProps={{
                            step: 10,
                            type: "number",
                            "aria-labelledby": "input-slider",
                          }
                          }
                        />
                      </Col>
                      <Col xs={3} md={3}>
                        <Button variant="outlined" onClick={Pause}>
                          <i class="fa fa-check" aria-hidden="true"></i>
                        </Button>
                      </Col>
                    </Row>
                  </FormControl>
                </Box>
              </List>
            </Collapse>
          </List>
        </Col>
      </Row>
    </Container>
  )


}