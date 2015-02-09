#include <QtCore/QObject>
#include <QtWebSockets/QWebSocket>

class EchoClient : public QObject
{
    Q_OBJECT
public:
    explicit EchoClient(const QUrl &url, const QString &message, QObject *parent = Q_NULLPTR);

Q_SIGNALS:
    void closed();

private Q_SLOTS:
    void onConnected();
    void onTextMessageReceived(QString message);

private:
    QWebSocket m_webSocket;
    QUrl m_url;
    QString m_message;
};

