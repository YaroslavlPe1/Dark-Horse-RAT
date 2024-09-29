const textarea = document.getElementById('code');
const downloadBtn = document.getElementById('downloadBtn');
const runBtn = document.getElementById('runBtn');
const terminal = document.getElementById('terminal');
const codeBlocks = document.querySelectorAll('.code-block');

codeBlocks.forEach(block => {
    block.addEventListener('click', () => {
        const code = block.getAttribute('data-code').replace(/\\n/g, '\n'); // Заменяем \n на реальные переносы строк
        insertCode(code);
    });
});

function insertCode(code) {
    const cursorPosition = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPosition);
    const textAfter = textarea.value.substring(cursorPosition);
    textarea.value = textBefore + code + textAfter;
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + code.length;
}

downloadBtn.addEventListener('click', () => {
    const blob = new Blob([textarea.value], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'code.js';
    link.click();
});

runBtn.addEventListener('click', () => {
    terminal.innerText = ''; // Очищаем терминал перед выполнением
    const code = textarea.value;

    // Создаем новый <script> элемент
    const script = document.createElement('script');
    script.textContent = code;

    // Перехватываем вывод консоли
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        const output = args.join(' ');
        terminal.innerText += output + '\n'; // Добавляем вывод в терминал
        originalConsoleLog.apply(console, args); // Выводим в консоль
    };

    // Запускаем код
    try {
        eval(code); // Выполняем код
    } catch (e) {
        terminal.innerText += 'Ошибка: ' + e.message + '\n'; // Вывод ошибки в терминал
    }

    // Возвращаем оригинальный console.log
    console.log = originalConsoleLog;
});
