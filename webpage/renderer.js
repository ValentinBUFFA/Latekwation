const containerDiv = document.getElementById('field-container');
const mathFieldSpan = document.getElementById('math-field');


const vscode = acquireVsCodeApi();

var lastCursorPos = 0;

var MQ = MathQuill.getInterface(2);
var mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true, // configurable
    autoCommands: 'sum int sqrt pi theta lambda alpha beta gamma',
    maxDepth: 10,
    handlers: {
        edit: () => {
            /*lastCursorPos = (document.getElementsByClassName('mq-cursor')[0] === undefined) ? lastCursorPos : (document.getElementsByClassName('mq-cursor')[0].getBoundingClientRect().x - mathFieldSpan.getBoundingClientRect().x);
            console.log(lastCursorPos);*/
        },
        enter: () => {
            vscode.postMessage(({
                command: 'submitLatex',
                text: mathField.latex()
            }));
        }
    }
});
mathField.focus();

document.addEventListener('keydown', event => {
    if (event.key === 'Escape'){
        vscode.postMessage(({
            command: 'closePanel'
        }));
    }
});
containerDiv.addEventListener('click', () => {
    mathField.focus();
});

/*mathFieldSpan.addEventListener('keyup', () => {
    if (lastCursorPos - containerDiv.scrollLeft + 50 > containerDiv.offsetWidth || lastCursorPos < 50){
        containerDiv.scrollLeft = Math.max(lastCursorPos - containerDiv.offsetWidth + 50, 0);
        //console.log(containerDiv.scrollLeft);
    }
});*/