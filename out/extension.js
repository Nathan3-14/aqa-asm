"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// extension.ts
const vscode = __importStar(require("vscode"));
const register_pattern = /\bR(1[0-2]|[0-9])\b/;
const number_pattern = /#[0-9]+/;
const memory_pattern = /\b[0-2]?[0-9]?[0-9]\b/;
function activate(context) {
    console.log("Extension activated");
    const collection = vscode.languages.createDiagnosticCollection("asm");
    context.subscriptions.push(collection);
    vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.languageId !== "asm")
            return;
        const diagnostics = [];
        for (let i = 0; i < doc.lineCount; i++) {
            const line = doc.lineAt(i);
            console.log(`Checking   ${line.text}'`);
            // console.log("Matching command...")
            const command = line.text.split(" ")[0];
            let args;
            let arg_indexes = [];
            const all_args = line.text.split(" ");
            if (all_args.length < 2) {
                console.log("args too short :(");
                args = [];
            }
            else {
                args = all_args.slice(1).join(" ").split(", ");
                console.log(`args good: '${args}'`);
            }
            for (let arg_index = 0; arg_index < args.length; arg_index++) {
                if (arg_index == 0) {
                    arg_indexes.push(0);
                    continue;
                }
                arg_indexes.push(arg_indexes[arg_index - 1] + args[arg_index - 1].length + 2); // old one + length of old 1 + 1 for the space and comma
            }
            let error_messages = [];
            let range_starts = [];
            let range_ends = [];
            switch (command) {
                case "ADD":
                case "SUB":
                    if (!register_pattern.test(args[0])) {
                        error_messages.push(`Argument 0 (${args[0]}) is not a valid register`);
                        range_starts.push(command.length + 1 + arg_indexes[0]);
                        range_ends.push(command.length + 1 + arg_indexes[0] + args[0].length - 1);
                    }
                    if (!register_pattern.test(args[1])) {
                        error_messages.push(`Argument 1 (${args[1]}) is not a valid register`);
                        range_starts.push(command.length + 1 + arg_indexes[1]);
                        range_ends.push(command.length + 1 + arg_indexes[1] + args[1].length - 1);
                    }
                    if (!(register_pattern.test(args[2]) || number_pattern.test(args[2]))) {
                        error_messages.push(`Argument 2 (${args[2]}) is not a valid register or number`);
                        range_starts.push(command.length + 1 + arg_indexes[2]);
                        range_ends.push(command.length + 1 + arg_indexes[2] + args[2].length - 1);
                    }
                    break;
                case "LDR":
                case "STR":
                    if (!register_pattern.test(args[0])) {
                        error_messages.push(`Argument 0 (${args[0]}) is not a valid register`);
                        range_starts.push(command.length + 1 + arg_indexes[0]);
                        range_ends.push(command.length + 1 + arg_indexes[0] + args[0].length - 1);
                    }
                    if (!memory_pattern.test(args[1])) {
                        error_messages.push(`Argument 1 (${args[1]}) is not a valid memory reference`);
                        range_starts.push(command.length + 1 + arg_indexes[1]);
                        range_ends.push(command.length + 1 + arg_indexes[1] + args[1].length - 1);
                    }
                    break;
                case "MOV":
                case "CMP":
                    if (!register_pattern.test(args[0])) {
                        error_messages.push(`Argument 0 (${args[0]}) is not a valid register`);
                        range_starts.push(command.length + 1 + arg_indexes[0]);
                        range_ends.push(command.length + 1 + arg_indexes[0] + args[0].length - 1);
                    }
                    if (!(register_pattern.test(args[1]) || number_pattern.test(args[1]))) {
                        error_messages.push(`Argument 1 (${args[1]}) is not a valid register or number`);
                        range_starts.push(command.length + 1 + arg_indexes[1]);
                        range_ends.push(command.length + 1 + arg_indexes[1] + args[1].length - 1);
                    }
                    break;
                case "INP":
                case "OUT":
                    if (!register_pattern.test(args[0])) {
                        error_messages.push(`Argument 0 (${args[0]}) is not a valid register`);
                        range_starts.push(command.length + 1 + arg_indexes[0]);
                        range_ends.push(command.length + 1 + arg_indexes[0] + args[0].length - 1);
                    }
                    if (!/2|4/.test(args[1])) {
                        error_messages.push(`Argument 1 (${args[1]}) is not a valid location (2/4)`);
                        range_starts.push(command.length + 1 + arg_indexes[1]);
                        range_ends.push(command.length + 1 + arg_indexes[1] + args[1].length - 1);
                    }
                    break;
                case "B":
                case "BEQ":
                case "BNE":
                case "BLT":
                case "BGT":
                    if (!/[A-Z]+/.test(args[0])) {
                        error_messages.push(`Argument 0 (${args[0]}) is not a valid branch name`);
                        range_starts.push(command.length + 1 + arg_indexes[0]);
                        range_ends.push(command.length + 1 + arg_indexes[0] + args[0].length - 1);
                    }
                    break;
            }
            for (let error_index = 0; error_index < error_messages.length; error_index++) {
                let error_message = error_messages[error_index];
                let range_start = range_starts[error_index];
                let range_end = range_ends[error_index];
                const diagnostic = new vscode.Diagnostic(new vscode.Range(i, range_start, i, range_end), error_message, vscode.DiagnosticSeverity.Error);
                diagnostics.push(diagnostic);
            }
            // if (error_messages !== "") {
            // }
            if (line.text.includes("TODO")) {
                const range = new vscode.Range(i, 0, i, line.text.length);
                const diagnostic = new vscode.Diagnostic(range, "Found TODO comment", vscode.DiagnosticSeverity.Warning);
                diagnostics.push(diagnostic);
            }
        }
        collection.set(doc.uri, diagnostics);
    });
}
function deactivate() { }
