#!/usr/bin/env node

const workshopper = require('workshopper')
const path = require('path')

const fpath = (f) => path.join(__dirname, f)

workshopper({
  name: 'electron-adventure',
  title: 'Electron Adventure',
  subtitle: 'Learn how to build Electron apps',
  appDir: __dirname,
  menuItems: [],
  exerciseDir: fpath('./exercises/')
})
