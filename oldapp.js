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
  const [waveurl, setwaveurl] = useState('');
  const [Wavelist, SetWavelist] = useState([]);
  const [User, SetUser] = useState([]);
  const [FileName, setFileName] = useState([]);
  const [Gender1, setGender1] = useState('');
  const [LocalName1, setLocalName1] = useState('');
  const [DisplayName1, setDisplayName1] = useState('');
  const [LocaleName1, setLocaleName1] = useState('');
  const [input, setinput] = useState('');
  const [blobdata, setblobdata] = useState([]);
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
  const [value1, setValue1] = React.useState(50);
  const handleSliderChange = (event, newValue) => { setValue(newValue) };
  const [isLoaded, setIsLoaded] = useState(false);
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
    } else if (value > 100.00) {
      setValue(100.00);
    }
  };
  const handleBlur1 = () => {
    if (value1 < 0) {
      setValue1(0);
    } else if (value1 > 200.00) {
      setValue1(200.00);
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
      if (document.getElementById("textid").querySelectorAll('div').length == 2) {
        if (document.getElementById("textid").querySelectorAll('div')[1].innerHTML == "<br>" || document.getElementById("textid").querySelectorAll('div')[1].children[0].children[0].innerHTML == "<br>") {
          document.getElementById("textid").querySelectorAll('div')[1].remove();
          e.preventDefault();
          return false;
        }
      }
    }
  }
  const handleContentEditable = (e) => {
    if (e.key === 'Enter') { // 8 is backspace
      try{
        debugger;
      var docFragment = document.createDocumentFragment();
      var newEle = document.createElement('div');
      var suffixNode = "<voice class='voiceclass' data-content='' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><prosody rate=''><break time='' ></break><br/></prosody></span></voice>";
      newEle.innerHTML = suffixNode;
      docFragment.appendChild(newEle);
      if(navigator.userAgent.match(/firefox|fxios/i)){
        var range = window.getSelection().getRangeAt(0);
      }
      else{
         var range = window.getSelection().getRangeAt(0);
      }
      
      
      range.deleteContents();
       document.getElementById("textid").appendChild(docFragment);

      // range = document.createRange(); 
      //range.insertNode(suffixNode);
      //range.setStartAfter(newEle); 
      //range.setStart(newEle);
   
      // var el = document.getElementById("textid");
      // var el_length = document.getElementById("textid").childNodes.length;
      // el_length = el_length - 1;
      // range.setStart(el.childNodes[el_length], 10);

      // range.collapse(true);
      // var sel = window.getSelection(); 
      // sel.removeAllRanges(); 
      
     

      // sel.addRange(range);


      var tag = document.getElementById("textid");
              
      // Creates range object
      var setpos = document.createRange();
        
      // Creates object for selection
      var set = window.getSelection();
        var pos = 1;
      // Set start position of range
      var el_length = document.getElementById("textid").childNodes.length;
       el_length = el_length - 1;
      // range.setStart(el.childNodes[el_length], 10);
      setpos.setStart(tag.childNodes[el_length], pos);
        
      // Collapse range within its boundary points
      // Returns boolean
      setpos.collapse(true);
        
      // Remove all ranges set
      set.removeAllRanges();
        
      // Add range with respect to range object.
      set.addRange(setpos);
        
      // Set cursor on focus
      tag.focus();



      e.preventDefault();
      return false;
      }
      catch(e){
        console.log(e);
      }
     
    }
    let div_length = document.getElementById("textid").querySelectorAll('div').length;
    if (div_length > 1) {
      let length1 = div_length - 1;
      let length2 = div_length - 2;
      if (document.getElementById("textid").querySelectorAll('div')[length2].firstChild.attributes[1].nodeValue) {
        let val1 = document.getElementById("textid").querySelectorAll('div')[length2].firstChild.attributes[1].nodeValue;
        if (val1 == "") {
          document.getElementById("textid").querySelectorAll('div')[length1].innerHTML = "<voice class='voiceclass' data-content='[JennyMultilingualNeural]' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><prosody rate=''><break time='' ></break><br/></prosody></span></voice>";
        }
        else {
          try {
            if (typeof document.getElementById("textid").querySelectorAll('div')[length1].childNodes[0].attributes[1] == 'undefined') {
              document.getElementById("textid").querySelectorAll('div')[length1].innerHTML = "<voice class='voiceclass' data-content='[JennyMultilingualNeural]' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><prosody rate=''><break time='' ></break><br/></prosody></span></voice>";
            }
            else {
              if (document.getElementById("textid").querySelectorAll('div')[length1].childNodes[0].attributes[1].nodeValue == "") {
                document.getElementById("textid").querySelectorAll('div')[length1].childNodes[0].attributes[1].nodeValue = val1;
              }
              if (document.getElementById("textid").querySelectorAll('div')[length1].innerHTML == "<br>") {
                document.getElementById("textid").querySelectorAll('div')[length1].innerHTML = "<voice class='voiceclass' data-content='[JennyMultilingualNeural]' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><prosody rate=''><break time='' ></break><br/></prosody></span></voice>";
              }
            }
          }
          catch (e) { }
        }
      }
      if (document.getElementById("textid").querySelectorAll('div')[length2].firstChild.attributes[1].nodeValue == "" && (document.getElementById("textid").querySelectorAll('div')[length1].children[0].children[0].innerHTML.length < 1 || document.getElementById("textid").querySelectorAll('div')[length1].children[0].children[0].innerHTML == "<br>")) {
        document.getElementById("textid").querySelectorAll('div')[length1].innerHTML = "<voice class='voiceclass' data-content='[JennyMultilingualNeural]' name='en-US-ChristopherNeural' Gender='Male'><span  class='text-node'><prosody rate=''><break time='' /><br/></prosody></span></voice>";
      }
      try {
        if (window.getSelection().anchorNode.parentElement.parentNode.attributes[1].value == "") {
          window.getSelection().anchorNode.parentElement.parentNode.attributes[1].value = "[JennyMultilingualNeural]";
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  }
  // ################################## Ssml to Voice  ########################## 
  const playsound = (event) => {
    var nameewe = document.getElementsByClassName('text-node').length < 1;
    console.log("nameewe", nameewe)
    var name = document.getElementById('stylespeaking');
    var newHTMLSSML = '';
    try {
      if (document.getElementById("textid").querySelectorAll('div').length > 0) {
        let divlength = document.getElementById("textid").querySelectorAll('div').length;
        for (let index = 0; index < divlength; index++) {

          let data_content = document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].childNodes[0].attributes[0].name;
          if (document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].innerHTML.includes("last-data")) {
            let data_content_val = document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].attributes[0].nodeValue;
            data_content_val = data_content_val.replaceAll('[', '');
            data_content_val = data_content_val.replaceAll(']', '');
            let newHTML = document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].outerHTML.replaceAll('</span>', '</mstts:express-as><s />');
            newHTMLSSML += newHTML;
          }
          else {
            let newHTML2 = document.getElementById("textid").querySelectorAll('div')[index].innerHTML;
            newHTMLSSML += newHTML2;
          }

        }
      }
    }
    catch (e) {
      console.log("error speaking style", e);
    }
    var innertext21 = document.getElementById('textid').innerHTML;
    var data = document.getElementById('textid').value;
    console.log("data", data)
    var str = innertext21;
    str = newHTMLSSML;
    str = str.replaceAll('<span class="text-node">', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('</div>', '');
    str = str.replaceAll('<div>', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('<br>', '');
    str = str.replaceAll('class="voiceclass"', '');
    str = str.replaceAll('[', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll('<span class="Pauseclass">', '');
    str = str.replaceAll('&nbsp;', ' ');
    str = str.replaceAll(`<span data-content="" last-data="" class="text-node">`, ``);
    str = str.replaceAll(`class="`, ``);
    str = str.replaceAll(`" data-name`, ``);
    str = str.replaceAll(`rate="`, `rate="+`);
    str = str.replaceAll(`rate"`, ``);
    str = str.replaceAll(`span data-content=""`, ``);
    str = str.replaceAll(`< text-node">`, ``);
    str = str.replaceAll(`text-node" `, ``);
    str = str.replaceAll(`</span>`, ``);
    str = str.replaceAll(`<span data-content="`, `<s /><mstts:express-as style="`);
    str = str.replaceAll(`<prosody rate="+">`, ``);
    str = str.replaceAll(`<prosody " rate="+">`, ``);
    str = str.replaceAll(`last-data="</>"`, ``);
    str = str.replaceAll('<prosody " rate="+"></prosody>', '');
    str = str.replaceAll('< last-data="">', '');
    str = str.replaceAll('<s /><mstts:express-as style="" last-data="">', '');
    str = str.replaceAll('<break time=""></break>', '');
    if (value == 30) {
      str = str.replaceAll('</prosody>', '');
    }
    else {
    }
    var closetagBefore = '<speak  xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">';
    var startAftertag = '</speak>';
    var startAftertagfe = str;
    var textdata = closetagBefore + startAftertagfe + startAftertag;
    let date = textdata
    console.log("date", date)
    setIsLoaded(true);
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
        setblobdata(blob)
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
    var nameewe = document.getElementsByClassName('text-node').length < 1;
    console.log("nameewe", nameewe)
    var name = document.getElementById('stylespeaking');
    var newHTMLSSML = '';
    try {
      if (document.getElementById("textid").querySelectorAll('div').length > 0) {
        let divlength = document.getElementById("textid").querySelectorAll('div').length;
        for (let index = 0; index < divlength; index++) {
          let data_content = document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].childNodes[0].attributes[0].name;
          if (document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].innerHTML.includes("last-data")) {
            let data_content_val = document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].attributes[0].nodeValue;
            data_content_val = data_content_val.replaceAll('[', '');
            data_content_val = data_content_val.replaceAll(']', '');
            let newHTML = document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].outerHTML.replaceAll('</span>', '</mstts:express-as><s />');
            newHTMLSSML += newHTML;
          }
          else {
            let newHTML2 = document.getElementById("textid").querySelectorAll('div')[index].innerHTML;
            newHTMLSSML += newHTML2;
          }

        }
      }
    }
    catch (e) {
      console.log("error speaking style", e);
    }
    var innertext21 = document.getElementById('textid').innerHTML;
    var data = document.getElementById('textid').value;
    console.log("data", data)
    var str = innertext21;
    str = newHTMLSSML;
    str = str.replaceAll('<span class="text-node">', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('</div>', '');
    str = str.replaceAll('<div>', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('<br>', '');
    str = str.replaceAll('class="voiceclass"', '');
    str = str.replaceAll('[', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll('<span class="Pauseclass">', '');
    str = str.replaceAll('&nbsp;', ' ');
    str = str.replaceAll(`<span data-content="" last-data="" class="text-node">`, ``);
    str = str.replaceAll(`class="`, ``);
    str = str.replaceAll(`" data-name`, ``);
    str = str.replaceAll(`rate="`, `rate="+`);
    str = str.replaceAll(`rate"`, ``);
    str = str.replaceAll(`span data-content=""`, ``);
    str = str.replaceAll(`< text-node">`, ``);
    str = str.replaceAll(`text-node" `, ``);
    str = str.replaceAll(`</span>`, ``);
    str = str.replaceAll(`<span data-content="`, `<s /><mstts:express-as style="`);
    str = str.replaceAll(`<prosody rate="+">`, ``);
    str = str.replaceAll(`<prosody " rate="+">`, ``);
    str = str.replaceAll(`last-data="</>"`, ``);
    str = str.replaceAll('<prosody " rate="+"></prosody>', '');
    str = str.replaceAll('< last-data="">', '');
    str = str.replaceAll('<s /><mstts:express-as style="" last-data="">', '');
    str = str.replaceAll('<break time=""></break>', '');
    if (value == 30) {
      str = str.replaceAll('</prosody>', '');
    }
    else {
    }
    // ##################################  ssml Convert  ########################## 
    var closetagBefore = '<speak  xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">';
    var startAftertag = '</speak>';
    var startAftertagfe = str;
    var textdata = closetagBefore + startAftertagfe + startAftertag;
    setwithoutbrak(textdata)
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
    debugger;
    var name = document.getElementById('textid').value;
    console.log("namedata", name)
    var name = event.currentTarget.children[1].dataset.name;
    var gender = event.currentTarget.children[1].dataset.gender;
    var lang = event.currentTarget.children[1].dataset.lang;
    var short = event.currentTarget.children[1].dataset.short;
    var sel = window.getSelection();
    if(navigator.userAgent.match(/firefox|fxios/i)){

      sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("voice")[0].setAttribute("data-content", "[" + name + "]");
      sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("voice")[0].setAttribute("name", "" + short + "");
      sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("voice")[0].setAttribute("Gender", "" + gender + "");

    }
    else{
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("voice")[0].setAttribute("data-content", "[" + name + "]");
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("voice")[0].setAttribute("name", "" + short + "");
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("voice")[0].setAttribute("Gender", "" + gender + "");
    }
  };
  // ##################################   Rate  ########################## 
  const Rate = (event) => {
    var name = document.getElementsByClassName('text-node').value;
    var sel = window.getSelection();
    console.log("sel", sel)
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("prosody")[0].setAttribute("rate", + value + ".00%");
    sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("prosody")[0].setAttribute("class", 'rate');
  }
  // ##################################  Pause  ########################## 
  const Pause = (event) => {
    var name = event.currentTarget.innerText;
    if (value1 == 0 || value1 == '' || value1 == null && value1 == undefined) {
      var sel = window.getSelection();
      console.log("sel", sel)
      sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("break")[0].setAttribute("time", "");
    }
    else {
      var sel = window.getSelection();
      console.log("sel", sel)
      sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("break")[0].setAttribute("time", "[" + value1 + "ms" + "]");
    }
  };
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
    if (name == '' || name == null && name == undefined) {
      var sel = window.getSelection();
      console.log("sel", sel)
      sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("span")[0].setAttribute("data-content", "");
      sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("span")[0].setAttribute("last-data", "");
    }
    else {
      var sel = window.getSelection();
      console.log("sel", sel)
      sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("span")[0].setAttribute("data-content", "[" + name + "]");
      sel.getRangeAt(0).commonAncestorContainer.parentNode.parentNode.parentNode.getElementsByTagName("span")[0].setAttribute("last-data", "</>");
    }
  }
  const Savedata = (e) => {
    var nameewe = document.getElementsByClassName('text-node').length < 1;
    console.log("nameewe", nameewe)
    var name = document.getElementById('stylespeaking');
    var newHTMLSSML = '';
    try {
      if (document.getElementById("textid").querySelectorAll('div').length > 0) {
        let divlength = document.getElementById("textid").querySelectorAll('div').length;
        for (let index = 0; index < divlength; index++) {
          let data_content = document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].childNodes[0].attributes[0].name;
          if (document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].innerHTML.includes("last-data")) {
            let data_content_val = document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].attributes[0].nodeValue;
            data_content_val = data_content_val.replaceAll('[', '');
            data_content_val = data_content_val.replaceAll(']', '');
            let newHTML = document.getElementById("textid").querySelectorAll('div')[index].childNodes[0].outerHTML.replaceAll('</span>', '</mstts:express-as><s />');
            newHTMLSSML += newHTML;
          }
          else {
            let newHTML2 = document.getElementById("textid").querySelectorAll('div')[index].innerHTML;
            newHTMLSSML += newHTML2;
          }

        }
      }
    }
    catch (e) {
      console.log("error speaking style", e);
    }
    var innertext21 = document.getElementById('textid').innerHTML;
    var data = document.getElementById('textid').value;
    console.log("data", data)
    var str = innertext21;
    str = newHTMLSSML;
    str = str.replaceAll('<span class="text-node">', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('</div>', '');
    str = str.replaceAll('<div>', '');
    str = str.replaceAll('<div id="voicessml">', '');
    str = str.replaceAll('<br>', '');
    str = str.replaceAll('class="voiceclass"', '');
    str = str.replaceAll('[', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll(']', '');
    str = str.replaceAll('<span class="Pauseclass">', '');
    str = str.replaceAll('&nbsp;', ' ');
    str = str.replaceAll(`<span data-content="" last-data="" class="text-node">`, ``);
    str = str.replaceAll(`class="`, ``);
    str = str.replaceAll(`" data-name`, ``);
    str = str.replaceAll(`rate="`, `rate="+`);
    str = str.replaceAll(`rate"`, ``);
    str = str.replaceAll(`span data-content=""`, ``);
    str = str.replaceAll(`< text-node">`, ``);
    str = str.replaceAll(`text-node" `, ``);
    str = str.replaceAll(`</span>`, ``);
    str = str.replaceAll(`<span data-content="`, `<s /><mstts:express-as style="`);
    str = str.replaceAll(`<prosody rate="+">`, ``);
    str = str.replaceAll(`<prosody " rate="+">`, ``);
    str = str.replaceAll(`last-data="</>"`, ``);
    str = str.replaceAll('<prosody " rate="+"></prosody>', '');
    str = str.replaceAll('< last-data="">', '');
    str = str.replaceAll('<s /><mstts:express-as style="" last-data="">', '');
    str = str.replaceAll('<break time=""></break>', '');
    if (value == 30) {
      str = str.replaceAll('</prosody>', '');
    }
    else {
    }
    // ##################################  ssml Convert  ########################## 
    var closetagBefore = '<speak  xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">';
    var startAftertag = '</speak>';
    var startAftertagfe = str;
    var textdata = closetagBefore + startAftertagfe + startAftertag;
    let date = textdata;
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
        setblobdata(blob)
        var blob = new Blob([blob]);
        var url = window.URL.createObjectURL(blob);
        setwaveurl(url)
      })
      .catch(() => {
      })
    let datavoice = {
      ssml: textdata,
      Voicetext: innertext21, Wave: waveurl, FileName: FileName
    }
    fetch("https://158.69.73.50/app/tts_recordings/recording_api.php", {
      method: 'POST',
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        Origin: "https://158.69.73.50",
      }, body: JSON.stringify(datavoice)
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("data", data);

      })
      .catch((error) => {
        console.log("error", error);
      })
  }
  function refreshPage() {
    window.location.reload();
  }
  useEffect(() => {
    fetch(
      "https://158.69.73.50/app/tts_recordings/recording_api.php",
      {
        method: "GET",
        headers: {
          "cache-control": "no-cache",
        }
      })
      .then((response) => response.json())
      .then((data) => {
        SetWavelist(data);
        console.log("mydata", data);
      })
      .catch((err) => {
        console.log("myerr", err);
      })
  }, [])
  const Viewdata = (data) => {

    setFileName(data.recording_filename)
    try{
    document.getElementById("textid").innerHTML = data.recording_text;
    document.getElementById("textareassml").value  = data.recording_ssml;
    }
    catch(e){
      console.log(e);
    }
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
            <br></br>
            <label>File Name </label>
            <div class="inputWithIcon inputIconBg">
              <input type="text" value={FileName} onChange={e => setFileName(e.target.value)} />
              <i class="" aria-hidden="true">.txt</i>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={Savedata}>Save</Button>
          <Button onClick={refreshPage} autoFocus>
            Leave
          </Button>
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
              {
                Wavelist.map((data) => (
                  <Dropdown.Item href="#"  onClick={() => Viewdata(data)}>
                    <i class="fa fa-file-text-o" ></i>  
                    {data.recording_filename}
                 
                  </Dropdown.Item>
                )
                )
              }
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
                <span data-content='' class="text-node" >
                  <prosody class='' rate=''> <break time='' />
                    <br /></prosody></span>
              </voice>
            </div>

          </div>
          <TextareaAutosize
            aria-label="empty textarea"
            className={ssmlEditer}
            placeholder="Empty"
            onChange={(e) => setinput(e.target.value)}
            value={withoutbrak}
            style={{ width: '100%', height: 500 }}
            id="textareassml"
          />
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
                          <option selected value=''>Speaking Style | Default</option>
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
                            type: "number",
                            "aria-labelledby": "input-slider",
                          }
                          }
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
                            step: 50,
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