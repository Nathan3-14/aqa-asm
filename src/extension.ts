import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {{
    const collection = vscode.languages.createDiagnosticCollection("aqa-asm");
    context.subscriptions.push(collection);

    vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.languageId !== "aqa-asm") return;

        const diagnostics: vscode.Diagnostic[] = [];

        for (let i=0; i<doc.lineCount; i++) {
            const line = doc.lineAt(i);
            if (line.isEmptyOrWhitespace || line.text.startsWith("//")) {
                continue;
            }

            if (line.text.startsWith("ADD")) {
                if (line.text.split(",").length !== 3) {
                    const range = new vscode.Range(i, 0, i, line.text.length)
                    const diagnostic = new vscode.Diagnostic(
                        range,
                        "Command does not have correct number of args (3)",
                        vscode.DiagnosticSeverity.Error
                    );
                    diagnostics.push(diagnostic);
                }

            }
        }
        collection.set(doc.uri, diagnostics)
    });
}}

export function deactivate() {}
