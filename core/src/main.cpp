#include <QApplication>
#include "PresentationLayer.h"
#include "BusinessLayer.h"
#include "DataAccessLayer.h"
#include "util/socket/NetworkUtils.h"
#include "util/process/Process.h"
#include  <QStringList>
#include <QProcess>
#include <QRegularExpression>
#include <QDebug>

QProcess sails;  // SailsJs using Qprocess

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
    std::string xmppServer="conversejs.org";

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

    /* =====================Start Node Js processes=======================================*/

    // Setting up the path to locate the nodejs executable

     QProcessEnvironment env = QProcessEnvironment::systemEnvironment();
     QStringList envlist = env.toStringList();
     QString AppPath= QCoreApplication::applicationDirPath();
     QString sailsWorkingDir;
     QString executablesPath;
     QString sailsCommand;

     #ifdef Q_OS_UNIX

     sailsWorkingDir = AppPath+"/apps/Huevon/";
     executablesPath = "PATH=/usr/local/bin:$HOME/bin:\\1";
     sailsCommand = "/usr/local/bin/sails lift";

     #else
      // Executable path for windows
       sailsWorkingDir = AppPath+"\apps\Huevon\";
     executablesPath = "c:\path\to\executables";
     sailsCommand = "c:\path\to\sails\executable sails lift";
     #endif

     envlist.replaceInStrings(QRegularExpression("^(?i)PATH=(.*)"), executablesPath);
     // set the environment to the process
     sails.setEnvironment(envlist);
     // set the working directory, for sails, the sails app folder
     sails.setWorkingDirectory(sailsWorkingDir);
     // run the nodejs app.  for this example lift sails app
     sails.start(sailsCommand);

     sails.waitForStarted();
       if (sails.errorString().compare("Unknown error")!=0)
          qDebug() << "Error String content:" << sails.errorString();



    /* Multi-Threading
     * PURPOSE:
     * Create a single process that runs multiple threads in paralell, having a single
     * message interchange mechanism to comunicate between all threads using zeroMQ,
     * websockets and Restful webservices.
     *
     */
       ///////////////////////DATA ACCESS THREAD
       DataAccessService dataAccessServiceThread;
       // destroy the Application Thread before kill the main process
       QObject::connect(&mainProcess, SIGNAL(aboutToQuit()), &dataAccessServiceThread, SLOT(sl_quit()));
       //start application service Thread
       dataAccessServiceThread.start();

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



   ///////////////////////PRESENTATION LAYER
    MainWindow societasMainWindow;
    QObject::connect(&mainProcess, SIGNAL(aboutToQuit()), &societasMainWindow, SLOT(SL_Quitting()));
    societasMainWindow.show();

    mainProcess.exec();


   } //test run prerequistes
   return 0;
}
