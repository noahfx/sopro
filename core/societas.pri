INCLUDEPATH += ../include
HEADERS += \
    $$PWD/include/societas/PresentationLayer.h \
    $$PWD/include/societas/ApplicationLayer.h \
    $$PWD/include/societas/BusinessLayer.h \
    $$PWD/include/societas/DataAccessLayer/xmppClient.h \
    $$PWD/include/societas/BusinessLayer.h \
    $$PWD/include/societas/DataAccessLayer.h \
    $$PWD/include/societas/DataAccessLayer/webSocketClient.h \
    $$PWD/include/util/socket/clientSocket.h \
    $$PWD/include/util/socket/Socket.h \
    $$PWD/include/util/socket/SocketException.h \
    $$PWD/include/util/socket/NetworkUtils.h \
    $$PWD/include/util/process/Process.h



SOURCES += \
    $$PWD/src/main.cpp \
    $$PWD/src/PresentationLayer.cpp \
    $$PWD/src/ApplicationLayer.cpp \
    $$PWD/src/BusinessLayer.cpp \
    $$PWD/src/DataAccessLayer/xmppClient.cpp \
    $$PWD/src/DataAccessLayer.cpp \
    $$PWD/src/DataAccessLayer/webSocketClient.cpp \
    $$PWD/src/util/socket/clientSocket.cpp \
    $$PWD/src/util/socket/Socket.cpp \
    $$PWD/src/util/socket/NetworkUtils.cpp \




FORMS += $$PWD/src/forms/MainWindow.ui

