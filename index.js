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
        choices: [...Object.keys(resume), lang === "pt" ? "Trocar Idioma" : "Change Language", lang === "pt" ? "Sair" : "Exit"]
    }
}

function detailPrompts(lang, option) {
  return {
    type: "list",
    pageSize: "10",
    name: "detailOptions",
    message: lang === "pt" ? "Sobre o que você gostaria de saber mais?" : "What would you like to know more about?",
    choices: [...Object.keys(option), lang === "pt" ? "Trocar Idioma" : "Change Language", lang === "pt" ? "Voltar" : "Back", lang === "pt" ? "Sair" : "Exit"]
  }
}

function main() {
  langHandler()
}

function exitBackHandler(lang, resume, option) {
  inquirer
  .prompt({
    type: "list",
    name: "exitBack",
    message: lang === "pt" ? "Voltar ou Sair?" : "Go back or Exit?",
    choices: lang === "pt" ? ["Voltar", "Sair"] : ["Back", "Exit"]
  })
  .then(choice => {
    if (choice.exitBack === "Back" || choice.exitBack === "Voltar") {
      if (option == undefined) {
        resumeHandler(lang, resume)
      } else {
        detailsHandler(lang, option, resume)
      }
    } else {
      return;
    }
  });
}

function resumeHandler(lang, resume) {
  inquirer.prompt(resumePrompts(lang, resume)).then(choice => {
    if (choice.resumeOptions === "Sair" || choice.resumeOptions === "Exit") {
        return
    }
    if (choice.resumeOptions === "Trocar Idioma" || choice.resumeOptions === "Change Language") {
      langHandler()
    } else {
      let content = choice.resumeOptions;
      if (Array.isArray(resume[`${content}`])) {
        console.log(response("--------------------------------------"));
        resume[`${content}`].forEach(info => {
          console.log(response("|   => " + info));
        });
        console.log(response("--------------------------------------"));
        exitBackHandler(lang, resume)
      } else {
        detailsHandler(lang, resume[`${content}`], resume)
      }
    }
  })
}

function detailsHandler(lang, option, resume) {
  inquirer.prompt(detailPrompts(lang, option)).then(choice => {
    if (choice.detailOptions === "Sair" || choice.detailOptions === "Exit") {
        return
    }
    if (choice.detailOptions === "Back" || choice.detailOptions === "Voltar") {
      resumeHandler(lang, resume);
    } else if (choice.detailOptions === "Trocar Idioma" || choice.detailOptions === "Change Language") {
      langHandler()
    } else {
      let content = choice.detailOptions;
      console.log(response("--------------------------------------"));
      console.log(response("|   => " + option[`${content}`]));
      console.log(response("--------------------------------------"));
      exitBackHandler(lang, resume, option)
    }
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