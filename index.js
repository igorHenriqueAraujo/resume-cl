#!/usr/bin/env node
"use strict"

var inquirer = require("inquirer")
var chalk = require("chalk")

var response = chalk.bold.green

var languagePrompts = {
    type: "list",
    name: "langOptions",
    message: "Escolha o idioma (Choose your language)",
    choices: ["pt", "en", "Sair (Exit)"]
}

function resumePrompts(lang, resume) {
    return {
        type: "list",
        name: "resumeOptions",
        message: lang === "pt" ? "O que você quer saber sobre mim?" : "What do you want to know about me?",
        choices: [...Object.keys(resume), lang === "pt" ? "Sair" : "Exit"]
    }
}

function main() {
    langHandler()
}

function resumeHandler(lang, resume) {
  inquirer.prompt(resumePrompts(lang, resume)).then(choice => {
    if (choice.resumeOptions === "Sair" || choice.resumeOptions === "Exit") {
        return;
    }
    let content = choice.resumeOptions;
    console.log(response("--------------------------------------"));
    resume[`${content}`].forEach(info => {
      console.log(response("|   => " + info));
    });
    console.log(response("--------------------------------------"));
    inquirer
    .prompt({
      type: "list",
      name: "exitBack",
      message: lang === "pt" ? "Voltar ou Sair?" : "Go back or Exit?",
      choices: lang === "pt" ? ["Voltar", "Sair"] : ["Back", "Exit"]
    })
    .then(choice => {
      if (choice.exitBack === "Back" || choice.exitBack === "Voltar") {
        resumeHandler(lang, resume);
      } else {
        return;
      }
    });
})
}

function langHandler() {
    inquirer.prompt(languagePrompts).then(choiceLang => {
        if (choiceLang.langOptions === "Sair (Exit)") {
            return
        }
        let option = choiceLang.langOptions
        let resume = require("./assets/resume-" + option + ".json")
        resumeHandler(option, resume)
    })
}

main()