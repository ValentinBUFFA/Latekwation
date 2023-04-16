// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "latekwation" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand('latekwation.typeEquation', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			const panel = vscode.window.createWebviewPanel('latekwa','LateKwation',vscode.ViewColumn.Two,{
				//localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'webpage'))],
				enableScripts: true,
				retainContextWhenHidden: true
			});
			//vscode.commands.executeCommand('workbench.action.moveEditorToBelowGroup');
			//CSS and js files for webview content
			const mqcssURI =  panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'webpage','mathquill-desmos','mathquill.css')));
			const mqjsURI = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'webpage','mathquill-desmos','mathquill.js')));
			const cssURI = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'webpage','index.css')));
			const jsURI = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'webpage','renderer.js')));
			const toolkitURI = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'node_modules','@vscode','webview-ui-toolkit','dist','toolkit.js')));
			//const toolcssURI = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'node_modules','@vscode','webview-ui-toolkit','dist','toolkit.css')));
			

			panel.webview.html = getWebviewContent(mqcssURI, mqjsURI, cssURI, jsURI, toolkitURI);

			panel.webview.onDidReceiveMessage(
				message => {
					switch(message.command) {
						case 'submitLatex':
							console.log(message.text);
							vscode.env.clipboard.writeText(message.text);
							panel.dispose();
						case 'closePanel':
							panel.dispose();
					}
				}
			);
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent( mqcssuri:vscode.Uri, mqjsuri:vscode.Uri, cssuri:vscode.Uri, jsuri:vscode.Uri, toolkitURI:vscode.Uri) {
	return `
	<!DOCTYPE html>
	<html>
	  <head>
	  <link rel="stylesheet" href="${mqcssuri}"/>
	  <link rel="stylesheet" href="${cssuri}"/>
	  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
	  <script src="${mqjsuri}"></script>
	  <script type="module" src="${toolkitURI}"></script>
	  </head>

	  <body>
		<div id="field-container">
			<p></p>
			<span id="math-field"></span>
		</div>
		<vscode-badge></vscode-badge>
		<vscode-button>button</vscode-button>
		<script src="${jsuri}"></script>
	<body/>
</html>
`;
}