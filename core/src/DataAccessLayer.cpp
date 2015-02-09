#include <DataAccessLayer.h>

 xmppClient *p_xmppClient = new xmppClient();
 bool quitting;
 ///======================================DATA ACCESS THREAD MANAGEMENT ===========================================
 //protected method that start the Data Access services into a separate thread
 void DataAccessService::run()
     {  quitting=false;
        qDebug()<<"Data Access process thread: " << currentThreadId();

        // Check if the xmpp Sever is available


        ConnectionError ce = gloox::ConnNoError;
         //TODO: Store the default identity (or the last used) to be used in the next line:
                                   //user          //path             //password
               // using SQLlite database


        std::string strXmppLoginResult = xmpp_Login("societas","123456789");

        // TODO:  Implement a util library that output the log
        qDebug() << "To Log: " << QString::fromStdString(strXmppLoginResult);

        // Here the thread continue starting, but if the connection can´t be established
        // the bussiness logic will be notified that the connection can´t be established
        // and handle following its rules.

        time_t current_timer_X = 0, last_timer_X = time(NULL);

       // infinite loop to receive xmpp events and messages
        forever
            {
            current_timer_X = time(NULL);

            if (current_timer_X - last_timer_X > 0)
                {
                last_timer_X = current_timer_X;
                // xmpp Client receiving events
                  ce = p_xmppClient->receiveXmppMessages();
                }

            if (quitting) break;

            }//forever
     }




 std::string DataAccessService::xmpp_Login(std::string strJid,std::string strPassword )
    {
       ConnectionError ce=gloox::ConnNoError;

       if (!loggedIn)
        {
           ce = p_xmppClient->startXmppSession(strJid,xmppServer,xmppResource,strPassword);
        }
       else // there is a connection logout and login
        {
           xmpp_Logout();
           ce = p_xmppClient->startXmppSession(strJid,xmppServer,xmppResource,strPassword);

        }
       QString qCurrTime= QTime::currentTime().toString();

       if (ce == gloox::ConnNotConnected)
        {
           loggedIn=false;
           return "["+qCurrTime.toStdString()+"] -FAIL- Failed to connect to XMPP server, please check the log";

        }
       else
        {
           loggedIn=true;
           return "["+qCurrTime.toStdString()+"] -OK- Connection Successful..code ";

        }
     }

std::string DataAccessService::xmpp_Logout()
    {
        p_xmppClient->finishXmppSession();
    }

std::string DataAccessService::xmpp_sendMessage(std::string recipient,std::string message)
    {
        return "ok";
    }
std::string DataAccessService::xmpp_retrieveMessages()
    {
        return "ok";
    }


////SLOTS
void DataAccessService::sl_quit()
{   quitting=true;
    qDebug()<<"Closing Data Access Service thread: "<< QThread::currentThreadId();
    terminate();
}

