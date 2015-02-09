#ifndef NETWORKUTILS_H
#define NETWORKUTILS_H
#include <iostream>
// Utility Network class to perform all the activities related with network to support Data Access Layer
class NetworkUtils
{
 public:

    std::string getIpAddresFromHost(std::string hostname);
    std::string testNetworkService(std::string hostname, int port=5222, std::string testString = "GET / \n \n");
    std::string getXmppHeader(std::string hostname);
    bool connectedToInternet();
};

#endif // NETWORKUTILS_H
