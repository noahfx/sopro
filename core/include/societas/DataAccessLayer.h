#ifndef DATAACCESSLAYER_H
#define DATAACCESSLAYER_H
#include <DataAccessLayer/xmppClient.h>
#include <QtCore>
using namespace std;

class DataAccessService : public QThread // Implement Data Access Layer Thread
{
    Q_OBJECT

        void run();
         // xmpp Services methods
        string xmpp_Login(string strJid, string strPassword );
        string xmpp_Logout();
        string xmpp_sendMessage(string recipient,string message);
        string xmpp_retrieveMessages();

   /// sqllite Services methods
   /// 0mq Services methods



    private slots:
    void sl_quit();
    private:
         //TODO: create a "config.xx" file that contains all the parameters of the system
         //      instead of parameter hardcoding
         const string xmppServer = "conversejs.org";
         const string xmppResource = "";
         bool loggedIn;

};

#endif // DATAACCESSLAYER_H
