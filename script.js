window.onload = function() {
  var textarea = document.getElementById('textarea');
  var lineNumbers = document.getElementById('lineNumbers');
  var wordCountSpan = document.getElementById('wordCountValue');

  textarea.addEventListener('input', function() {
    syncLineNumbers();
    saveToLocalStorage(textarea.value);
    countWords()
  });

  function addRowTextarea() {
    var lines = document.getElementById("textarea").value.split(/\r\n|\r|\n/).length;
    document.getElementById("textarea").rows = lines;
  }

  addRowTextarea()

  textarea.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      saveAsPlainTextFile(textarea.value);
    } else if (event.ctrlKey && event.key === 'o') {
      event.preventDefault();
      openTextFile();
    }
  });

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

  function syncLineNumbers() {
    var lines = textarea.value.split('\n').length;
    var linesArr = textarea.value.split('\n');
    var lineNumbersContent = '';
    for (var i = 1; i <= lines; i++) {
      lineNumbersContent += i + '<br>';
    }
    lineNumbers.innerHTML = lineNumbersContent;
  }


  function saveToLocalStorage(text) {
    localStorage.setItem('editorText', text);
  }

  const d = new Date();
  var thisDay = d.getFullYear() % 100 + "" + ((d.getMonth() < 10) ? "0" + (d.getMonth() + 1) : (d.getMonth()  + 1)) + "" + ((d.getDate() < 10) ? "0" + d.getDate() : d.getDate()) + "-.txt";
  console.log('THISDAY', thisDay)


  var time = d.getFullYear() % 100 + "" + ((d.getMonth() < 10) ? "0" + d.getMonth() + 1 : d.getMonth()) + 1 + "" + ((d.getDate() < 10) ? "0" + d.getDate() : d.getDate()) + "/" + ((d.getHours() < 10) ? "0" + d.getHours() : d.getHours()) + ":" + ((d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes());

  function saveAsPlainTextFile(text) {
    var blob = new Blob([text + "\n" + time], {
      type: 'text/plain'
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = thisDay;
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
        syncLineNumbers(); // Update line numbers after opening the file
        countWords(); // Update word count after opening the file
        saveToLocalStorage(textarea.value); // Save changes to local storage
      };

      reader.readAsText(file);
    };

    input.click();
  }
};
