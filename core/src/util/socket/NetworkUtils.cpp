#include <../include/util/socket/NetworkUtils.h>
#include "../include/util/socket/ClientSocket.h"
#include "../include/util/socket/SocketException.h"

#include <iostream>
#include <string>

// check if the local machine have internet access by testing a couple of high available services on internet
bool NetworkUtils::connectedToInternet()
{

    if (testNetworkService("google.com",80).compare("SERVICE UNAVAILABLE")!=0 ||
        testNetworkService("yahoo.com",80).compare("SERVICE UNAVAILABLE")!=0
        )
     return true;
    else
     return false;
}

std::string NetworkUtils::getXmppHeader(std::string hostname)
{
    return testNetworkService(hostname); //return the xmppHeader
}

std::string NetworkUtils::getIpAddresFromHost(std::string hostname)
{
char * chHostname=(char *)hostname.c_str();
hostent * record = gethostbyname(chHostname);

    if(record == NULL)
        {
         return "HOST NOT FOUND";
        }
  // Host found get the ip address
    in_addr * address = (in_addr * )record->h_addr;
    std::string ip_address (inet_ntoa(* address));
    return ip_address;

}

std::string NetworkUtils::testNetworkService(std::string hostname,int port,std::string testString)
{
    std::string ip_address = getIpAddresFromHost(hostname);
    if (ip_address.compare("HOST NOT FOUND")==0)
        return "SERVICE UNAVAILABLE";

    // ip address found, check if the service is avalilable
    try
       {

         ClientSocket client_socket ( ip_address, port );
         std::string reply;

         try
       {

         client_socket << testString.c_str();
         client_socket >> reply;
       }
         catch ( SocketException& ) {}
         std::cout << "Service is Available. Header: \n\"" << reply << "\"\n";
          return reply;

       }
     catch ( SocketException& e )
       {
         std::cout << "Service Unavailable Error:" << e.description() << "\n";
         return "SERVICE UNAVAILABLE";
       }

}




