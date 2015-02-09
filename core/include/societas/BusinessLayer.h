#ifndef BusinessLayer_H
#define BusinessLayer_H
/*
BusinessLayer is an Api entry point to all Sopro logic.

BusinessLayer was designed to receive a call originated from restful webservice request (served by mongoose)
As a midle tier component, it has some services to facilitate the api routing to the webserver
*/
#include <QtCore>
#include <iostream>
#include <qglobal.h>
#include <QTime>
#include <QJsonDocument>
#include <QJsonObject>
#include <QVariant>
#include <iostream>
#include <string>

class BusinessLayerService: public QThread // Implement Bussines Layer Thread
{
    Q_OBJECT

    void run();
// starts the listener for  zeroMQ Rep socket
    void startZMQRep();
//crypto methods
    std::string crypto_secureRandom(int low, int high,std::string source);
//test methods
    std::string test_Mult(int n1, int n2);

//json management
    bool addJSonAttribute(QJsonObject &json, QString attribute,QString value);
    bool getJsonAttribute(QJsonObject &json, QString attribute,QString &value);
    std::string jsonDocumentString(QJsonObject json);
    QJsonObject stringDocumentJson(QString strJson);

private slots:
     void sl_quit();

private:
     //TODO: create a "config.xx" file that contains all the parameters of the system
     //      instead of parameter hardcoding
     const std::string zmqRepReqPort = "38001";

};

#endif // BusinessLayer_H
