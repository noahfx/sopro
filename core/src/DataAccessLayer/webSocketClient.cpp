#include "DataAccessLayer/webSocketClient.h"
#include <QtCore/QDebug>

QT_USE_NAMESPACE

EchoClient::EchoClient(const QUrl &url,const QString &message, QObject *parent) :
    QObject(parent),
    m_url(url),
    m_message(message)
{
    connect(&m_webSocket, &QWebSocket::connected, this, &EchoClient::onConnected);
    connect(&m_webSocket, &QWebSocket::disconnected, this, &EchoClient::closed);
    m_message=message;

    m_webSocket.open(QUrl(url));

    if (!m_webSocket.isValid())
    {
        qDebug() << "Failed to open the websocket";
    }
}

void EchoClient::onConnected()
{
    qDebug() << "WebSocket connected";
    connect(&m_webSocket, &QWebSocket::textMessageReceived,
            this, &EchoClient::onTextMessageReceived);
    m_webSocket.sendTextMessage(m_message);
}

void EchoClient::onTextMessageReceived(QString message)
{
    qDebug() << "Message received:" << message;
    m_webSocket.close();
}
