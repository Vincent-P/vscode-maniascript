/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
	Trace
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {

	const command = context.asAbsolutePath(path.join('server', './manialsp.exe'));

	let serverOptions: ServerOptions = {
		run: { command },
		debug: { command },
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'maniascript' }],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher('**/*.Script.txt')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'manialsp',
		'Maniscript LSP',
		serverOptions,
		clientOptions,
		true
	);

	client.trace = Trace.Verbose;

	// Start the client. This will also launch the server
	client.start();

	console.log("Start client from extension.");
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
