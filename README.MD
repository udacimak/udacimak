# Udacimak - A Udacity Nanodegree Downloader


[![npm version](https://img.shields.io/npm/v/udacimak.svg)](https://www.npmjs.com/package/udacimak)
[![Downloads](https://img.shields.io/npm/dt/udacimak.svg)](https://www.npmjs.com/package/udacimak)
[![Github stars](https://img.shields.io/github/stars/udacimak/udacimak.svg?style=social&label=Stars)](https://github.com/udacimak/udacimak/stargazers)
[![License](https://img.shields.io/npm/l/udacimak.svg)](https://github.com/udacimak/udacimak/blob/master/LICENSE)
[![Commits to be deployed](https://img.shields.io/github/commits-since/udacimak/udacimak/v1.6.5.svg)](https://github.com/udacimak/udacimak/commits/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/udacimak/udacimak/blob/master/CONTRIBUTING.MD)

[![Opened issues](https://img.shields.io/github/issues-raw/udacimak/udacimak.svg)](https://github.com/udacimak/udacimak/issues)
[![Closed issues](https://img.shields.io/github/issues-closed-raw/udacimak/udacimak.svg)](https://github.com/udacimak/udacimak/issues?q=is%3Aissue+is%3Aclosed)
[![Opened pull requests](https://img.shields.io/github/issues-pr-raw/udacimak/udacimak.svg)](https://github.com/udacimak/udacimak/pulls)
[![Closed pull requests](https://img.shields.io/github/issues-pr-closed-raw/udacimak/udacimak.svg)](https://github.com/udacimak/udacimak/pulls?q=is%3Apr+is%3Aclosed)
[![Github last commit](https://img.shields.io/github/last-commit/udacimak/udacimak.svg)](https://github.com/udacimak/udacimak/commits/master)


## Table of Contents

- [Udacimak - A Udacity Nanodegree Downloader](#udacimak---a-udacity-nanodegree-downloader)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Instructions](#instructions)
  - [Reporting Issues](#reporting-issues)
  - [User Privacy](#user-privacy)
  - [Disclaimer](#disclaimer)

## Description

Udacimak is a command-line interface tool to download
[Udacity](udacity.com) Nanodegree contents and keep them locally
on your computer.

Udacimak downloads all videos, images, text contents and present them as local
web pages in a similar manner to Udacity classroom website.

Udacimak was inspired after Udacity announced in October 2018 that students who
graduate will no longer have life-time access to the course content.

If you want to keep the contents to yourself, Udacimak is built for you;
or if you would like to have a local copy to quickly revise the lessons while
doing the course, Udacimak is also a good option.

We hope you enjoy this downloader.

__Stay Udacious__!

If you find this CLI helpful, please support the developers by starring this
repository.

__Resources:__
- [How long will I have access to Nanodegree program content after I graduate? (Udacity Support)](https://udacity.zendesk.com/hc/en-us/articles/360015665011-How-long-will-I-have-access-to-Nanodegree-program-content-after-I-graduate-)

## Instructions

Please refer to the [Wiki page](https://github.com/udacimak/udacimak/wiki) for all instructions.

## Reporting Issues

Before reporting any issues, please make sure you're using the latest version
of Udacimak first:

```shell
# show current version
npm list udacimak
# or
udacimak --version

# update udacimak
npm install -g udacimak

# check current version
udacimak --version
```

If the issue persists, please open issue in
[__Issues__ tab](https://github.com/udacimak/udacimak/issues).
Please give us as much information as you can.
However, note that you should not provide
your Udacity authentication token to anyone - it's a secret token of your
own account.

## User Privacy

Since you will have to provide the secret Udacity authentication token for the
CLI to work, the CLI does have access to your personal information via Udacity
API, including name, email address, graduated/enrolled nanodegrees, etc.
The token is saved in the CLI config, located at:

```
# for Linux
~/.udacimak

# for Windows
%USERPROFILE%/.udacimak
```

However, these details are only used internally in the app to serve its
functionalities. None of your personal details, as well as the secret
authentication token, will be sent to anybody else.

## Disclaimer

This CLI is provided to help you download Udacity Nanodegrees and
courses for personal use only.
Sharing the content of your subscribed Nanodegrees and courses is
strictly prohibited under Udacity's Terms of Use.

By using this CLI, the developers of this CLI are not responsible for any
law infringement caused by the users of this CLI.

__Resources:__
- [Udacity Terms of Use](https://www.udacity.com/legal/terms-of-use)
