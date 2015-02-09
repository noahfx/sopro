#ifndef APPLAYER_H
#define APPLAYER_H

/* Restful Json Api

  Restfull api is designed to embedd a "mongoose http server" that serves Restful webservices.
  the whole servers runs parallel in a gui separate thread.

*/

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <iostream>
#include <QtCore>
#include "mongoose/Mongoose.h"
#include <fstream>

//#include <BussinesLayer> // use the Sopro Api to access to all the logic for example

//aditional server headers
static const char *s_no_cache_header =
  "Cache-Control: max-age=0, post-check=0, "
  "pre-check=0, no-store, no-cache, must-revalidate\r\n";

static const char *s_login_uri = "/login.html";
static const char *s_error_uri = "/error.html";
static const char *s_authenticated_uri = "/index.html";
static const char *s_notfound_uri = "/notfound.html";
static  char *s_secret =NULL;  // This value changes when the user logins

/* Api matrix contains the list of all valid Api´s
 * The first element of the array contains the api entry point and from the 1 to n positions contains the restful webservice name
 * Change apiMatrix size to add a new api entry and add
 Example
 apimatrix[0][0] contains the api entry point for crypto functions
 apimatrix[0][1] contains the first method called secure.random

 @ = available space for new method

 Then the coordinate xy of secure.random  is 0,1 useful to map the webservice call with a correspondant BusinessLayer call

*/

// IMPORTANT: modifiy the next two values to expand the matrix
const int maxNamespaces=4;
const int maxMethod=10; // amount of methods
const std::string apiMatrix[maxNamespaces][maxMethod] =
                                {
                                  {"management","create","@","@","@","@","@","@","@","@"}, /// Role Management Namespace
                                  {"xmpp","send","@","@","@","@","@","@","@","@"}, /// Chat Namespace
                                  {"files","upload","@","@","@","@","@","@","@","@"},
                                  {"test","mult","@","@","@","@","@","@","@","@"},
                                  //{"@","@","@","@","@","@","@","@","@","@"} //remember to increase maxNamespaces
                                }
        ;


class ApplicationService : public QThread // Implement Application Layer Thread
 {
     Q_OBJECT

     void run();
     static int check_login_form_submission(struct mg_connection *conn);
     struct mg_server *server;
     static void ApiWrap_Mult(struct mg_connection *conn);
     static void ApiWrap_OT(struct mg_connection *conn,int type);
     static int  ev_handler(struct mg_connection *conn, enum mg_event ev);
     static int  serve_request(struct mg_connection *conn);
     static int  route_api_requests(struct mg_connection *conn);
     static void push_message(struct mg_server *server, time_t current_time);
     static int send_reply(struct mg_connection *conn);


 private slots:
      void sl_quit();

 private:
     static std::string getRequestParameter(mg_connection *conn, std::string parameterName);
     static bool parseApiRoute(std::string restUri, int &namespaceCode, int &methodCode);
};

#endif // APPLAYER_H
