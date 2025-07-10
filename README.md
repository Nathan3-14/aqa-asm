# AQA Assembly (ASM)
Syntax Highlighting for the AQA Assembly Instruction set

## Features
Works on .asm, .as and .a files<br>
Keyword highlighting (ADD, SUB, CMP etc)<br>
Branches, registers, numbers and comments

(With Bearded Coffee Theme)<br>
<img src="images/example1.png" width="250px"></img>

## Todo
Add intellisense (for commands and labels)<br>
[DONE] Add checking for command args (eg ADD <u>0</u>, R2, #1 has an error)<br>
Check for lack of arguments (eg ADD R0, #1 has and error)

## Releases
### 1.0.0 (7/7/25)
Initial release
### 1.0.1 (7/7/25)
Fixed bug with branch names
### 1.0.2 (8/7/25)
Changed display name
Updated README
### 1.0.3 (9/7/25)
Added comment colouring
### 1.0.4 (9/7/25)
Fixed README
Removed redundant CHANGELOG.md
### 1.0.5 (9/7/25)
Fixed comments
Removed quickstart.md
### 1.0.6 (10/7/25)
Added argument type checking
Fixed colouring for memory addresses (002 is now valid)
