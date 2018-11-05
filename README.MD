# Udacimak - the Ultimate Udacity Nanodegree and Course Downloader

## Table of Contents

- [Description](#description)
- [Disclaimer](#disclaimer)
- [Development Experience](#development-experience)
- [Breaking Changes from Udacity API](#breaking-changes-from-udacity-api)
- [Installation](#installation)
- [How to use](#how-to-use)
- [Note to Windows OS Users](#note-to-windows-os-users)
- [Reporting Issues](#reporting-issues)
- [User Privacy](user-privacy)

## Description
`udacimak` is a command-line interface written to download
[Udacity](udacity.com) Nanodegree or course contents to store them locally.

It was inspired after Udacity announced in October 2018 that students who
graduate will no longer have life-time access to the course content. Instead,
all access will be removed 12 months after graduation date. There are also cases
where access to content will be removed immediately after graduation (eg. if
you're an Enterprise or Scholarship student, etc.)

If you want to keep the contents to yourself, `udacimak` is built for you.
Or if you would like to have a local copy to quickly revise the lessons while
doing the course, `udacimak` is also a good option.

We hope you enjoy this CLI. __Stay Udacious__!

__Resources__
- [How long will I have access to Nanodegree program content after I graduate? (Udacity Support)](https://udacity.zendesk.com/hc/en-us/articles/360015665011-How-long-will-I-have-access-to-Nanodegree-program-content-after-I-graduate-)

## Disclaimer

This CLI is provided to help you download Udacity Nanodegrees and
courses for personal use only.
Sharing the content of your subscribed Nanodegrees and courses is
strictly prohibited under Udacity's Terms of Use.

By using this CLI, the developers of this CLI are not responsible for any
law infringement caused by the users of this CLI.

__Resources:__
- [Udacity Terms of Use](https://www.udacity.com/legal/terms-of-use)

## Development Experience

Unlike other course downloaders (Udemy/edX/etc downloaders), building a
downloader for Udacity courses is not as straightforward.
Downloading Udemy, edX, etc. only requires downloading videos and a few
accompanying text contents.

Udacity is different.
Udacity content relies on various number of resources and format, including
video, text content, some types of quizzes, workspace, etc.
We can't build a downloader for a few of those content types.
These include different types of workspaces, programming quiz solutions.

This means that it is NOT possible to build a downloader that can get 100% all
the Udacity resources onto your computer. We have to live with this.

But we believe that what we have done is still of great value to fellow
students.

## Breaking Changes from Udacity API
Because of the complexity of the course structure, the CLI is error prone to
changes being made in Udacity API.
Beware that changes in Udacity API can potentially only be obviously seen in a
newly released Nanodegree and the developers of this CLI can't update it unless
they have access to the new Nanodegree. In this case, please contact directly
to help us keep the CLI stable and usable.

Please open an issue in __Issues__ tab to help us keep the CLI
up-to-date if you face any issues using the CLI.

### CLI Update Note

When Udacimak is updated to a newer version, it may contain new rendering
features. In this case, you would want to run the render process again.
It should take a few seconds per Nanodegree/course because the CLI doesn't
re-download online media files when re-render a course.
Also see [note below](#re-rendering-a-course)

## Installation

1. Make sure you have `node` and `npm` installed.
1. Run:

  ```
  npm install -g udacimak
  ```

### Windows users and `youtube-dl`
If you're using Windows, you may experience error thrown when the CLI tries
to download Youtube videos. To fix the issue, please head to
[youtube-dl Homepage](https://rg3.github.io/youtube-dl/), download the latest
version of the `youtube-dl.exe` file and put it in this path:

```
%USERPROFILE%\AppData\Roaming\npm\node_modules\udacimak\node_modules\youtube-dl\bin
```

Note that the path `%USERPROFILE%\AppData\Roaming\npm\node_modules` is an
example of where `node` will install global `npm` packages on Windows 7, 8 and
10.

Note that `youtube-dl.exe` requires
__Microsoft Visual C++ 2010 Redistributable Package (x86)__ to be installed.
(See link to download on
[youtube-dl Homepage](https://rg3.github.io/youtube-dl/))

## How to use

`udacimak` allows you to keep Udacity content locally in 2 main steps:
1. __Download__: Download means fetching all JSON data of a course or Nanodegree
from Udacity API and store them locally as `.json` files.
1. __Render__: Render means converting the downloaded course JSON data into
"readable" files. It will download all videos, images and render all contents
into HTML files. You will use these HTML files to view the materials on your
computer.

_Please read further instruction below for detailed usage._

### Contents
- [`settoken`: Set Udacity Authentication Token](#settoken-set-udacity-authentication-token)
- [`listnd`: List your Nanodegree keys](#listnd-list-your-nanodegree-keys)
- [`download`: Download course content as JSON data from Udacity API](#download-download-course-content-as-JSON-data-from-udacity-api)
- [`render`: Render downloaded JSON course contents](#render-render-downloaded-json-course-contents)
- [Log Files](#log-files)
- [Note to Windows OS users](#note-to-windows-os-users)

### `settoken`: Set Udacity Authentication Token
First, your __Udacity authentication token__
(officially called __JSON Web Tokens (JWT)__)
should be configured so that the
cli can download course contents from Udacity API:

```shell
udacimak settoken YOUR_UDACITY_AUTH_TOKEN
```

![settoken Example][example-settoken]

Udacity authentication token can be found in Udacity website browser _cookies_.
To get your Udacity authentication, follow these steps:
1. Visit classroom.udacity.com and log in
1. Open the __Developer Tools__ (press `Cmd + Opt + J` on MacOS or `F12` on Windows)
1. Go to __Application__ tab, then __Storage > Cookies >
`https://classroom.udacity.com`__.
1. Find `_jwt` key, its __Value__ is the __Udacity authentication token__.

Alternatively, copy the Javascript code below in the __Console__ in
__Developer Tools__, it will get the token and copy it to _clipboard_ for you:

```js
/**
 * Retrieve cookie by name
 **/
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// get jwt and copy to clipboard
copy(getCookie('_jwt'));
```

### Security Note
Udacity authentication token is a secret key to is unique to you
and you should not share it publicly.

The token also will expire automatically after a period of time.
If you find `udacimak`'s
`listnd` and `download` commands unusable, try to get the token again from
the browser and `settoken` with the new token.

### `listnd`: List your Nanodegree keys

To download the Nanodegrees, you need to know the Nanodegree key to
pass to the command.

Nanodegree key is simply an id that is assigned to a Nanodegree in the format
of `ndXXX`, `ndXXXt`, etc. where `XXX` is the number assigned to that
Nanodegree. You can see it in the Udacity classroom or catalog url.
The two examples below shows urls of Nanodegree key `nd1337`:

```
https://classroom.udacity.com/nanodegrees/nd1337/syllabus/core-curriculum
```

or

```
https://www.udacity.com/course/cybersecurity-nanodegree--nd1337
```

You can list the Nanodegree keys of the ones you have graduated and currently
enrolled in as such:

```shell
udacimak listnd
```

![listnd Example][example-listnd]

### Additional Information
Note that you for each Nanodegree you will have an associated version
and language (`locale`) that you can download. Udacity occasionally updates
their Nanodegree content, hence the Nanodegree version. You will only have
access to the latest version at the time you purchased the Nanodegree.

### Course key
Udacity also provides lots of free courses. If you're interested in downloading
these courses, head to https://www.udacity.com/courses/all, click on a course
that you're interested in and get its __key__ in the `url`. For example,
the course key in the `url` below is `ud281`:

```
https://www.udacity.com/course/high-performance-computing--ud281
```

### `download`: Download course content as JSON data from Udacity API

`download` command will fetch all necessary JSON data from Udacity API to
download them and save them locally:

```shell
udacimak download nd001

# or download multiple Nanodegree and courses:
udacimak download nd001 nd002 st101
```

![download Example GIF][example-download]

You can have a peek at these files to see what they contain.
The JSON data files are not "readable". But note that they're the core contents
that you need to save the Nanodegree/course locally to your computer.

To view the content in a readable manner, one could build a web app
that read the JSON files and render it in HTML format. This can be a tedious
process since you'll need to study the JSON structure built by Udacity
to process them. That is why `udacimak` provide `render` functionality to
render all the course contents into _static web pages_.

#### Note regarding workspaces
Udacity has a number of types of workspaces for projects and
quizzes/exercises, including Jupyter Notebook workspaces, IDE workspaces.
The files of these workspaces are not downloadable, so all your workspaces
will not be accessible from `udacimak`.

It is recommended that you download them manually. For Jupyter Notebook
workspaces, please refer to this [StackOverflow answer](https://stackoverflow.com/questions/48122744/how-to-download-all-files-and-folder-hierarchy-from-jupyter-notebook?rq=1) on how to download all files in one go.

Please also note that some of the workspace materials are available on Udaciy
Github page, so have a peek there first to see if you can clone them.

### `render`: Render downloaded JSON course contents

After you have downloaded all course content as JSON data from Udacity API,
it is now time to convert them into readable format. `render` command is
provided to do this:

```shell
# --targetdir is optional
udacimak render PATH_TO_DOWNLOADED_COURSE_JSON_DIRECTORY --targetdir OPTIONAL_TARGET_DIRECTORY
```

__Optional parameter:__
- `-v`, `--verbose`: Log additional debug information for Youtube download (logs will be produces by
[`youtube-dl`](https://rg3.github.io/youtube-dl/))


![Render Example GIF][example-render]

`render` command will:
- :white_check_mark: Create summary page for Nanodegree and all lessons to easily navigate the
course content and find all lessons
- :white_check_mark: For each lesson:
  - Download all videos (including subtitles), images and create lesson contents as HTML files to
  view on your favorite browser.
  - Create HTML files for project descriptions and project rubrics pages.

It is also :heavy_exclamation_mark: important to know
what `render` is not capable of:
- __Quiz__: for all quizzes:
  - :x: It is not possible to "submit" the quizzes to check for result from
  Udacity API. We simply can't have access to Udacity API to check the quizzes.
  - :x: For a few quiz types, (_Programming Quiz_ and _Image Format Quiz_) there are no solutions provided.
- :x: __Workspaces__: As noted [above](#note-regarding-workspaces), `udacimak`
can't download the workspace files for you. So the lesson pages that contain
workspaces will not display any workspace for you.

The process can take a few hours due to large amount of videos to download.
Once it is done, you can enjoy the lessons on your computer:

![HTML Lesson Example 01][example-html-lesson-01]

![HTML Lesson Example 02][example-html-lesson-02]

#### Re-rendering a course
If you cancel the command or the CLI is cut off for some reason (eg. the CLI
stops because internet is disconnected), or even the CLI is updated with new
rendering features (better formatting, fixing missing content, etc.)
you can re-run the render process later.
Just use the same command, the CLI will:
- NOT re-download video/image files that are already downloaded
- Re-create all HTML files

![rerender Example GIF][example-rerender]

As long as Udacimak sees that the folder name in the `--targetdir` dir (or the
current terminal working directory if `--targetdir` is not provided) is the
same as the source folder that contains course JSON data, it will
think that this is a re-render, and will avoid re-downloading any online
media files that already exist in the course folder.

### `renderdir`: Iteratively render multiple JSON course contents

This is a convenient method to render all the courses that you have downloaded.
If you have downloaded Nanodegree/course contents into a single directory,
you can use `renderdir` to render all of them:

```shell
udacimak renderdir PATH_TO_DIRECTORY
```

__Optional parameter:__
- `-v`, `--verbose`: Log additional debug information for Youtube download (logs will be produces by
[`youtube-dl`](https://rg3.github.io/youtube-dl/))

### Log Files
Please note that the CLI will produce log files in the working directory of
your terminal. The log files will include all CLI output of the commands.
If you face any issue, you may want to share the section of the log file content
that contains error log to the developer when reporting the issue.

## Note to Windows OS users:
Besides to a small setup hickup as noted [above](#windows-users-and-youtube-dl),
the CLI is prone to some known issues when using on Windows:
- 260-character file path limit: When facing this issue, you may have trouble
viewing video file, moving files, etc.
Windows will never fix this file path limitation, so...
- Chinese character in file name: Node application seems to have issue
working with file names that contain Chinese, Portuguese character on Windows.
So, when rendering the course JSON, it may fails to name the Youtube subtitle
files correctly.

It is recommended that you use a Linux system to download and render the
course to make sure all files are processed safely.

If you use Windows, you will need to accept that:
- You will have trouble moving/copying the downloaded/rendered course folder.
Though you can find softwares that can get around this issue for you.
- Subtitles won't be named
according to video files (so that video players such as [VLC](https://www.videolan.org/index.html)
can automatically detect them)

## Reporting Issues

Before reporting any issues, please make sure you're using the latest version
of `udacimak` first:

```shell
# show current version
npm list udacimak
# or
udacimak --version

# update udacimak
npm update -g udacimak

# check current version
udacimak --version
```

If the issue persists, please open issue in __Issues__ tab. Please give us
as much information as you can. However, note that you should not provide
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

[example-settoken]: https://github.com/udacimak/udacimak/raw/master/img/example-settoken.jpg
[example-listnd]: https://github.com/udacimak/udacimak/raw/master/img/example-listnd.jpg
[example-download]: https://github.com/udacimak/udacimak/raw/master/img/example-download.gif
[example-render]: https://github.com/udacimak/udacimak/raw/master/img/example-render.gif
[example-rerender]: https://github.com/udacimak/udacimak/raw/master/img/example-rerender.gif
[example-html-lesson-01]: https://github.com/udacimak/udacimak/raw/master/img/example-html-lesson-01.jpg
[example-html-lesson-02]: https://github.com/udacimak/udacimak/raw/master/img/example-html-lesson-02.jpg
