#include <QApplication>
#include "PresentationLayer.h"
#include "BusinessLayer.h"
#include "DataAccessLayer.h"
#include "util/socket/NetworkUtils.h"
#include "util/process/Process.h"

int testRunPrerequisites() //return 0 if all is ok, otherwise return the requisite that fails
{
    /* Run prerrequisites (TODO: Check system requirements)
     *
     * 1. Check if there is other societas instance running
     * 2. Check if the client have internet conectivity
     * 3. Check if the xmpp server is available

    */
    // TODO: get this parameter from a Config file
    std::string processName = "societas";
   // std::string xmppServer="xmpp.cambrian.org";
    std::string xmppServer="jabb3r.net";

        if (IsProcessRunning((wchar_t *)processName.c_str()))
            {
            std::cout << "There is another instance of Societas running, please close it and try again\n";
            return 1;
            }

   NetworkUtils networkUtils;

   if (!networkUtils.connectedToInternet()) // conected to internet
     {

         std::cout << "You doesn't have internet connection! Please check your network settings.";
         return 2;
     }

    if (!networkUtils.testNetworkService(xmppServer).compare("SERVICE UNAVAILABLE"))
       {
         std::cout << "The server: " << "  doesn´t have an xmpp service available.";
        return 3;
      }

return 0;
}



int main(int argc, char *argv[])
{    

    if (testRunPrerequisites()==0)
    {
    /// Instanciate Main Process
    QApplication mainProcess(argc, argv);
    qDebug()<<"*Main Societas Thread: "<<QThread::currentThreadId();

    /* Multi-Threading
     * PURPOSE:
     * Create a single process that runs multiple threads in paralell, having a single
     * message interchange mechanism to comunicate between all threads using zeroMQ,
     * websockets and Restful webservices.
     *
     */

    ///////////////////////BUSSINES LAYER THREAD
     BusinessLayerService businessServiceThread;
     // destroy the Bussines Thread before kill the main process
     QObject::connect(&mainProcess, SIGNAL(aboutToQuit()), &businessServiceThread, SLOT(sl_quit()));
     //start Bussines service Thread
     businessServiceThread.start();


   ///////////////////////APPLICATION LAYER THREAD
      ApplicationService appServiceThread;
      // destroy the Application Thread before kill the main process
      QObject::connect(&mainProcess, SIGNAL(aboutToQuit()), &appServiceThread, SLOT(sl_quit()));
      //start application service Thread
      appServiceThread.start();

   ///////////////////////DATA ACCESS THREAD
       DataAccessService dataAccessServiceThread;
       // destroy the Application Thread before kill the main process
       QObject::connect(&mainProcess, SIGNAL(aboutToQuit()), &dataAccessServiceThread, SLOT(sl_quit()));
       //start application service Thread
       dataAccessServiceThread.start();

   ///////////////////////PRESENTATION LAYER
    MainWindow societasMainWindow;
    QObject::connect(&mainProcess, SIGNAL(aboutToQuit()), &societasMainWindow, SLOT(SL_Quitting()));
    societasMainWindow.show();

    mainProcess.exec();


   } //test run prerequistes
   return 0;
}
