window.onload = function() {
  var textarea = document.getElementById('textarea');
  var lineNumbers = document.getElementById('lineNumbers');
  var wordCountSpan = document.getElementById('wordCountValue');
  var terminal = document.getElementById('terminal');
  var msgterminal = document.getElementById('msgterminal');
  addRowTextarea()

  textarea.addEventListener('input', function() {
    syncLineNumbers();
    saveToLocalStorage(textarea.value);
    countWords()
  });

  function addRowTextarea() {
    var lines = document.getElementById("textarea").value.split(/\r\n|\r|\n/).length;
    document.getElementById("textarea").rows = lines;
  }

  function countWords() {
    const segmenterTh = new Intl.Segmenter('th', { granularity: 'word' });
    var words = [...segmenterTh.segment(textarea.value)].filter((segment) => segment.isWordLike).length
    wordCountSpan.innerHTML = words ;
  }

  var savedText = localStorage.getItem('editorText');
  if (savedText) {
    textarea.value = savedText;
  }
  syncLineNumbers();
  countWords()

//split value from textarea
  function syncLineNumbers() {
    var lines = textarea.value.split('\n').length;
    var lineNumbersContent = '';
    for (var i = 1; i <= lines; i++) {
      lineNumbersContent += i + '<br>';
    }
    lineNumbers.innerHTML = lineNumbersContent;
  }

  textarea.addEventListener('keydown', function(event) {
       // Check if Ctrl (or Command on Mac) + L is pressed
       if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
           event.preventDefault(); // Prevent default behavior (e.g., opening "Find" dialog)

           const startPos = textarea.selectionStart;
           const endPos = textarea.selectionEnd;
           console.log('ENDPOS', endPos)

           // Find the start of the current line
           let lineStart = startPos;
           while (lineStart > 0 && textarea.value[lineStart - 1] !== '\n') {
               lineStart--;
           }

           // Find the end of the current line
           let lineEnd = endPos;
           while (lineEnd < textarea.value.length && textarea.value[lineEnd] !== '\n') {
               lineEnd++;
           }

           // Select the current line
           textarea.setSelectionRange(lineStart, lineEnd);
       }
   });

   textarea.addEventListener('keydown', function(event) {
        let lineNum = textarea.value.split("\n")
        //หา index ของ cuser ว่า active อยู่ line ใด
        //หา length ของทั้งหมด
        //หาตำแหน่งของ \n ว่าอยู่ตำแหน่งใดบ้าง
        console.log(textarea.value.match(new RegExp("\n", "g")).length);

        //เปลี่ยน index ของอาร์เรย์

        //รันเมื่อกด Ctrl + ArrowUp ^
        if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowUp') {
            event.preventDefault();
            console.log(lineNum);

        }
    });

  function saveToLocalStorage(text) {
    localStorage.setItem('editorText', text);
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
      msgterminal.innerHTML = ""
      terminal.focus()
    } else if (event.key === "Tab") {
      event.preventDefault()
      msgterminal.innerHTML = ""
      textarea.focus()
    }
  });

//terminal messege
  terminal.addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
      if (terminal.value === "s") {
        saveAsPlainTextFile(textarea.value)
        msgterminal.innerHTML = "file saved"
        terminal.value = ""
      } else if (terminal.value === "o") {
        msgterminal.innerHTML = "file opening..."
        terminal.value = ""
        openTextFile();
      } else if (terminal.value === "h") {
        msgterminal.innerHTML = "Txteditor in your browser<br>**************************<br>o -- open file<br>s -- save file<br>h -- help messege<br>**************************<br>shortcut-key<br>Ctrl+l select content in current line<br>Esc focus the command input/clear messege"
        terminal.value = ""
      } else {
        if (terminal.value !== "") {
          msgterminal.innerHTML = terminal.value + " : not found"
          terminal.value = ""
        } else {
          msgterminal.innerHTML = terminal.value + "type for \"h\" help messege"
        }
      }
    }
  });

  const d = new Date();
  var thisDay = d.getFullYear() % 100 + "" + ((d.getMonth() < 10) ? "0" + (d.getMonth() + 1) : (d.getMonth()  + 1)) + "" + ((d.getDate() < 10) ? "0" + d.getDate() : d.getDate());

  var time = "/" + ((d.getHours() < 10) ? "0" + d.getHours() : d.getHours()) + ":" + ((d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes());

  function saveAsPlainTextFile(text) {
    var titleName = text.split("\n")
    var blob = new Blob([text + "\n" + thisDay + time], {
      type: 'text/plain'
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = thisDay + "-" + titleName[0] + ".txt";
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function openTextFile() {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = function(event) {
      var file = event.target.files[0];
      var reader = new FileReader();

      reader.onload = function() {
        textarea.value = reader.result;
        syncLineNumbers();
        countWords();
        saveToLocalStorage(textarea.value);
      };
      reader.readAsText(file);
    };

    input.click();
  }
};
