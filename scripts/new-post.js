/* This is a script to create a new post markdown file with front-matter */

import fs from "fs"
import path from "path"
import inquirer from "inquirer"
import { fileURLToPath } from 'url'

export function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     // Replace spaces with -
    .replace(/[^\w-]+/g, "")   // Remove all non-word chars
    .replace(/--+/g, "-")       // Replace multiple - with single -
    .replace(/^-+/, "")         // Trim - from start of text
    .replace(/-+$/, "")         // Trim - from end of text
}

export function generateFrontMatter(answers) {
  let frontMatter = `---
title: ${answers.title}
published: ${getDate()}
description: '${answers.description.replace(/'/g, "''")}'
image: ''
tags: [${answers.tags.map(t => `'${t}'`).join(", ")}]
category: '${answers.category}'
draft: ${answers.draft}`

  if (answers.lang) {
    frontMatter += `\nlang: '${answers.lang}'`
  }

  frontMatter += `\n---
`
  return frontMatter
}

async function createPost() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Post title:",
      validate: (input) => (input.trim() !== "" ? true : "Title is required"),
    },
    {
      type: "input",
      name: "filename",
      message: "Filename (with .md):",
      default: (answers) => `${slugify(answers.title)}.md`,
      validate: (input) => (input.trim() !== "" ? true : "Filename is required"),
    },
    {
      type: "list",
      name: "subdir",
      message: "Subdirectory:",
      choices: [
        { name: "(root)", value: "" },
        { name: "thoughts/", value: "thoughts" },
        { name: "[ New Subdirectory ]", value: "NEW" }
      ],
    },
    {
      type: "input",
      name: "newSubdir",
      message: "Enter new subdirectory name:",
      when: (answers) => answers.subdir === "NEW",
      validate: (input) => (input.trim() !== "" ? true : "Subdirectory name is required"),
    },
    {
      type: "input",
      name: "description",
      message: "Description:",
      default: "",
    },
    {
      type: "input",
      name: "tags",
      message: "Tags (comma separated):",
      default: "",
      filter: (input) => input.split(",").map(t => t.trim()).filter(t => t !== ""),
    },
    {
      type: "input",
      name: "category",
      message: "Category:",
      default: "",
    },
    {
      type: "confirm",
      name: "draft",
      message: "Is this a draft?",
      default: false,
    },
    {
      type: "input",
      name: "lang",
      message: "Language (optional, e.g. en, zh_CN):",
      default: "",
    }
  ])

  const subDir = answers.subdir === "NEW" ? answers.newSubdir : answers.subdir
  const targetDir = path.join("./src/content/posts/", subDir)
  let fileName = answers.filename
  if (!fileName.endsWith(".md") && !fileName.endsWith(".mdx")) {
    fileName += ".md"
  }
  
  const fullPath = path.join(targetDir, fileName)

  if (fs.existsSync(fullPath)) {
    console.error(`\nError: File ${fullPath} already exists`)
    return
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  const content = generateFrontMatter(answers)

  fs.writeFileSync(fullPath, content)
  console.log(`\n✅ Post created successfully at: ${fullPath}`)
}

// Only run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createPost().catch((err) => {
    if (err.isTtyError) {
      console.error("Prompt couldn't be rendered in the current environment")
    } else {
      console.error("Error creating post:", err)
    }
  })
}
