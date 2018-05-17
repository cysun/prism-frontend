# Program Review Information System Management (PRISM)
This repository contains the client-side portion of the system. See the server-side repository [here.](https://github.com/amclees/prism-api)

## About
Program Review Information System Management (PRISM) is a document and workflow management full-stack web application tailored to the need of the Program Review Subcommittee (PRS) at California State University of Los Angeles (CSULA). Prior to the introduction of PRISM, the PRS collaborated on documents, distributed templates, and coordinated meetings using email. The intent of PRISM is to streamline the process by providing a single site where all functions of program review may be conducted. PRISM is a web application supporting document collaboration, review progress tracking, template management, email notifications, calendar events, and modeling of the university's hierarchical structure. It greatly simplifies the workflow of the PRS and the department chairs, deans, and external reviewers who also partake in the review process.

There are two main components of PRISM: an HTTP API and a single-page application which together form a MEAN stack. The HTTP API is implemented in Node.js with Express and Mongoose. The frontend is implemented in Angular 5. This separation of frontend and backend was a fundamental design decision in PRISM and greatly simplified the team's development process. The HTTP API does not fulfill the hypermedia constraint or uniform interface contraint of RESTful services; thus, it is not a REST API (though it closely resembles one).

 PRISM is expected to greatly streamline the existing CSULA program review process in future years. Testing conducted thus far has suggested that it will be far superior to email for document collaboration, but additional testing is required before the project code is finalized.
 
### Information
There are 3 main groups (but not limited to) and external uploaders that have different access to the system.
* **Administrators** have access to all parts of the system and are responsible for finalizing documents, adding and removing members from groups, issuing external upload links, creating reviews, updating the university hierarchy with next review dates, and creating templates for reviews. 
* **PRS** are responsible for collaboration on documents of active reviews. Lead reviewer(s) may be assign to each review to lead and discuss with other PRS members when drafting documents. PRS will also have access to upload and download resources along with full functionality of the calendar.
* **College Deans** and **Department Chairs** will *only* have access to their program reviews. They are also restricted from seeing documents they are not a part of in a review. The comment system of a document is completely optional for these users.
* **External uploaders** will be issued a link via e-mail to upload their reports. They do not have any login information to the system so they will only have access to the external upload page. Once they upload their reports, they may not re-submit it and must contact the Administrator for another link if needed.

### Setup
These instructions assume that NodeJS, NPM, and MongoDB are already installed on the computer being set up.
1. Follow server-side setup instructions [here.](https://github.com/amclees/prism-api/blob/master/README.md)
2. Clone this repository.
3. Run `npm install` from the project root to install dependencies for the client-side.

### Run
Run `npm start` command after starting the database on server-side.

### Screenshots
<p align="center">
<img src="https://docs.google.com/uc?id=1SAAsgWxAiX8lvxbRMRMnyilGa-hup_xx" width="800" height="438">
<img src="https://docs.google.com/uc?id=1aEDLOCehgFOfgChWhKCnzEHojN4jdHur" width="800" height="438">
<img src="https://docs.google.com/uc?id=1jgmcVhsXAqU5_c3RsW2W-JIjh8-V_A9O" width="800" height="438">
</p>

### Credits
* [angular-calendar](https://github.com/mattlewis92/angular-calendar)
* [font-awesome](https://fontawesome.com/icons?d=gallery&m=free) for icons
* [leannedavid](https://github.com/leannedavid) for PRISM logo
* [ng-bootstrap](https://ng-bootstrap.github.io/#/home) as chosen UI library
* [ng-selectize](https://github.com/NicholasAzar/ng-selectize)
